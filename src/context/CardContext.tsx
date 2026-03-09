import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CreditCard, CardBenefit, AppSettings } from '@/types/cards';
import { defaultSettings } from '@/data/sampleData';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { shouldResetBenefit } from '@/lib/dateUtils';
import { format } from 'date-fns';

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
          supabase.from('user_settings').select('*').limit(1).single(),
        ]);

        if (cardsRes.data) setCards(cardsRes.data.map(dbToCard));
        if (benefitsRes.data) setBenefits(benefitsRes.data.map(dbToBenefit));
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
    setBenefits(prev => [...prev, b]);
    const { error } = await supabase.from('benefits').insert(benefitToDb(b, user.id) as any);
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

  return (
    <CardContext.Provider value={{
      cards, benefits, settings, loading,
      addCard, updateCard, deleteCard,
      addBenefit, updateBenefit, deleteBenefit,
      updateSettings, getCardById, getBenefitsForCard,
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
