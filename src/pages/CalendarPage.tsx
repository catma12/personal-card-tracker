import { useMemo } from 'react';
import { useCards } from '@/context/CardContext';
import { getChase524Cards, formatDate, getMonthName } from '@/lib/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { addMonths, format, isAfter } from 'date-fns';
import { CalendarDays, DollarSign, Gift, Target, Clock } from 'lucide-react';

interface TimelineEvent {
  date: Date;
  type: 'annual-fee' | 'credit-expiration' | '524-dropoff' | 'anniversary';
  title: string;
  description: string;
  icon: typeof DollarSign;
}

export default function CalendarPage() {
  const { cards, benefits, getCardById } = useCards();
  const today = new Date();

  const events = useMemo(() => {
    const all: TimelineEvent[] = [];

    cards.filter(c => c.status === 'active' && c.annualFee > 0).forEach(c => {
      const feeDate = new Date(today.getFullYear(), c.annualFeeMonth - 1, 1);
      const adjusted = isAfter(feeDate, today) ? feeDate : new Date(today.getFullYear() + 1, c.annualFeeMonth - 1, 1);
      all.push({
        date: adjusted, type: 'annual-fee', icon: DollarSign,
        title: `${c.name} — $${c.annualFee} Annual Fee`,
        description: `Annual fee posts in ${getMonthName(c.annualFeeMonth)}`,
      });
    });

    benefits.filter(b => b.expirationDate && b.amountUsed < b.totalAmount).forEach(b => {
      const card = getCardById(b.cardId);
      all.push({
        date: new Date(b.expirationDate!), type: 'credit-expiration', icon: Gift,
        title: `${b.name} expires`,
        description: `$${b.totalAmount - b.amountUsed} remaining · ${card?.name || 'Unknown'}`,
      });
    });

    getChase524Cards(cards).forEach(entry => {
      all.push({
        date: entry.dropOffDate, type: '524-dropoff', icon: Target,
        title: `${entry.card.name} drops off 5/24`,
        description: `Opened ${formatDate(entry.card.openDate)}`,
      });
    });

    cards.filter(c => c.status === 'active').forEach(c => {
      const openDate = new Date(c.openDate);
      let anniversary = new Date(today.getFullYear(), openDate.getMonth(), openDate.getDate());
      if (!isAfter(anniversary, today)) anniversary = new Date(today.getFullYear() + 1, openDate.getMonth(), openDate.getDate());
      all.push({
        date: anniversary, type: 'anniversary', icon: Clock,
        title: `${c.name} anniversary`,
        description: c.issuer,
      });
    });

    return all.sort((a, b) => a.date.getTime() - b.date.getTime()).filter(e => isAfter(e.date, today));
  }, [cards, benefits, getCardById]);

  const typeColor = (t: string) => {
    switch(t) {
      case 'annual-fee': return 'border-warning/30 bg-warning/5';
      case 'credit-expiration': return 'border-destructive/30 bg-destructive/5';
      case '524-dropoff': return 'border-info/30 bg-info/5';
      default: return 'border-primary/30 bg-primary/5';
    }
  };

  const typeBadge = (t: string) => {
    switch(t) {
      case 'annual-fee': return <Badge variant="outline" className="text-warning border-warning/30 text-xs">Fee</Badge>;
      case 'credit-expiration': return <Badge variant="outline" className="text-destructive border-destructive/30 text-xs">Credit</Badge>;
      case '524-dropoff': return <Badge variant="outline" className="text-info border-info/30 text-xs">5/24</Badge>;
      default: return <Badge variant="outline" className="text-primary border-primary/30 text-xs">Anniversary</Badge>;
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    events.forEach(e => {
      const key = format(e.date, 'MMMM yyyy');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [events]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Calendar & Deadlines</h1>
        <p className="text-sm text-muted-foreground">{events.length} upcoming events</p>
      </div>

      {Array.from(grouped.entries()).map(([month, monthEvents]) => (
        <div key={month}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{month}</h2>
          <div className="space-y-2">
            {monthEvents.map((e, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-lg border ${typeColor(e.type)}`}>
                <div className="text-center shrink-0 w-12">
                  <div className="text-lg font-bold">{format(e.date, 'd')}</div>
                  <div className="text-xs text-muted-foreground">{format(e.date, 'EEE')}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{e.title}</p>
                    {typeBadge(e.type)}
                  </div>
                  <p className="text-xs text-muted-foreground">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No upcoming events</CardContent></Card>
      )}
    </div>
  );
}
