'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin, BookOpen, Heart } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_color: string;
  genre: string;
  cover_image_url?: string;
};

export function BooksSection() {
  const { user } = useAuth();
  const { favoritesSet, toggleFavorite } = useFavorites();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, [user]);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Favorites state handled by `useFavorites()`

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-2 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {books.map((book, index) => {
        const isPinned = favoritesSet.has(book.id);

        function GameCover({ src, title, wrapperClass = '', imgClass = '', action }: { src?: string; title?: string; wrapperClass?: string; imgClass?: string; action?: React.ReactNode }) {
          const [failed, setFailed] = useState(false);

          const baseWrapper = `${wrapperClass} relative`;

          if (src && !failed) {
            return (
              <div className={baseWrapper}>
                <img src={src} alt={title} className={imgClass} onError={() => setFailed(true)} />
                {action}
              </div>
            );
          }

          return (
            <div className={`${baseWrapper} bg-gray-100 flex items-center justify-center`}>
              <div className="text-3xl font-bold text-gray-600">{title ? title.charAt(0).toUpperCase() : 'B'}</div>
              {action}
            </div>
          );
        }

        return (
          <Link key={book.id} href={`/books/${book.id}`}>
            <Card
              className="group relative w-full max-w-[420px] aspect-square rounded-[24px] bg-white border-0 shadow-[0_8px_16px_rgba(75,52,37,0.05)] overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4 cursor-pointer h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Heart button moved inside the cover via GameCover.action prop */}

              <div className="flex h-full flex-col p-4 sm:p-5">
                <div className="relative h-[46%] w-full overflow-hidden rounded-[24px] bg-[#D9D9D9]">
                  {book.cover_image_url ? (
                    <GameCover
                      src={book.cover_image_url}
                      title={book.title}
                      wrapperClass="h-full w-full"
                      imgClass="h-full w-full object-cover"
                      action={(
                        user ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(book.id, 'book'); }}
                            className={`absolute right-3 top-3 z-20 h-9 w-9 rounded-full bg-transparent p-0 hover:bg-transparent focus-visible:ring-0 transition-all duration-300 ${isPinned ? 'text-red-500' : 'text-[#D9D9D9]'}`}
                            aria-label={isPinned ? 'Unfavorite book' : 'Favorite book'}
                          >
                            <Heart className={`h-6 w-6 ${isPinned ? 'fill-current' : ''}`} />
                          </Button>
                        ) : null
                      )}
                    />
                  ) : (
                    <GameCover
                      src={undefined}
                      title={book.title}
                      wrapperClass="h-full w-full flex items-center justify-center"
                      imgClass=""
                      action={(
                        user ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(book.id, 'book'); }}
                            className={`absolute right-3 top-3 z-20 h-9 w-9 rounded-full bg-transparent p-0 hover:bg-transparent focus-visible:ring-0 transition-all duration-300 ${isPinned ? 'text-red-500' : 'text-[#D9D9D9]'}`}
                            aria-label={isPinned ? 'Unfavorite book' : 'Favorite book'}
                          >
                            <Heart className={`h-6 w-6 ${isPinned ? 'fill-current' : ''}`} />
                          </Button>
                        ) : null
                      )}
                    />
                  )}
                </div>

                <div className="mt-[11px]">
                  <h3 className="line-clamp-2 text-[18px] sm:text-[20px] md:text-[22px] font-semibold leading-[1.2] text-[#450BC8]">
                    {book.title}
                  </h3>
                  <p className="mt-2 text-[12px] sm:text-[13px] leading-[1.35] text-[rgba(31,22,15,0.64)] line-clamp-3">
                    {book.description}
                  </p>
                </div>

                <div className="mt-auto flex items-end justify-between pt-3">
                  <span className="text-[12px] sm:text-[13px] font-semibold text-[#450BC8]">
                      {book.author}
                    </span>
                  <Button
                    size="sm"
                    className="h-9 sm:h-10 w-[120px] sm:w-[140px] rounded-[16px] bg-[#450BC8] px-0 text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-white hover:bg-[#450BC8]/90"
                    onClick={(e) => { e.stopPropagation(); /* link via parent */ }}
                  >
                    READ
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
