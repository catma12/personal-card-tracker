import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CreditCard, CardBenefit, AppSettings } from '@/types/cards';
import { defaultSettings } from '@/data/sampleData';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { shouldResetBenefit } from '@/lib/dateUtils';
import { format } from 'date-fns';
import { knownCards } from '@/data/knownCards';

interface CardContextType {
  cards: CreditCard[];
  benefits: CardBenefit[];
  settings: AppSettings;
  loading: boolean;
  addCard: (card: CreditCard) => void;
  updateCard: (card: CreditCard) => void;
  deleteCard: (id: string) => void;
  addBenefit: (benefit: CardBenefit) => void;
  updateBenefit: (benefit: CardBenefit) => void;
  deleteBenefit: (id: string) => void;
  updateSettings: (settings: AppSettings) => void;
  getCardById: (id: string) => CreditCard | undefined;
  getBenefitsForCard: (cardId: string) => CardBenefit[];
  syncBenefits: () => Promise<{ added: number; updated: number }>;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

function dbToCard(row: any): CreditCard {
  return {
    id: row.id,
    name: row.name,
    issuer: row.issuer,
    network: row.network,
    cardType: row.card_type,
    status: row.status,
    openDate: row.open_date,
    productChangeDate: row.product_change_date || undefined,
    annualFee: Number(row.annual_fee),
    annualFeeMonth: row.annual_fee_month,
    lastAnnualFeeDate: row.last_annual_fee_date || undefined,
    countsToward524: row.counts_toward_524,
    signupBonusDate: row.signup_bonus_date || undefined,
    category: row.category,
    decision: row.decision,
    tags: row.tags || [],
    notes: row.notes || '',
    starred: row.starred ?? false,
  };
}

function cardToDb(card: CreditCard, userId: string) {
  return {
    id: card.id,
    user_id: userId,
    name: card.name,
    issuer: card.issuer,
    network: card.network,
    card_type: card.cardType,
    status: card.status,
    open_date: card.openDate,
    product_change_date: card.productChangeDate || null,
    annual_fee: card.annualFee,
    annual_fee_month: card.annualFeeMonth,
    last_annual_fee_date: card.lastAnnualFeeDate || null,
    counts_toward_524: card.countsToward524,
    signup_bonus_date: card.signupBonusDate || null,
    category: card.category,
    decision: card.decision,
    tags: card.tags,
    notes: card.notes,
    starred: card.starred,
  };
}

function dbToBenefit(row: any): CardBenefit {
  return {
    id: row.id,
    cardId: row.card_id,
    name: row.name,
    creditType: row.credit_type,
    valueType: row.value_type,
    totalAmount: Number(row.total_amount),
    amountUsed: Number(row.amount_used),
    resetDate: row.reset_date || undefined,
    expirationDate: row.expiration_date || undefined,
    lastUsedDate: row.last_used_date || undefined,
    notes: row.notes || '',
  };
}

function benefitToDb(b: CardBenefit, userId: string) {
  return {
    id: b.id,
    user_id: userId,
    card_id: b.cardId,
    name: b.name,
    credit_type: b.creditType,
    value_type: b.valueType,
    total_amount: b.totalAmount,
    amount_used: b.amountUsed,
    reset_date: b.resetDate || null,
    expiration_date: b.expirationDate || null,
    last_used_date: b.lastUsedDate || null,
    notes: b.notes,
  };
}

export function CardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [benefits, setBenefits] = useState<CardBenefit[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCards([]);
      setBenefits([]);
      setSettings(defaultSettings);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [cardsRes, benefitsRes, settingsRes] = await Promise.all([
          supabase.from('cards').select('*').order('created_at', { ascending: true }),
          supabase.from('benefits').select('*').order('created_at', { ascending: true }),
          supabase.from('user_settings').select('*').limit(1).maybeSingle(),
        ]);

        const loadedCards = cardsRes.data?.map(dbToCard) || [];
        if (cardsRes.data) setCards(loadedCards);
        
        const loadedBenefits = benefitsRes.data?.map(dbToBenefit) || [];
        
        // Auto-reset benefits whose period has rolled over
        const benefitsToReset: CardBenefit[] = [];
        const updatedBenefits = loadedBenefits.map(b => {
          const card = loadedCards.find(c => c.id === b.cardId);
          if (shouldResetBenefit(b, card?.openDate)) {
            const reset = { ...b, amountUsed: 0, resetDate: format(new Date(), 'yyyy-MM-dd') };
            benefitsToReset.push(reset);
            return reset;
          }
          return b;
        });
        
        // Auto-populate benefits from knownCards for active cards missing benefits
        const cardIdsWithBenefits = new Set(updatedBenefits.map(b => b.cardId));
        const newBenefits: CardBenefit[] = [];
        for (const card of loadedCards) {
          if (card.status !== 'active' || cardIdsWithBenefits.has(card.id)) continue;
          const known = knownCards.find(k => k.name.toLowerCase() === card.name.toLowerCase());
          if (!known || known.benefits.length === 0) continue;
          for (const kb of known.benefits) {
            const benefit: CardBenefit = {
              id: crypto.randomUUID(),
              cardId: card.id,
              name: kb.name,
              creditType: kb.creditType,
              valueType: kb.valueType,
              totalAmount: kb.totalAmount,
              amountUsed: 0,
              resetDate: format(new Date(), 'yyyy-MM-dd'),
              notes: kb.notes,
            };
            newBenefits.push(benefit);
          }
        }
        
        const allBenefits = [...updatedBenefits, ...newBenefits];
        setBenefits(allBenefits);
        
        // Batch update reset benefits in DB
        for (const b of benefitsToReset) {
          supabase.from('benefits').update({
            amount_used: 0,
            reset_date: b.resetDate,
          } as any).eq('id', b.id).then(({ error }) => {
            if (error) console.error('Failed to auto-reset benefit:', error);
          });
        }
        if (benefitsToReset.length > 0) {
          console.log(`Auto-reset ${benefitsToReset.length} benefit(s) for new period`);
        }
        
        // Batch insert new auto-populated benefits
        if (newBenefits.length > 0) {
          const inserts = newBenefits.map(b => benefitToDb(b, user.id));
          supabase.from('benefits').insert(inserts as any).then(({ error }) => {
            if (error) console.error('Failed to auto-populate benefits:', error);
          });
          console.log(`Auto-populated ${newBenefits.length} benefit(s) from known cards`);
        }
        if (settingsRes.data) {
          setSettings({
            reminderDays: settingsRes.data.reminder_days,
            defaultHideBusiness: settingsRes.data.default_hide_business,
            dateFormat: settingsRes.data.date_format,
            customTags: settingsRes.data.custom_tags || [],
          });
        } else {
          await supabase.from('user_settings').insert({
            user_id: user.id,
            reminder_days: defaultSettings.reminderDays,
            default_hide_business: defaultSettings.defaultHideBusiness,
            date_format: defaultSettings.dateFormat,
            custom_tags: defaultSettings.customTags,
          });
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const addCard = useCallback(async (card: CreditCard) => {
    if (!user) return;
    setCards(prev => [...prev, card]);
    const { error } = await supabase.from('cards').insert(cardToDb(card, user.id) as any);
    if (error) { toast.error('Failed to save card'); console.error(error); }
  }, [user]);

  const updateCard = useCallback(async (card: CreditCard) => {
    if (!user) return;
    setCards(prev => prev.map(c => c.id === card.id ? card : c));
    const { id, ...rest } = cardToDb(card, user.id);
    const { error } = await supabase.from('cards').update(rest as any).eq('id', card.id);
    if (error) { toast.error('Failed to update card'); console.error(error); }
  }, [user]);

  const deleteCard = useCallback(async (id: string) => {
    if (!user) return;
    setCards(prev => prev.filter(c => c.id !== id));
    setBenefits(prev => prev.filter(b => b.cardId !== id));
    const { error } = await supabase.from('cards').delete().eq('id', id);
    if (error) { toast.error('Failed to delete card'); console.error(error); }
  }, [user]);

  const addBenefit = useCallback(async (b: CardBenefit) => {
    if (!user) return;
    // Set reset_date to today if not already set, so auto-reset can track periods
    const benefitWithReset = { ...b, resetDate: b.resetDate || format(new Date(), 'yyyy-MM-dd') };
    setBenefits(prev => [...prev, benefitWithReset]);
    const { error } = await supabase.from('benefits').insert(benefitToDb(benefitWithReset, user.id) as any);
    if (error) { toast.error('Failed to save benefit'); console.error(error); }
  }, [user]);

  const updateBenefit = useCallback(async (b: CardBenefit) => {
    if (!user) return;
    setBenefits(prev => prev.map(x => x.id === b.id ? b : x));
    const { id, ...rest } = benefitToDb(b, user.id);
    const { error } = await supabase.from('benefits').update(rest as any).eq('id', b.id);
    if (error) { toast.error('Failed to update benefit'); console.error(error); }
  }, [user]);

  const deleteBenefit = useCallback(async (id: string) => {
    if (!user) return;
    setBenefits(prev => prev.filter(b => b.id !== id));
    const { error } = await supabase.from('benefits').delete().eq('id', id);
    if (error) { toast.error('Failed to delete benefit'); console.error(error); }
  }, [user]);

  const updateSettings = useCallback(async (s: AppSettings) => {
    if (!user) return;
    setSettings(s);
    const { error } = await supabase.from('user_settings').upsert({
      user_id: user.id,
      reminder_days: s.reminderDays,
      default_hide_business: s.defaultHideBusiness,
      date_format: s.dateFormat,
      custom_tags: s.customTags,
    } as any, { onConflict: 'user_id' });
    if (error) { toast.error('Failed to save settings'); console.error(error); }
  }, [user]);

  const getCardById = useCallback((id: string) => cards.find(c => c.id === id), [cards]);
  const getBenefitsForCard = useCallback((cardId: string) => benefits.filter(b => b.cardId === cardId), [benefits]);

  const syncBenefits = useCallback(async () => {
    if (!user) return { added: 0, updated: 0 };
    let added = 0;
    let updated = 0;
    const newBenefitsToAdd: CardBenefit[] = [];
    const benefitsToUpdate: CardBenefit[] = [];

    for (const card of cards) {
      if (card.status !== 'active') continue;
      const known = knownCards.find(k => k.name.toLowerCase() === card.name.toLowerCase());
      if (!known || known.benefits.length === 0) continue;

      const cardBenefits = benefits.filter(b => b.cardId === card.id);

      for (const kb of known.benefits) {
        const existing = cardBenefits.find(b => b.name.toLowerCase() === kb.name.toLowerCase());
        if (!existing) {
          // Add missing benefit
          const newBenefit: CardBenefit = {
            id: crypto.randomUUID(),
            cardId: card.id,
            name: kb.name,
            creditType: kb.creditType,
            valueType: kb.valueType,
            totalAmount: kb.totalAmount,
            amountUsed: 0,
            resetDate: format(new Date(), 'yyyy-MM-dd'),
            notes: kb.notes,
          };
          newBenefitsToAdd.push(newBenefit);
          added++;
        } else if (
          existing.creditType !== kb.creditType ||
          existing.valueType !== kb.valueType ||
          existing.totalAmount !== kb.totalAmount
        ) {
          // Update benefit metadata (preserve amountUsed)
          const updatedBenefit: CardBenefit = {
            ...existing,
            creditType: kb.creditType,
            valueType: kb.valueType,
            totalAmount: kb.totalAmount,
            notes: kb.notes,
          };
          benefitsToUpdate.push(updatedBenefit);
          updated++;
        }
      }
    }

    // Batch insert new benefits
    if (newBenefitsToAdd.length > 0) {
      const inserts = newBenefitsToAdd.map(b => benefitToDb(b, user.id));
      const { error } = await supabase.from('benefits').insert(inserts as any);
      if (error) { console.error('Sync insert error:', error); toast.error('Failed to add some benefits'); }
    }

    // Batch update changed benefits
    for (const b of benefitsToUpdate) {
      const { id, ...rest } = benefitToDb(b, user.id);
      await supabase.from('benefits').update(rest as any).eq('id', b.id);
    }

    // Update local state
    setBenefits(prev => {
      let result = [...prev, ...newBenefitsToAdd];
      for (const upd of benefitsToUpdate) {
        result = result.map(b => b.id === upd.id ? upd : b);
      }
      return result;
    });

    return { added, updated };
  }, [user, cards, benefits]);

  return (
    <CardContext.Provider value={{
      cards, benefits, settings, loading,
      addCard, updateCard, deleteCard,
      addBenefit, updateBenefit, deleteBenefit,
      updateSettings, getCardById, getBenefitsForCard,
      syncBenefits,
    }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCards() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('useCards must be used within CardProvider');
  return ctx;
}
