import { useState } from 'react';
import { useCards } from '@/context/CardContext';
import { useSpendingGoals } from '@/context/SpendingGoalContext';
import { SpendingGoal, GoalType, GoalStatus, BonusValueType } from '@/types/cards';
import { getChase524Count, getNextAnnualFee, getMonthlyCreditsAvailable, getMonthlyCreditsUnused, getUnusedCreditsThisYear, getExpiringBenefits, getUpcomingAnnualFees, getMonthName, formatDate } from '@/lib/dateUtils';
import { CreditCard, Target, Gift, AlertTriangle, DollarSign, Clock, TrendingUp, CheckCircle2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { addDays, isAfter, isBefore, differenceInDays, parseISO } from 'date-fns';

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

const BENEFIT_CATEGORY_KEYWORDS: { key: string; label: string; keywords: string[] }[] = [
  { key: 'travel', label: 'Travel', keywords: ['hotel', 'airline', 'resort', 'lounge', 'global entry', 'tsa', 'clear', 'flight', 'companion', 'boarding', 'sky club', 'club access', 'club pass', 'club member', 'blacklane', 'renowned', 'delta stay', 'united hotel', 'the edit', 'avis', 'rental', 'wi-fi', 'wifi', 'marriott', 'hilton', 'hyatt', 'southwest', 'travel', 'charter', 'jsx'] },
  { key: 'dining', label: 'Dining', keywords: ['doordash', 'dashpass', 'grubhub', 'dining', 'restaurant', 'resy', 'dunkin'] },
  { key: 'transportation', label: 'Transportation', keywords: ['uber', 'lyft', 'rideshare', 'autonomous', 'transit'] },
  { key: 'entertainment', label: 'Entertainment', keywords: ['digital entertainment', 'peacock', 'disney', 'hulu', 'espn', 'streaming', 'stubhub', 'viagogo', 'adobe', 'apple', 'spotify', 'audible'] },
  { key: 'shopping', label: 'Shopping', keywords: ['saks', 'walmart', 'amazon', 'dell', 'lululemon', 'instacart', 'nordstrom'] },
  { key: 'wellness', label: 'Wellness', keywords: ['peloton', 'oura', 'equinox', 'soulcycle', 'fitness', 'wearable', 'health', 'medical', 'function'] },
];

function getBenefitCategory(name: string): string {
  const lower = name.toLowerCase();
  for (const { key, keywords } of BENEFIT_CATEGORY_KEYWORDS) {
    if (keywords.some(kw => lower.includes(kw))) return key;
  }
  return 'other';
}

const CREDIT_TYPE_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  'semi-annual': 'Semi-Annual',
  annual: 'Annual',
  'anniversary-year': 'Anniversary',
  'one-time': 'One-Time',
};

const CREDIT_TYPE_COLORS: Record<string, string> = {
  monthly: 'bg-blue-500/10 text-blue-600 border-blue-200',
  quarterly: 'bg-purple-500/10 text-purple-600 border-purple-200',
  'semi-annual': 'bg-orange-500/10 text-orange-600 border-orange-200',
  annual: 'bg-green-500/10 text-green-600 border-green-200',
  'anniversary-year': 'bg-green-500/10 text-green-600 border-green-200',
  'one-time': 'bg-muted text-muted-foreground border-border',
};

const GOAL_STATUS_CONFIG: Record<GoalStatus, { label: string; color: string }> = {
  in_progress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  not_started: { label: 'Not Started', color: 'bg-muted text-muted-foreground border-border' },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-600 border-green-200' },
  expired: { label: 'Expired', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

type EnrichedGoal = SpendingGoal & {
  cardName: string;
  progress: number;
  remaining: number;
  daysLeft: number | null;
};

function GoalRow({ goal, onEdit, onDelete }: {
  goal: EnrichedGoal;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusCfg = GOAL_STATUS_CONFIG[goal.status];
  return (
    <div className="space-y-1.5 p-3 rounded-lg border bg-card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{goal.cardName}</p>
          <p className="text-xs text-muted-foreground">{goal.name}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Badge variant="outline" className={`text-xs ${statusCfg.color}`}>{statusCfg.label}</Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {goal.spendRequired > 0 && (
        <>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${goal.spendCurrent.toLocaleString()} / ${goal.spendRequired.toLocaleString()}</span>
            {goal.daysLeft !== null && goal.remaining > 0 && (
              <span className={goal.daysLeft < 14 ? 'text-destructive font-medium' : ''}>
                {goal.daysLeft > 0 ? `${goal.daysLeft}d left` : 'Deadline passed'}
              </span>
            )}
          </div>
          <Progress value={goal.progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {goal.remaining > 0 ? `$${goal.remaining.toLocaleString()} to go` : 'Spend requirement met!'}
            {goal.bonusValue != null && ` · ${goal.bonusValue.toLocaleString()} ${goal.bonusValueType} bonus`}
          </p>
        </>
      )}
    </div>
  );
}

function emptyGoal(): SpendingGoal {
  return {
    id: crypto.randomUUID(),
    cardId: '',
    name: 'Signup Bonus',
    type: 'signup',
    spendRequired: 0,
    spendCurrent: 0,
    deadline: '',
    bonusValue: undefined,
    bonusValueType: 'points',
    status: 'in_progress',
    notes: '',
  };
}

export default function Dashboard() {
  const { cards, benefits, updateBenefit } = useCards();
  const { goals, addGoal, updateGoal, deleteGoal } = useSpendingGoals();
  const navigate = useNavigate();

  const [editingBenefitId, setEditingBenefitId] = useState<string | null>(null);
  const [editBenefitValue, setEditBenefitValue] = useState('');
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SpendingGoal | null>(null);
  const [goalForm, setGoalForm] = useState<SpendingGoal>(emptyGoal());

  const activeCards = cards.filter(c => c.status === 'active');
  const chase524 = getChase524Count(cards);
  const nextFeeCard = getNextAnnualFee(cards);
  const monthlyCredits = getMonthlyCreditsAvailable(benefits);
  const monthlyUnused = getMonthlyCreditsUnused(benefits);
  const unusedCredits = getUnusedCreditsThisYear(benefits);
  const expiringBenefits = getExpiringBenefits(benefits, 30);
  const upcomingFees = getUpcomingAnnualFees(cards, 30);
  const totalAnnualFees = activeCards.reduce((sum, c) => sum + c.annualFee, 0);

  const totalDollarBenefits = benefits
    .filter(b => b.valueType === 'dollar')
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const netValue = totalDollarBenefits - totalAnnualFees;

  const usableCredits = benefits
    .filter(b =>
      b.valueType === 'dollar' &&
      b.amountUsed < b.totalAmount &&
      ['monthly', 'quarterly', 'semi-annual', 'annual', 'anniversary-year'].includes(b.creditType)
    )
    .map(b => ({ ...b, cardName: cards.find(c => c.id === b.cardId)?.name || 'Unknown' }));

  const today = new Date();
  const cutoff60 = addDays(today, 60);
  const decisionReminders = activeCards.filter(c => {
    if (c.decision !== 'undecided' || c.annualFee === 0) return false;
    const feeDate = new Date(today.getFullYear(), c.annualFeeMonth - 1, 1);
    const feeDateNext = new Date(today.getFullYear() + 1, c.annualFeeMonth - 1, 1);
    return (isAfter(feeDate, today) && isBefore(feeDate, cutoff60)) ||
           (isAfter(feeDateNext, today) && isBefore(feeDateNext, cutoff60));
  });

  const enrichedGoals: EnrichedGoal[] = goals.map(g => ({
    ...g,
    cardName: cards.find(c => c.id === g.cardId)?.name || 'Unknown',
    progress: g.spendRequired > 0 ? Math.min(100, (g.spendCurrent / g.spendRequired) * 100) : 0,
    remaining: Math.max(0, g.spendRequired - g.spendCurrent),
    daysLeft: g.deadline ? differenceInDays(parseISO(g.deadline), today) : null,
  }));
  const inProgressGoals = enrichedGoals.filter(g => g.status === 'in_progress');
  const otherGoals = enrichedGoals.filter(g => g.status !== 'in_progress');

  const issuerData = Object.entries(
    activeCards.reduce((acc, c) => { acc[c.issuer] = (acc[c.issuer] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const hasAlerts = upcomingFees.length > 0 || expiringBenefits.length > 0 || decisionReminders.length > 0;

  const startEditBenefit = (id: string, amountUsed: number) => {
    setEditingBenefitId(id);
    setEditBenefitValue(String(amountUsed));
  };

  const saveBenefitEdit = async (benefitId: string) => {
    const benefit = benefits.find(b => b.id === benefitId);
    if (!benefit) return;
    const newUsed = Math.min(Math.max(0, Number(editBenefitValue) || 0), benefit.totalAmount);
    await updateBenefit({ ...benefit, amountUsed: newUsed });
    setEditingBenefitId(null);
  };

  const openAddGoal = () => { setEditingGoal(null); setGoalForm(emptyGoal()); setGoalDialogOpen(true); };
  const openEditGoal = (g: SpendingGoal) => { setEditingGoal(g); setGoalForm({ ...g }); setGoalDialogOpen(true); };
  const handleSaveGoal = async () => {
    if (!goalForm.cardId) return;
    if (editingGoal) await updateGoal(goalForm);
    else await addGoal(goalForm);
    setGoalDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Your credit card portfolio at a glance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <TrendingUp className={`h-4 w-4 ${netValue >= 0 ? 'text-success' : 'text-destructive'}`} />
            <span className="stat-label">Net Benefit Value</span>
          </div>
          <div className={`stat-value text-lg ${netValue >= 0 ? 'text-success' : 'text-destructive'}`}>
            {netValue >= 0 ? '+' : ''}${netValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">${totalDollarBenefits.toLocaleString()} credits – ${totalAnnualFees.toLocaleString()} fees</p>
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
          <div className="stat-value">${monthlyCredits.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground mt-1">${monthlyUnused.toFixed(0)} unused this month</p>
        </button>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-accent-foreground" />
            <span className="stat-label">Unused Credits (YTD)</span>
          </div>
          <div className="stat-value">${unusedCredits.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground mt-1">all dollar credits</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
            <span className="stat-label">Active Spend Goals</span>
          </div>
          <div className="stat-value">{inProgressGoals.length}</div>
          <p className="text-xs text-muted-foreground mt-1">in progress</p>
        </div>
      </div>

      {/* Spending Goals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Spending Goals
            </div>
            <Button size="sm" variant="outline" onClick={openAddGoal} className="h-7 text-xs flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add Goal
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No spending goals yet. Add one to track signup bonus or retention offer spend.
            </p>
          ) : (
            <div className="space-y-4">
              {inProgressGoals.length > 0 && (
                <div className="space-y-2">
                  {otherGoals.length > 0 && (
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">In Progress</p>
                  )}
                  {inProgressGoals.map(g => (
                    <GoalRow key={g.id} goal={g} onEdit={() => openEditGoal(g)} onDelete={() => deleteGoal(g.id)} />
                  ))}
                </div>
              )}
              {otherGoals.length > 0 && (
                <div className="space-y-2">
                  {inProgressGoals.length > 0 && (
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Other</p>
                  )}
                  {otherGoals.map(g => (
                    <GoalRow key={g.id} goal={g} onEdit={() => openEditGoal(g)} onDelete={() => deleteGoal(g.id)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credits to Use — grouped by category */}
      {usableCredits.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              Use This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {[...BENEFIT_CATEGORY_KEYWORDS, { key: 'other', label: 'Other', keywords: [] }].map(cat => {
              const group = usableCredits
                .filter(b => getBenefitCategory(b.name) === cat.key)
                .sort((a, b) => {
                  const order: Record<string, number> = { monthly: 0, quarterly: 1, 'semi-annual': 2, annual: 3, 'anniversary-year': 4 };
                  return (order[a.creditType] ?? 9) - (order[b.creditType] ?? 9);
                });
              if (group.length === 0) return null;
              return (
                <div key={cat.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cat.label}</p>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {group.map(b => (
                      <div key={b.id} className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{b.name}</p>
                            <p className="text-xs text-muted-foreground">{b.cardName}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant="outline" className={`text-xs ${CREDIT_TYPE_COLORS[b.creditType] || ''}`}>
                              {CREDIT_TYPE_LABELS[b.creditType] || b.creditType}
                            </Badge>
                            <span className="text-sm font-semibold">${(b.totalAmount - b.amountUsed).toFixed(0)}</span>
                          </div>
                        </div>
                        {b.totalAmount > 0 && (
                          <Progress value={(b.amountUsed / b.totalAmount) * 100} className="h-1" />
                        )}
                        {editingBenefitId === b.id ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">Used: $</span>
                            <Input
                              type="number"
                              min={0}
                              max={b.totalAmount}
                              value={editBenefitValue}
                              onChange={e => setEditBenefitValue(e.target.value)}
                              className="h-7 text-xs w-20"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') saveBenefitEdit(b.id);
                                if (e.key === 'Escape') setEditingBenefitId(null);
                              }}
                            />
                            <span className="text-xs text-muted-foreground">/ ${b.totalAmount}</span>
                            <Button size="sm" className="h-7 text-xs px-2" onClick={() => saveBenefitEdit(b.id)}>Save</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs px-1" onClick={() => setEditingBenefitId(null)}>✕</Button>
                          </div>
                        ) : (
                          <button
                            className="flex items-center justify-between w-full group"
                            onClick={() => startEditBenefit(b.id, b.amountUsed)}
                          >
                            <span className="text-xs text-muted-foreground">
                              ${b.amountUsed} used of ${b.totalAmount}
                            </span>
                            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                              click to update
                            </span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Alerts & Reminders */}
      {hasAlerts && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Alerts & Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {decisionReminders.map(c => {
              const feeDate = new Date(today.getFullYear(), c.annualFeeMonth - 1, 1);
              const feeDateFinal = feeDate > today ? feeDate : new Date(today.getFullYear() + 1, c.annualFeeMonth - 1, 1);
              const days = differenceInDays(feeDateFinal, today);
              return (
                <div key={`decision-${c.id}`} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border border-orange-200">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${c.annualFee} fee due in {days} days — no keep/cancel decision made
                    </p>
                  </div>
                  <Badge variant="outline" className="border-orange-400 text-orange-600">Decide</Badge>
                </div>
              );
            })}
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
                    {b.valueType === 'dollar' ? `$${b.totalAmount - b.amountUsed} remaining` : 'Not yet redeemed'}
                    {' · '}Expires {b.expirationDate ? formatDate(b.expirationDate) : 'soon'}
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

      {/* Goal Add/Edit Dialog */}
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Add Spending Goal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Card</Label>
              <Select value={goalForm.cardId} onValueChange={v => setGoalForm(f => ({ ...f, cardId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select a card" /></SelectTrigger>
                <SelectContent>
                  {activeCards.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Goal Name</Label>
              <Input value={goalForm.name} onChange={e => setGoalForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Signup Bonus" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={goalForm.type} onValueChange={v => setGoalForm(f => ({ ...f, type: v as GoalType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="signup">Signup Bonus</SelectItem>
                    <SelectItem value="retention">Retention Offer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={goalForm.status} onValueChange={v => setGoalForm(f => ({ ...f, status: v as GoalStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Spend Required ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={goalForm.spendRequired || ''}
                  onChange={e => setGoalForm(f => ({ ...f, spendRequired: Number(e.target.value) }))}
                  placeholder="4000"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Current Spend ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={goalForm.spendCurrent || ''}
                  onChange={e => setGoalForm(f => ({ ...f, spendCurrent: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={goalForm.deadline || ''}
                onChange={e => setGoalForm(f => ({ ...f, deadline: e.target.value || undefined }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Bonus Value</Label>
                <Input
                  type="number"
                  min={0}
                  value={goalForm.bonusValue ?? ''}
                  onChange={e => setGoalForm(f => ({ ...f, bonusValue: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="60000"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Value Type</Label>
                <Select value={goalForm.bonusValueType} onValueChange={v => setGoalForm(f => ({ ...f, bonusValueType: v as BonusValueType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="miles">Miles</SelectItem>
                    <SelectItem value="dollars">Dollars ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={goalForm.notes}
                onChange={e => setGoalForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any details about the offer..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveGoal} disabled={!goalForm.cardId}>{editingGoal ? 'Update' : 'Add Goal'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
