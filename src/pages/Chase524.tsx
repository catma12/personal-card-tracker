import { useCards } from '@/context/CardContext';
import { getChase524Cards, formatDate } from '@/lib/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { differenceInDays } from 'date-fns';
import { Target, ArrowDown, Calendar } from 'lucide-react';

export default function Chase524() {
  const { cards } = useCards();
  const entries = getChase524Cards(cards);
  const count = entries.length;
  const today = new Date();

  const nextDropOff = entries.length > 0 ? entries[0] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Chase 5/24 Tracker</h1>
        <p className="text-sm text-muted-foreground">Track which cards count toward Chase's 5/24 rule</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className={`text-4xl font-bold ${count >= 5 ? 'text-destructive' : count >= 4 ? 'text-warning' : 'text-success'}`}>
              {count}/5
            </div>
            <p className="text-sm text-muted-foreground mt-1">Current 5/24 Status</p>
            {count >= 5 && <Badge className="mt-2 bg-destructive/10 text-destructive">Over Limit</Badge>}
            {count < 5 && <Badge className="mt-2 bg-success/10 text-success">{5 - count} slot{5 - count !== 1 ? 's' : ''} available</Badge>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <ArrowDown className="h-8 w-8 mx-auto mb-2 text-info" />
            <div className="text-lg font-bold">
              {nextDropOff ? formatDate(nextDropOff.dropOffDate) : '—'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Next Drop-Off Date</p>
            {nextDropOff && (
              <p className="text-xs text-muted-foreground">
                {differenceInDays(nextDropOff.dropOffDate, today)} days away · {nextDropOff.card.name}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-warning" />
            <div className="text-lg font-bold">{entries.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Cards Contributing</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">5/24 Timeline</CardTitle></CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No cards currently counting toward 5/24</p>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, i) => {
                const daysLeft = differenceInDays(entry.dropOffDate, today);
                return (
                  <div key={entry.card.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{entry.card.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.card.issuer} · Opened {formatDate(entry.card.openDate)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono">{formatDate(entry.dropOffDate)}</p>
                      <p className={`text-xs ${daysLeft <= 30 ? 'text-success' : daysLeft <= 90 ? 'text-warning' : 'text-muted-foreground'}`}>
                        {daysLeft <= 0 ? 'Dropping off now' : `${daysLeft}d remaining`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Not Counting Toward 5/24</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cards.filter(c => c.status === 'active' && (!c.countsToward524 || c.cardType === 'business')).map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.issuer} · {c.cardType}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {c.cardType === 'business' ? 'Business' : 'Excluded'}
                </Badge>
              </div>
            ))}
            {cards.filter(c => c.status === 'active' && (!c.countsToward524 || c.cardType === 'business')).length === 0 && (
              <p className="text-center py-4 text-muted-foreground text-sm">All active cards count toward 5/24</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
