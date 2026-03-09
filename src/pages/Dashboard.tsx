import { useCards } from '@/context/CardContext';
import { getChase524Count, getNextAnnualFee, getMonthlyCreditsAvailable, getMonthlyCreditsUnused, getUnusedCreditsThisYear, getExpiringBenefits, getUpcomingAnnualFees, getMonthName, formatDate } from '@/lib/dateUtils';
import { CreditCard, Target, Gift, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const ISSUER_COLORS: Record<string, string> = {
  'Chase': 'hsl(214, 89%, 32%)',
  'American Express': 'hsl(210, 29%, 44%)',
  'Capital One': 'hsl(0, 76%, 44%)',
  'Citi': 'hsl(213, 100%, 40%)',
  'Wells Fargo': 'hsl(5, 79%, 44%)',
  'Bank of America': 'hsl(0, 80%, 42%)',
  'Barclays': 'hsl(197, 100%, 38%)',
  'Discover': 'hsl(25, 95%, 53%)',
  'U.S. Bank': 'hsl(220, 60%, 35%)',
  'Bilt (Column N.A.)': 'hsl(0, 0%, 15%)',
};

const FALLBACK_COLORS = [
  'hsl(160, 84%, 30%)',
  'hsl(280, 60%, 50%)',
  'hsl(38, 92%, 50%)',
  'hsl(190, 70%, 45%)',
  'hsl(0, 72%, 51%)',
  'hsl(120, 50%, 40%)',
];

function getIssuerColor(issuer: string, index: number): string {
  return ISSUER_COLORS[issuer] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export default function Dashboard() {
  const { cards, benefits } = useCards();
  const navigate = useNavigate();
  const activeCards = cards.filter(c => c.status === 'active');
  const chase524 = getChase524Count(cards);
  const nextFeeCard = getNextAnnualFee(cards);
  const monthlyCredits = getMonthlyCreditsAvailable(benefits);
  const unusedCredits = getUnusedCreditsThisYear(benefits);
  const expiringBenefits = getExpiringBenefits(benefits, 30);
  const upcomingFees = getUpcomingAnnualFees(cards, 30);

  const totalAnnualFees = activeCards.reduce((sum, c) => sum + c.annualFee, 0);

  const issuerData = Object.entries(
    activeCards.reduce((acc, c) => { acc[c.issuer] = (acc[c.issuer] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Your credit card portfolio at a glance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button onClick={() => navigate('/cards')} className="stat-card text-left">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="stat-label">Active Cards</span>
          </div>
          <div className="stat-value">{activeCards.length}</div>
        </button>

        <button onClick={() => navigate('/524')} className="stat-card text-left">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-info" />
            <span className="stat-label">Chase 5/24</span>
          </div>
          <div className="stat-value">
            <span className={chase524 >= 5 ? 'text-destructive' : chase524 >= 4 ? 'text-warning' : 'text-success'}>{chase524}/5</span>
          </div>
        </button>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-warning" />
            <span className="stat-label">Total Annual Fees</span>
          </div>
          <div className="stat-value text-lg">${totalAnnualFees.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">{activeCards.filter(c => c.annualFee > 0).length} cards with fees</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-warning" />
            <span className="stat-label">Next Annual Fee</span>
          </div>
          <div className="stat-value text-lg">{nextFeeCard ? `$${nextFeeCard.annualFee}` : '—'}</div>
          {nextFeeCard && <p className="text-xs text-muted-foreground mt-1">{nextFeeCard.name} · {getMonthName(nextFeeCard.annualFeeMonth)}</p>}
        </div>

        <button onClick={() => navigate('/credits')} className="stat-card text-left">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-primary" />
            <span className="stat-label">Monthly Credits</span>
          </div>
          <div className="stat-value">${monthlyCredits}</div>
        </button>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-accent-foreground" />
            <span className="stat-label">Unused Credits</span>
          </div>
          <div className="stat-value">${unusedCredits}</div>
          <p className="text-xs text-muted-foreground mt-1">dollar credits only</p>
        </div>
      </div>

      {/* Alerts */}
      {(upcomingFees.length > 0 || expiringBenefits.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Alerts & Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingFees.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Annual fee of ${c.annualFee} posting in {getMonthName(c.annualFeeMonth)}</p>
                </div>
                <Badge variant="outline" className="border-warning text-warning">${c.annualFee}</Badge>
              </div>
            ))}
            {expiringBenefits.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <div>
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.valueType === 'dollar'
                      ? `$${b.totalAmount - b.amountUsed} remaining`
                      : 'Not yet redeemed'
                    } · Expires {b.expirationDate ? formatDate(b.expirationDate) : 'soon'}
                  </p>
                </div>
                <Badge variant="outline" className="border-destructive text-destructive">Expiring</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cards by Issuer</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={issuerData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {issuerData.map((d, i) => <Cell key={i} fill={getIssuerColor(d.name, i)} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {issuerData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1 text-xs">
                  <div className="h-2 w-2 rounded-full" style={{ background: getIssuerColor(d.name, i) }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Annual Fees by Card</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-3">
              {activeCards
                .filter(c => c.annualFee > 0)
                .sort((a, b) => b.annualFee - a.annualFee)
                .map(c => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{getMonthName(c.annualFeeMonth)}</p>
                    </div>
                    <span className="text-sm font-mono font-semibold">${c.annualFee}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
