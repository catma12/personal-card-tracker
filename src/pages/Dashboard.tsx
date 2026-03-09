import { useCards } from '@/context/CardContext';
import { getChase524Count, getNextAnnualFee, getMonthlyCreditsAvailable, getUnusedCreditsThisYear, getExpiringBenefits, getUpcomingAnnualFees, getMonthName, formatDate } from '@/lib/dateUtils';
import { CreditCard, Target, Gift, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const CHART_COLORS = [
  'hsl(160, 84%, 30%)',
  'hsl(210, 92%, 52%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 60%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(190, 70%, 45%)',
];

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

  // Charts data
  const issuerData = Object.entries(
    activeCards.reduce((acc, c) => { acc[c.issuer] = (acc[c.issuer] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const feeByYear: Record<string, number> = {};
  activeCards.forEach(c => {
    const year = new Date(c.openDate).getFullYear().toString();
    feeByYear[year] = (feeByYear[year] || 0) + c.annualFee;
  });
  const feeData = Object.entries(feeByYear).map(([name, value]) => ({ name, value }));

  const monthlyBenefits = benefits.filter(b => b.creditType === 'monthly');
  const monthlyUsed = monthlyBenefits.reduce((s, b) => s + b.amountUsed, 0);
  const monthlyTotal = monthlyBenefits.reduce((s, b) => s + b.totalAmount, 0);

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
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="stat-label">Expiring Soon</span>
          </div>
          <div className="stat-value">{expiringBenefits.length}</div>
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
                    ${b.totalAmount - b.amountUsed} remaining · Expires {b.expirationDate ? formatDate(b.expirationDate) : 'soon'}
                  </p>
                </div>
                <Badge variant="outline" className="border-destructive text-destructive">Expiring</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cards by Issuer</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={issuerData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {issuerData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {issuerData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1 text-xs">
                  <div className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Annual Fees by Year</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={feeData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => `$${v}`} />
                <Bar dataKey="value" fill="hsl(160, 84%, 30%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Credit Usage</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[200px]">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="hsl(220, 14%, 90%)" strokeWidth="12" />
                <circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke="hsl(160, 84%, 30%)"
                  strokeWidth="12"
                  strokeDasharray={`${(monthlyUsed / Math.max(monthlyTotal, 1)) * 351.86} 351.86`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold">{monthlyTotal > 0 ? Math.round((monthlyUsed / monthlyTotal) * 100) : 0}%</span>
                <span className="text-xs text-muted-foreground">used</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">${monthlyUsed} / ${monthlyTotal} this month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
