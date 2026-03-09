import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCards } from '@/context/CardContext';
import { CreditCard, CardBenefit } from '@/types/cards';
import { knownCards } from '@/data/knownCards';
import { Check, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CardImportBlockProps {
  jsonString: string;
}

export default function CardImportBlock({ jsonString }: CardImportBlockProps) {
  const { addCard, addBenefit } = useCards();
  const [imported, setImported] = useState(false);
  const [importing, setImporting] = useState(false);

  let parsedCards: any[] = [];
  try {
    parsedCards = JSON.parse(jsonString);
    if (!Array.isArray(parsedCards)) parsedCards = [parsedCards];
  } catch {
    return <pre className="text-xs text-destructive">Invalid card data</pre>;
  }

  const handleImport = async () => {
    setImporting(true);
    try {
      for (const c of parsedCards) {
        const cardId = crypto.randomUUID();
        const card: CreditCard = {
          id: cardId,
          name: c.name || 'Unknown Card',
          issuer: c.issuer || 'Unknown',
          network: c.network || 'Visa',
          openDate: c.openDate || new Date().toISOString().slice(0, 10),
          cardType: c.cardType || 'personal',
          status: c.status || 'active',
          annualFee: c.annualFee ?? 0,
          annualFeeMonth: c.annualFeeMonth ?? (c.openDate ? new Date(c.openDate).getMonth() + 1 : 1),
          countsToward524: c.countsToward524 ?? true,
          signupBonusDate: c.signupBonusDate || undefined,
          productChangeDate: c.productChangeDate || undefined,
          lastAnnualFeeDate: c.lastAnnualFeeDate || undefined,
          category: c.category || 'other',
          decision: 'undecided',
          tags: c.tags || [],
          notes: c.notes || '',
          starred: false,
        };
        await addCard(card);

        // Auto-populate benefits from knownCards database
        const knownCard = knownCards.find(
          k => k.name.toLowerCase() === card.name.toLowerCase()
        );
        if (knownCard && knownCard.benefits.length > 0 && card.status === 'active') {
          for (const kb of knownCard.benefits) {
            const benefit: CardBenefit = {
              id: crypto.randomUUID(),
              cardId: cardId,
              name: kb.name,
              creditType: kb.creditType,
              valueType: kb.valueType,
              totalAmount: kb.totalAmount,
              amountUsed: 0,
              resetDate: format(new Date(), 'yyyy-MM-dd'),
              notes: kb.notes,
            };
            await addBenefit(benefit);
          }
        }
      }
      setImported(true);
      toast.success(`Imported ${parsedCards.length} card${parsedCards.length > 1 ? 's' : ''} with benefits`);
    } catch (e) {
      toast.error('Failed to import cards');
      console.error(e);
    } finally {
      setImporting(false);
    }
  };

  // Count total benefits that will be imported
  const benefitCount = parsedCards.reduce((sum, c) => {
    const known = knownCards.find(k => k.name.toLowerCase() === (c.name || '').toLowerCase());
    return sum + (known?.benefits?.length || 0);
  }, 0);

  return (
    <Card className="p-3 my-2 border-primary/20 bg-primary/5">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {parsedCards.length} card{parsedCards.length > 1 ? 's' : ''} detected
          {benefitCount > 0 && ` · ${benefitCount} benefit${benefitCount > 1 ? 's' : ''} will be auto-added`}
        </p>
        <div className="space-y-1">
          {parsedCards.map((c, i) => {
            const known = knownCards.find(k => k.name.toLowerCase() === (c.name || '').toLowerCase());
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="font-medium">{c.name}</span>
                <Badge variant="outline" className="text-[10px]">{c.issuer}</Badge>
                {c.status === 'closed' && <Badge variant="secondary" className="text-[10px]">Closed</Badge>}
                {known && known.benefits.length > 0 && (
                  <Badge className="text-[10px] bg-primary/15 text-primary border-primary/30">
                    {known.benefits.length} benefit{known.benefits.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
        <Button
          size="sm"
          onClick={handleImport}
          disabled={imported || importing}
          className="w-full"
        >
          {imported ? (
            <><Check className="h-3 w-3 mr-1" /> Imported</>
          ) : importing ? (
            <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Importing...</>
          ) : (
            <><Download className="h-3 w-3 mr-1" /> Import Cards & Benefits</>
          )}
        </Button>
      </div>
    </Card>
  );
}
