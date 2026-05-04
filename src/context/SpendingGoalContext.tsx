import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SpendingGoal, GoalType, GoalStatus, BonusValueType } from '@/types/cards';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SpendingGoalContextType {
  goals: SpendingGoal[];
  loading: boolean;
  addGoal: (goal: SpendingGoal) => Promise<void>;
  updateGoal: (goal: SpendingGoal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

const SpendingGoalContext = createContext<SpendingGoalContextType | undefined>(undefined);

function dbToGoal(row: any): SpendingGoal {
  return {
    id: row.id,
    cardId: row.card_id,
    name: row.name,
    type: row.type as GoalType,
    spendRequired: Number(row.spend_required),
    spendCurrent: Number(row.spend_current),
    deadline: row.deadline || undefined,
    bonusValue: row.bonus_value != null ? Number(row.bonus_value) : undefined,
    bonusValueType: (row.bonus_value_type || 'points') as BonusValueType,
    status: row.status as GoalStatus,
    notes: row.notes || '',
  };
}

function goalToDb(g: SpendingGoal, userId: string) {
  return {
    id: g.id,
    user_id: userId,
    card_id: g.cardId,
    name: g.name,
    type: g.type,
    spend_required: g.spendRequired,
    spend_current: g.spendCurrent,
    deadline: g.deadline || null,
    bonus_value: g.bonusValue ?? null,
    bonus_value_type: g.bonusValueType,
    status: g.status,
    notes: g.notes,
  };
}

export function SpendingGoalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<SpendingGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('spending_goals')
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        setGoals((data || []).map(dbToGoal));
      } catch (err) {
        console.error('Error loading spending goals:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
  }, [user]);

  const addGoal = useCallback(async (goal: SpendingGoal) => {
    setGoals(prev => [...prev, goal]);
    const { error } = await supabase.from('spending_goals').insert(goalToDb(goal, user.id) as any);
    if (error) { toast.error('Failed to save goal'); console.error(error); }
  }, [user]);

  const updateGoal = useCallback(async (goal: SpendingGoal) => {
    setGoals(prev => prev.map(g => g.id === goal.id ? goal : g));
    const { id, ...rest } = goalToDb(goal, user.id);
    const { error } = await supabase.from('spending_goals').update(rest as any).eq('id', goal.id);
    if (error) { toast.error('Failed to update goal'); console.error(error); }
  }, [user]);

  const deleteGoal = useCallback(async (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    const { error } = await supabase.from('spending_goals').delete().eq('id', id);
    if (error) { toast.error('Failed to delete goal'); console.error(error); }
  }, [user]);

  return (
    <SpendingGoalContext.Provider value={{ goals, loading, addGoal, updateGoal, deleteGoal }}>
      {children}
    </SpendingGoalContext.Provider>
  );
}

export function useSpendingGoals() {
  const ctx = useContext(SpendingGoalContext);
  if (!ctx) throw new Error('useSpendingGoals must be used within SpendingGoalProvider');
  return ctx;
}
