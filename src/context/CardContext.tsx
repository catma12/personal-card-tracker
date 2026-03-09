import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CreditCard, CardBenefit, AppSettings } from '@/types/cards';
import { sampleCards, sampleBenefits, defaultSettings } from '@/data/sampleData';

interface CardContextType {
  cards: CreditCard[];
  benefits: CardBenefit[];
  settings: AppSettings;
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

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function CardProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<CreditCard[]>(() => loadFromStorage('cc-cards', sampleCards));
  const [benefits, setBenefits] = useState<CardBenefit[]>(() => loadFromStorage('cc-benefits', sampleBenefits));
  const [settings, setSettings] = useState<AppSettings>(() => loadFromStorage('cc-settings', defaultSettings));

  useEffect(() => { localStorage.setItem('cc-cards', JSON.stringify(cards)); }, [cards]);
  useEffect(() => { localStorage.setItem('cc-benefits', JSON.stringify(benefits)); }, [benefits]);
  useEffect(() => { localStorage.setItem('cc-settings', JSON.stringify(settings)); }, [settings]);

  const addCard = useCallback((card: CreditCard) => setCards(prev => [...prev, card]), []);
  const updateCard = useCallback((card: CreditCard) => setCards(prev => prev.map(c => c.id === card.id ? card : c)), []);
  const deleteCard = useCallback((id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setBenefits(prev => prev.filter(b => b.cardId !== id));
  }, []);
  const addBenefit = useCallback((b: CardBenefit) => setBenefits(prev => [...prev, b]), []);
  const updateBenefit = useCallback((b: CardBenefit) => setBenefits(prev => prev.map(x => x.id === b.id ? b : x)), []);
  const deleteBenefit = useCallback((id: string) => setBenefits(prev => prev.filter(b => b.id !== id)), []);
  const updateSettings = useCallback((s: AppSettings) => setSettings(s), []);
  const getCardById = useCallback((id: string) => cards.find(c => c.id === id), [cards]);
  const getBenefitsForCard = useCallback((cardId: string) => benefits.filter(b => b.cardId === cardId), [benefits]);

  return (
    <CardContext.Provider value={{
      cards, benefits, settings,
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
