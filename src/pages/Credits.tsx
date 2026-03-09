import { useState, useMemo } from 'react';
import { useCards } from '@/context/CardContext';
import { CardBenefit, CreditResetType, BenefitValueType } from '@/types/cards';
import { getBenefitStatus, formatDate } from '@/lib/dateUtils';
import { addMonths, format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Pencil, Trash2, Search, Check, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const emptyBenefit: Omit<CardBenefit, 'id'> = {
  cardId: '', name: '', creditType: 'monthly', valueType: 'dollar', totalAmount: 0, amountUsed: 0, notes: '',
};

const statusBadge = (status: string) => {
  switch(status) {
    case 'fully-used': return <Badge className="bg-muted text-muted-foreground">Fully Used</Badge>;
    case 'partially-used': return <Badge className="bg-info/10 text-info border-info/20">Partial</Badge>;
    case 'expiring-soon': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Expiring</Badge>;
    default: return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Unused</Badge>;
  }
};

function formatBenefitValue(b: CardBenefit) {
  if (b.valueType === 'certificate') {
    if (b.totalAmount >= 1000) {
      return `${(b.totalAmount / 1000).toFixed(0)}K pts`;
    }
    return `${b.totalAmount}`;
  }
  if (b.valueType === 'points') {
    if (b.totalAmount >= 1000) {
      return `${(b.totalAmount / 1000).toFixed(0)}K pts`;
    }
    return `${b.totalAmount} pts`;
  }
  return `$${b.totalAmount}`;
}

function formatBenefitProgress(b: CardBenefit) {
  if (b.valueType === 'certificate' || b.valueType === 'points') {
    return b.amountUsed > 0 ? 'Redeemed' : 'Not redeemed';
  }
  return `$${b.amountUsed} / $${b.totalAmount}`;
}

function getNextResetDate(b: CardBenefit, cardOpenDate?: string): string | null {
  const now = new Date();
  const currentYear = now.getFullYear();

  if (b.creditType === 'anniversary-year' && cardOpenDate) {
    const open = parseISO(cardOpenDate);
    const anniversaryMonth = open.getMonth();
    const anniversaryDay = open.getDate();
    let next = new Date(currentYear, anniversaryMonth, anniversaryDay);
    if (next <= now) next = new Date(currentYear + 1, anniversaryMonth, anniversaryDay);
    return format(next, 'MMM d, yyyy');
  }

  if (b.resetDate) return format(parseISO(b.resetDate), 'MMM d, yyyy');

  return null;
}

export default function Credits() {
  const { cards, benefits, addBenefit, updateBenefit, deleteBenefit, getCardById } = useCards();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (cardId: string) => {
    setCollapsedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CardBenefit | null>(null);
  const [form, setForm] = useState<Omit<CardBenefit, 'id'>>(emptyBenefit);

  const activeCards = cards.filter(c => c.status === 'active');

  const filtered = useMemo(() => {
    return benefits
      .filter(b => {
        const card = getCardById(b.cardId);
        if (!card || card.status !== 'active') return false;
        if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
        const status = getBenefitStatus(b);
        if (filterStatus !== 'all' && status !== filterStatus) return false;
        if (filterType !== 'all' && b.creditType !== filterType) return false;
        return true;
      })
      .sort((a, b) => {
        const cardA = getCardById(a.cardId)?.name || '';
        const cardB = getCardById(b.cardId)?.name || '';
        return cardA.localeCompare(cardB);
      });
  }, [benefits, search, filterStatus, filterType, getCardById]);

  function openAdd() { setEditing(null); setForm({...emptyBenefit, cardId: activeCards[0]?.id || ''}); setDialogOpen(true); }
  function openEdit(b: CardBenefit) { setEditing(b); setForm({...b}); setDialogOpen(true); }
  function handleSave() {
    if (!form.name || !form.cardId) { toast.error('Name and card required'); return; }
    if (editing) { updateBenefit({...form, id: editing.id}); toast.success('Benefit updated'); }
    else { addBenefit({...form, id: crypto.randomUUID()}); toast.success('Benefit added'); }
    setDialogOpen(false);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Credits & Benefits</h1>
          <p className="text-sm text-muted-foreground">{benefits.length} benefits tracked</p>
        </div>
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Add Benefit</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search benefits..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unused">Unused</SelectItem>
            <SelectItem value="partially-used">Partial</SelectItem>
            <SelectItem value="fully-used">Fully Used</SelectItem>
            <SelectItem value="expiring-soon">Expiring</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="semi-annual">Semi-Annual</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
            <SelectItem value="anniversary-year">Anniversary</SelectItem>
            <SelectItem value="one-time">One-Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {(() => {
          const groups: { cardId: string; cardName: string; issuer: string; openDate: string; benefits: typeof filtered }[] = [];
          for (const b of filtered) {
            const card = getCardById(b.cardId);
            if (!card) continue;
            let group = groups.find(g => g.cardId === card.id);
            if (!group) {
              group = { cardId: card.id, cardName: card.name, issuer: card.issuer, openDate: card.openDate, benefits: [] };
              groups.push(group);
            }
            group.benefits.push(b);
          }

          return groups.map(group => {
            const isOpen = collapsedCards[group.cardId] !== true;
            return (
              <Collapsible key={group.cardId} open={isOpen} onOpenChange={() => toggleCard(group.cardId)}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="text-left">
                      <h3 className="text-sm font-semibold text-foreground">{group.cardName}</h3>
                      <p className="text-xs text-muted-foreground">{group.issuer} · Opened {formatDate(group.openDate, 'MMM yyyy')} · {group.benefits.length} benefit{group.benefits.length !== 1 ? 's' : ''}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid gap-2 pl-2 mt-2">
                    {group.benefits.map(b => {
                      const status = getBenefitStatus(b);
                      const isDollar = b.valueType === 'dollar';
                      const isRedeemable = b.valueType === 'certificate' || b.valueType === 'points';
                      const pct = isDollar && b.totalAmount > 0 ? Math.round((b.amountUsed / b.totalAmount) * 100) : (b.amountUsed > 0 ? 100 : 0);
                      const resetDate = getNextResetDate(b, group.openDate);
                      return (
                        <Card key={b.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium">{b.name}</span>
                                  {statusBadge(status)}
                                  <Badge variant="outline" className="text-xs capitalize">{b.creditType}</Badge>
                                  {isRedeemable && (
                                    <Badge variant="secondary" className="text-xs">{formatBenefitValue(b)}</Badge>
                                  )}
                                </div>
                                <div className="mt-2 flex items-center gap-3">
                                  {isDollar ? (
                                    <>
                                      <Progress value={pct} className="flex-1 h-2" />
                                      <span className="text-sm font-mono whitespace-nowrap">
                                        ${b.amountUsed} / ${b.totalAmount}
                                      </span>
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      {b.amountUsed > 0 ? (
                                        <span className="flex items-center gap-1 text-sm text-success font-medium"><Check className="h-4 w-4" /> Redeemed</span>
                                      ) : (
                                        <span className="flex items-center gap-1 text-sm text-muted-foreground"><X className="h-4 w-4" /> Not redeemed</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                                  {resetDate && <p className="text-xs text-muted-foreground">Resets {resetDate}</p>}
                                  {b.expirationDate && <p className="text-xs text-muted-foreground">Expires {formatDate(b.expirationDate)}</p>}
                                </div>
                                {b.notes && <p className="text-xs text-muted-foreground mt-1">{b.notes}</p>}
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openEdit(b); }}><Pencil className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); deleteBenefit(b.id); toast.success('Deleted'); }}><Trash2 className="h-3 w-3" /></Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          });
        })()}
        {filtered.length === 0 && <p className="text-center py-8 text-muted-foreground">No benefits found</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Benefit' : 'Add Benefit'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div>
              <Label>Card</Label>
              <Select value={form.cardId} onValueChange={v => setForm({...form, cardId: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{activeCards.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Credit Type</Label>
                <Select value={form.creditType} onValueChange={v => setForm({...form, creditType: v as CreditResetType})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['monthly','quarterly','semi-annual','annual','anniversary-year','one-time'] as const).map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Value Type</Label>
                <Select value={form.valueType} onValueChange={v => setForm({...form, valueType: v as BenefitValueType})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dollar">Dollar ($)</SelectItem>
                    <SelectItem value="points">Points/Miles</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.valueType === 'dollar' ? (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Total Amount ($)</Label><Input type="number" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: Number(e.target.value)})} /></div>
                <div><Label>Amount Used ($)</Label><Input type="number" value={form.amountUsed} onChange={e => setForm({...form, amountUsed: Number(e.target.value)})} /></div>
              </div>
            ) : form.valueType === 'points' ? (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Points/Miles Amount</Label><Input type="number" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: Number(e.target.value)})} /></div>
                <div className="flex items-end gap-2 pb-1">
                  <Switch checked={form.amountUsed > 0} onCheckedChange={v => setForm({...form, amountUsed: v ? form.totalAmount : 0})} />
                  <Label>Redeemed</Label>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Point Value (if applicable)</Label><Input type="number" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: Number(e.target.value)})} placeholder="e.g. 35000" /></div>
                <div className="flex items-end gap-2 pb-1">
                  <Switch checked={form.amountUsed > 0} onCheckedChange={v => setForm({...form, amountUsed: v ? 1 : 0})} />
                  <Label>Redeemed</Label>
                </div>
              </div>
            )}
            <div><Label>Expiration Date</Label><Input type="date" value={form.expirationDate || ''} onChange={e => setForm({...form, expirationDate: e.target.value || undefined})} /></div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Add'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
