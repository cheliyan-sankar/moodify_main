'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin, BookOpen, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';

type FavoriteItem = {
  id: string;
  title: string;
  description?: string;
  author?: string;
  type: 'game' | 'book';
  color: string;
  icon?: string;
  genre?: string;
  category?: string;
  cover_image_url?: string;
};

export function FavoritesSection() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: favoritesData, error: favError } = await supabase
        .from('user_favorites')
        .select('item_id, item_type')
        .eq('user_id', user.id);

      if (favError) throw favError;

      const gameIds = favoritesData?.filter((f: any) => f.item_type === 'game').map((f: any) => f.item_id) || [];
      const bookIds = favoritesData?.filter((f: any) => f.item_type === 'book').map((f: any) => f.item_id) || [];

      const items: FavoriteItem[] = [];

      if (gameIds.length > 0) {
        const { data: gamesData } = await supabase
          .from('games')
          .select('*')
          .in('id', gameIds);

        if (gamesData) {
          items.push(
            ...gamesData.map((game: any) => ({
              id: game.id,
              title: game.title,
              description: game.description,
              type: 'game' as const,
              color: game.color_from,
              icon: game.icon,
              category: game.category,
            }))
          );
        }
      }

      if (bookIds.length > 0) {
        const { data: booksData } = await supabase
          .from('books')
          .select('*')
          .in('id', bookIds);

        if (booksData) {
          items.push(
            ...booksData.map((book: any) => ({
              id: book.id,
              title: book.title,
              description: book.description,
              author: book.author,
              type: 'book' as const,
              color: book.cover_color,
              genre: book.genre,
              cover_image_url: book.cover_image_url,
            }))
          );
        }
      }

      setFavorites(items);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const { removeFavorite } = useFavorites();

  const removeFromFavorites = async (itemId: string, itemType: 'game' | 'book') => {
    if (!user) return;
    try {
      await removeFavorite(itemId, itemType);
      setFavorites(favorites.filter((f) => f.id !== itemId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const getIconComponent = (iconName?: string) => {
    const icons: { [key: string]: string } = {
      brain: '🧠',
      'flower-2': '🌸',
      lightbulb: '💡',
      target: '🎯',
      heart: '❤️',
      'book-open': '📖',
    };
    return icons[iconName || ''] || '🎮';
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Card className="border-2">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#3C1F71' }} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card className="border-2 bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="p-6 sm:p-8 md:p-12 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Favorites Yet</h3>
          <p className="text-gray-500">
            Start pinning games and books to see them here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {favorites.map((item, index) => {
        const isGame = item.type === 'game';

        function GameCover({ src, title, wrapperClass = '', imgClass = '' }: { src?: string; title?: string; wrapperClass?: string; imgClass?: string }) {
          const [failed, setFailed] = useState(false);

          if (src && !failed) {
            return (
              <div className={wrapperClass}>
                <img src={src} alt={title} className={imgClass} onError={() => setFailed(true)} />
              </div>
            );
          }

          return (
            <div className={`${wrapperClass} bg-gray-100 flex items-center justify-center`}>
              <div className="text-2xl sm:text-3xl font-bold text-gray-600">{title ? title.charAt(0).toUpperCase() : 'G'}</div>
            </div>
          );
        }

        return (
          <Card
            key={item.id}
            className="group relative w-full max-w-[420px] aspect-square rounded-[24px] bg-white border-0 shadow-[0_8px_16px_rgba(75,52,37,0.05)] overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4 cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex h-full flex-col p-4 sm:p-5">
              <div className="relative h-[46%] w-full overflow-hidden rounded-[24px] bg-[#D9D9D9]">
                <GameCover
                  src={item.cover_image_url}
                  title={item.title}
                  wrapperClass="h-full w-full"
                  imgClass="h-full w-full object-cover"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); removeFromFavorites(item.id, item.type); }}
                  className="absolute right-3 top-3 z-20 h-6 w-6 rounded-full bg-transparent p-0 hover:bg-transparent focus-visible:ring-0"
                  aria-label="Remove from favorites"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-current" style={{ stroke: 'none' }} />
                </Button>
              </div>

                <div className="mt-[10px]">
                <h3 className="line-clamp-2 text-[16px] sm:text-[17px] md:text-[18px] font-semibold leading-[1.2] text-[#450BC8]">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-[12px] sm:text-[13px] leading-[1.35] text-[rgba(31,22,15,0.64)]">
                  {item.description}
                </p>
              </div>

              <div className="mt-auto flex items-end justify-between pt-3">
                <span className="text-[12px] sm:text-[13px] font-semibold text-[#450BC8]">
                  {item.category || item.genre}
                </span>
                {isGame ? (
                  <Button
                    size="sm"
                    className="h-7 sm:h-8 w-[100px] sm:w-[120px] rounded-[14px] bg-[#450BC8] px-0 text-[10px] sm:text-[11px] font-semibold text-white hover:bg-[#450BC8]/90"
                    onClick={(e) => { e.stopPropagation(); /* could navigate to game */ }}
                  >
                    PLAY NOW
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-7 sm:h-8 w-[100px] sm:w-[120px] rounded-[14px] bg-[#450BC8] px-0 text-[10px] sm:text-[11px] font-semibold text-white hover:bg-[#450BC8]/90"
                    onClick={(e) => { e.stopPropagation(); /* could open book */ }}
                  >
                    READ
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
