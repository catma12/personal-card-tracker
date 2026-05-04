import { useState } from 'react';
import { useSpendingGoals } from '@/context/SpendingGoalContext';
import { useCards } from '@/context/CardContext';
import { SpendingGoal, GoalType, GoalStatus, BonusValueType } from '@/types/cards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Plus, Pencil, Trash2, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  signup: 'Signup Bonus',
  retention: 'Retention Offer',
  other: 'Other',
};

const STATUS_CONFIG: Record<GoalStatus, { label: string; color: string; icon: React.ReactNode }> = {
  in_progress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-600 border-blue-200', icon: <TrendingUp className="h-3 w-3" /> },
  not_started: { label: 'Not Started', color: 'bg-muted text-muted-foreground border-border', icon: <Clock className="h-3 w-3" /> },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-600 border-green-200', icon: <CheckCircle2 className="h-3 w-3" /> },
  expired: { label: 'Expired', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: <AlertCircle className="h-3 w-3" /> },
};

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

function GoalCard({ goal, cardName, onEdit, onDelete }: {
  goal: SpendingGoal;
  cardName: string;
  onEdit: (g: SpendingGoal) => void;
  onDelete: (id: string) => void;
}) {
  const progress = goal.spendRequired > 0
    ? Math.min(100, (goal.spendCurrent / goal.spendRequired) * 100)
    : 0;
  const remaining = Math.max(0, goal.spendRequired - goal.spendCurrent);
  const daysLeft = goal.deadline ? differenceInDays(parseISO(goal.deadline), new Date()) : null;
  const statusCfg = STATUS_CONFIG[goal.status];

  return (
    <div className="p-4 rounded-lg border bg-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{cardName}</p>
          <p className="text-xs text-muted-foreground">{goal.name}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Badge variant="outline" className={`text-xs flex items-center gap-1 ${statusCfg.color}`}>
            {statusCfg.icon} {statusCfg.label}
          </Badge>
          <Badge variant="outline" className="text-xs">{GOAL_TYPE_LABELS[goal.type]}</Badge>
        </div>
      </div>

      {goal.spendRequired > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${goal.spendCurrent.toLocaleString()} spent</span>
            <span>${goal.spendRequired.toLocaleString()} required</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {remaining > 0 ? `$${remaining.toLocaleString()} to go` : 'Spend requirement met!'}
            {daysLeft !== null && remaining > 0 && (
              <span className={daysLeft < 14 ? 'text-destructive font-medium' : ''}>
                {' · '}{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
              </span>
            )}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {goal.bonusValue != null && (
            <span className="font-medium text-foreground">
              {goal.bonusValueType === 'dollars' ? `$${goal.bonusValue.toLocaleString()}` : `${goal.bonusValue.toLocaleString()} ${goal.bonusValueType}`}
            </span>
          )}
          {goal.deadline && <span className="ml-2">· Due {new Date(goal.deadline).toLocaleDateString()}</span>}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(goal)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(goal.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {goal.notes && <p className="text-xs text-muted-foreground border-t pt-2">{goal.notes}</p>}
    </div>
  );
}

export default function SpendingGoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useSpendingGoals();
  const { cards } = useCards();
  const activeCards = cards.filter(c => c.status === 'active');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SpendingGoal | null>(null);
  const [form, setForm] = useState<SpendingGoal>(emptyGoal());

  const openAdd = () => { setEditing(null); setForm(emptyGoal()); setDialogOpen(true); };
  const openEdit = (g: SpendingGoal) => { setEditing(g); setForm({ ...g }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.cardId) return;
    if (editing) {
      await updateGoal(form);
    } else {
      await addGoal(form);
    }
    setDialogOpen(false);
  };

  const getCardName = (cardId: string) => cards.find(c => c.id === cardId)?.name || 'Unknown Card';

  const grouped: Record<GoalStatus, SpendingGoal[]> = {
    in_progress: goals.filter(g => g.status === 'in_progress'),
    not_started: goals.filter(g => g.status === 'not_started'),
    completed: goals.filter(g => g.status === 'completed'),
    expired: goals.filter(g => g.status === 'expired'),
  };

  const totalPendingBonus = goals
    .filter(g => g.status === 'in_progress' && g.bonusValue != null)
    .reduce((sum, g) => sum + (g.bonusValue || 0), 0);
  const inProgressCount = grouped.in_progress.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Spending Goals</h1>
          <p className="text-muted-foreground text-sm">Track signup bonuses and retention offer spend requirements</p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Goal
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="stat-label">Active Goals</span>
          </div>
          <div className="stat-value">{inProgressCount}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-value">{grouped.completed.length}</div>
        </div>
        <div className="stat-card col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-warning" />
            <span className="stat-label">Pending Bonus Value</span>
          </div>
          <div className="stat-value text-lg">{totalPendingBonus > 0 ? totalPendingBonus.toLocaleString() : '—'}</div>
          <p className="text-xs text-muted-foreground mt-1">across active goals</p>
        </div>
      </div>

      {/* Goals by status */}
      {(['in_progress', 'not_started', 'completed', 'expired'] as GoalStatus[]).map(status => {
        const statusGoals = grouped[status];
        if (statusGoals.length === 0) return null;
        const cfg = STATUS_CONFIG[status];
        return (
          <Card key={status}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {cfg.icon}
                {cfg.label}
                <Badge variant="outline" className="ml-1">{statusGoals.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {statusGoals.map(g => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    cardName={getCardName(g.cardId)}
                    onEdit={openEdit}
                    onDelete={deleteGoal}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {goals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No spending goals yet</p>
            <p className="text-sm mt-1">Add a goal to track your signup bonus or retention offer spend</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Goal' : 'Add Spending Goal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Card</Label>
              <Select value={form.cardId} onValueChange={v => setForm(f => ({ ...f, cardId: v }))}>
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
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Signup Bonus" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as GoalType }))}>
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
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as GoalStatus }))}>
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
                  value={form.spendRequired || ''}
                  onChange={e => setForm(f => ({ ...f, spendRequired: Number(e.target.value) }))}
                  placeholder="4000"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Current Spend ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.spendCurrent || ''}
                  onChange={e => setForm(f => ({ ...f, spendCurrent: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={form.deadline || ''}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value || undefined }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Bonus Value</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.bonusValue ?? ''}
                  onChange={e => setForm(f => ({ ...f, bonusValue: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="60000"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Value Type</Label>
                <Select value={form.bonusValueType} onValueChange={v => setForm(f => ({ ...f, bonusValueType: v as BonusValueType }))}>
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
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any details about the offer..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.cardId}>{editing ? 'Update' : 'Add Goal'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
