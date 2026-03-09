import { useState, useRef, useEffect, useCallback } from 'react';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Send, Sparkles, Trash2, ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CardImportBlock from '@/components/CardImportBlock';

type MessageContent =
  | string
  | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }>;

type Message = { role: 'user' | 'assistant'; content: MessageContent };

function getTextContent(content: MessageContent): string {
  if (typeof content === 'string') return content;
  return content
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map(p => p.text)
    .join('');
}

function getImages(content: MessageContent): string[] {
  if (typeof content === 'string') return [];
  return content
    .filter((p): p is { type: 'image_url'; image_url: { url: string } } => p.type === 'image_url')
    .map(p => p.image_url.url);
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/card-advisor`;

const SUGGESTIONS = [
  "What card should I get next?",
  "Am I eligible for the Chase Sapphire Reserve?",
  "What's the best strategy to get both Sapphire cards?",
  "How do I maximize Amex Platinum benefits?",
  "Should I downgrade or cancel my card before the annual fee hits?",
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const STORAGE_KEY = 'card-advisor-messages';

function loadMessages(): Message[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

export default function AdvisorPage() {
  const { cards } = useCards();
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch { /* ignore quota errors */ }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = useCallback(async (allMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: allMessages,
        userCards: cards,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || `Request failed (${resp.status})`);
    }

    if (!resp.body) throw new Error('No response body');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let assistantContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === 'assistant') {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: 'assistant', content: assistantContent }];
            });
          }
        } catch {
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }

    // Flush remaining buffer
    if (buffer.trim()) {
      for (let raw of buffer.split('\n')) {
        if (!raw) continue;
        if (raw.endsWith('\r')) raw = raw.slice(0, -1);
        if (!raw.startsWith('data: ')) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantContent += content;
            setMessages(prev =>
              prev.map((m, i) =>
                i === prev.length - 1 && m.role === 'assistant'
                  ? { ...m, content: assistantContent }
                  : m
              )
            );
          }
        } catch { /* ignore */ }
      }
    }
  }, [cards]);

  const send = async (text?: string) => {
    const messageText = text || input.trim();
    if ((!messageText && pendingImages.length === 0) || isLoading) return;

    let userContent: MessageContent;
    if (pendingImages.length > 0) {
      const parts: MessageContent = [];
      if (messageText) {
        parts.push({ type: 'text', text: messageText });
      } else {
        parts.push({ type: 'text', text: 'Please analyze this image and extract any credit card information you can find.' });
      }
      for (const img of pendingImages) {
        parts.push({ type: 'image_url', image_url: { url: img } });
      }
      userContent = parts;
    } else {
      userContent = messageText;
    }

    const userMsg: Message = { role: 'user', content: userContent };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setPendingImages([]);
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Failed to get response');
      setMessages(prev => {
        if (prev[prev.length - 1]?.role === 'assistant' && prev[prev.length - 1]?.content === '') {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are supported');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be under 10MB');
        continue;
      }
      const base64 = await fileToBase64(file);
      setPendingImages(prev => [...prev, base64]);
    }
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const base64 = await fileToBase64(file);
          setPendingImages(prev => [...prev, base64]);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setPendingImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
    setPendingImages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Card Advisor
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-powered credit card strategy advisor · {cards.filter(c => c.status === 'active').length} active cards in context
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground">
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
            <div className="space-y-2">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Card Strategy Advisor</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Ask me about your next card, upgrade/downgrade strategies, eligibility, or upload a screenshot of your credit report to import cards.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-2 rounded-full border bg-card hover:bg-accent/50 transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-3 max-w-3xl',
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            )}
          >
            <div className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
              msg.role === 'user' ? 'bg-primary' : 'bg-muted'
            )}>
              {msg.role === 'user' ? (
                <User className="h-4 w-4 text-primary-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-foreground" />
              )}
            </div>
            <Card className={cn(
              'p-4 max-w-[85%]',
              msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'
            )}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-card-import/.test(className || '');
                        if (match) {
                          return <CardImportBlock jsonString={String(children).trim()} />;
                        }
                        return <code className={className} {...props}>{children}</code>;
                      },
                      pre({ children }) {
                        return <>{children}</>;
                      },
                    }}
                  >
                    {getTextContent(msg.content) || '...'}
                  </ReactMarkdown>
                </div>
              ) : (
                <div>
                  {getImages(msg.content).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {getImages(msg.content).map((img, j) => (
                        <img
                          key={j}
                          src={img}
                          alt="Uploaded"
                          className="max-h-40 rounded-md border border-primary-foreground/20"
                        />
                      ))}
                    </div>
                  )}
                  {getTextContent(msg.content) && (
                    <p className="text-sm whitespace-pre-wrap">{getTextContent(msg.content)}</p>
                  )}
                </div>
              )}
            </Card>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-foreground animate-pulse" />
            </div>
            <Card className="p-4 bg-card">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t pt-4">
        {/* Pending image previews */}
        {pendingImages.length > 0 && (
          <div className="flex flex-wrap gap-2 max-w-3xl mx-auto mb-2">
            {pendingImages.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="Upload preview" className="h-16 rounded-md border" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 h-[44px] w-[44px]"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="Upload image"
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Ask about card strategy, paste an image, or get recommendations..."
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={() => send()}
            disabled={(!input.trim() && pendingImages.length === 0) || isLoading}
            size="icon"
            className="shrink-0 h-[44px] w-[44px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
