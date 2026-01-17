import { useState, useEffect } from 'react';
import { TicketFilters } from '@/lib/types/ticket.types';

export interface SavedView {
  id: string;
  name: string;
  filters: TicketFilters;
  createdAt: string;
}

const STORAGE_KEY = 'ticket-saved-views';

export function useSavedViews() {
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedViews(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load saved views:', error);
    }
  }, []);

  // Save to localStorage whenever views change
  const persistViews = (views: SavedView[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
      setSavedViews(views);
    } catch (error) {
      console.error('Failed to save views:', error);
    }
  };

  const saveView = (name: string, filters: TicketFilters) => {
    const newView: SavedView = {
      id: `view-${Date.now()}`,
      name,
      filters,
      createdAt: new Date().toISOString(),
    };
    persistViews([...savedViews, newView]);
    return newView;
  };

  const deleteView = (id: string) => {
    persistViews(savedViews.filter(v => v.id !== id));
  };

  const updateView = (id: string, updates: Partial<SavedView>) => {
    persistViews(savedViews.map(v => 
      v.id === id ? { ...v, ...updates } : v
    ));
  };

  return {
    savedViews,
    saveView,
    deleteView,
    updateView,
  };
}
