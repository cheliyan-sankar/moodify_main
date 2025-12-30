'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Star, Heart, Share2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';
import { ProtectedRoute } from '@/components/protected-route';
import { AppFooter } from '@/components/app-footer';

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_color: string;
  genre: string;
  rating: number;
  cover_image_url?: string;
  recommended_by?: string;
  recommendation_reason?: string;
  amazon_affiliate_link?: string;
  flipkart_affiliate_link?: string;
  affiliate_link?: string;
  mood_tags?: string[];
  created_at?: string;
};

function BookDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookId = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const { favoritesSet, toggleFavorite } = useFavorites();
  const [coverAvailable, setCoverAvailable] = useState<boolean>(false);

  useEffect(() => {
    fetchBook();
  }, [bookId, user]);

  const fetchBook = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setBook(data);
        // check if cover image URL is reachable
        if (data.cover_image_url) {
          try {
            const resp = await fetch(data.cover_image_url, { method: 'HEAD' });
            setCoverAvailable(resp.ok);
          } catch (err) {
            setCoverAvailable(false);
          }
        } else {
          setCoverAvailable(false);
        }
      }
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPinned = favoritesSet.has(bookId);
  const togglePin = async () => {
    if (!user) return;
    await toggleFavorite(bookId, 'book');
  };

  const handleShare = async () => {
    if (!book) return;

    const url = window.location.href;
    const shareData: ShareData = {
      title: book.title,
      text: `Check out this book: ${book.title} by ${book.author}`,
      url,
    };

    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        // Opens native share sheet on supported browsers/devices
        await (navigator as any).share(shareData);
        return;
      }
    } catch {
      // Ignore (user cancelled or share failed) and fall back to copying link
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        return;
      }
    } catch {
      // Fall through to legacy copy
    }

    // Legacy clipboard fallback
    try {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {
      // If we can't share or copy, there's nothing else we can do here.
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-primary/40 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/discover">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Discover
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-2xl font-bold text-red-800 mb-2">Book Not Found</h2>
              <p className="text-red-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
              <Link href="/discover">
                <Button className="bg-red-600 hover:bg-red-700">Return to Discover</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/discover">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Discover
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-primary">Book Details</h1>
            <div className="w-20" />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Book Cover Section */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="relative">
                {book.cover_image_url && coverAvailable ? (
                  <div className="w-full rounded-xl overflow-hidden shadow-2xl">
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full aspect-[3/4] rounded-xl shadow-2xl flex items-center justify-center p-6"
                    style={{ backgroundColor: book.cover_color }}
                  >
                    <div className="text-center">
                      <BookOpen className="w-20 h-20 text-white mx-auto mb-4" />
                      <h3 className="text-white font-bold text-xl line-clamp-3">
                        {book.title}
                      </h3>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={togglePin}
                  variant={isPinned ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                >
                  <Heart className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
                  {isPinned ? 'Saved' : 'Save'}
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                {book.affiliate_link && (
                  <a href={book.affiliate_link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="secondary" className="w-full gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Visit Link
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Book Details Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <div>
                  <h1 className="text-4xl font-bold text-primary mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(book.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {(book.rating || 0).toFixed(1)}/5.0
                </span>
              </div>
            </div>

            {/* Book Info Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Book Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Genre</p>
                    <p className="font-semibold text-gray-900">{book.genre || 'Self-Help'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rating</p>
                    <p className="font-semibold text-gray-900">{(book.rating || 0).toFixed(1)} out of 5</p>
                  </div>
                </div>

                {book.mood_tags && book.mood_tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Best For</p>
                    <div className="flex flex-wrap gap-2">
                      {book.mood_tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">About This Book</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {book.description || 'No description available for this book.'}
                </p>
              </CardContent>
            </Card>

            {/* Recommended By Section */}
            {book.recommended_by && (
              <Card className="border-2 bg-gradient-to-br from-accent/5 to-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    Recommended By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 border border-accent/20">
                      <p className="text-gray-600 text-sm mb-1">Recommended By</p>
                      <p className="font-semibold text-lg text-primary">{book.recommended_by}</p>
                    </div>
                    {book.recommendation_reason && (
                      <div className="bg-white rounded-lg p-4 border border-accent/20">
                        <p className="text-gray-600 text-sm mb-2">Reason for Recommendation</p>
                        <p className="text-gray-700 leading-relaxed">{book.recommendation_reason}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* About This Book Section */}
            {!book.recommended_by && (
              <Card className="border-2 bg-gradient-to-br from-accent/5 to-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    Why This Book Is Recommended
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">
                    This book is highly recommended for mental health and personal growth. It's carefully curated to support your wellness journey.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Buy This Book Section */}
            <Card className="border-2 border-accent bg-gradient-to-r from-primary to-accent text-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ready to Read?</h3>
                    <p className="text-white/90">
                      Get your copy from your favorite platform and start your reading journey today.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {book.amazon_affiliate_link ? (
                      <a href={book.amazon_affiliate_link} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="lg"
                          variant="secondary"
                          className="w-full gap-2 justify-center bg-orange-400 text-black hover:bg-orange-500 font-semibold"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Amazon
                        </Button>
                      </a>
                    ) : (
                      <Button
                        size="lg"
                        variant="secondary"
                        disabled
                        className="w-full gap-2 justify-center bg-gray-400 text-gray-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Amazon
                      </Button>
                    )}
                    {book.flipkart_affiliate_link ? (
                      <a href={book.flipkart_affiliate_link} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="lg"
                          variant="secondary"
                          className="w-full gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 font-semibold"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Flipkart
                        </Button>
                      </a>
                    ) : (
                      <Button
                        size="lg"
                        variant="secondary"
                        disabled
                        className="w-full gap-2 justify-center bg-gray-400 text-gray-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Flipkart
                      </Button>
                    )}
                  </div>
                  {!book.amazon_affiliate_link &&
                    !book.flipkart_affiliate_link &&
                    !book.affiliate_link && (
                      <p className="text-sm text-white/80 text-center pt-2">
                        Coming soon... links will be available here once added.
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

export default function BookDetailPage() {
  return (
    <ProtectedRoute>
      <BookDetailContent />
    </ProtectedRoute>
  );
}
