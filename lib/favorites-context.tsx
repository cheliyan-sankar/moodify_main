"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

type ItemType = 'game' | 'book';

type FavoritesContextValue = {
  favoritesSet: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string, itemType: ItemType) => Promise<void>;
  removeFavorite: (id: string, itemType: ItemType) => Promise<void>;
  refresh: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favoritesSet, setFavoritesSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) fetchFavorites();
    else setFavoritesSet(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavoritesSet(new Set(data?.map((d: any) => d.item_id) || []));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const toggleFavorite = async (itemId: string, itemType: ItemType) => {
    if (!user) return;
    try {
      if (favoritesSet.has(itemId)) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_type', itemType)
          .eq('item_id', itemId);

        if (error) throw error;

        const newSet = new Set(favoritesSet);
        newSet.delete(itemId);
        setFavoritesSet(newSet);
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, item_type: itemType, item_id: itemId });

        if (error) throw error;

        const newSet = new Set(favoritesSet);
        newSet.add(itemId);
        setFavoritesSet(newSet);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const removeFavorite = async (itemId: string, itemType: ItemType) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId);

      if (error) throw error;

      const newSet = new Set(favoritesSet);
      newSet.delete(itemId);
      setFavoritesSet(newSet);
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoritesSet,
        isFavorite: (id: string) => favoritesSet.has(id),
        toggleFavorite,
        removeFavorite,
        refresh: fetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
