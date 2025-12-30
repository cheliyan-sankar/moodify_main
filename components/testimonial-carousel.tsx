'use client';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

type Testimonial = {
  id: string;
  user_name: string;
  user_title: string | null;
  feedback: string;
  avatar_url: string | null;
  display_order: number;
};

export function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="w-full py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-2 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-3 w-5/6" />
                <div className="h-4 bg-gray-200 rounded mb-4 w-4/6" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
            >
              <Card
                className="group border-2 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full animate-in fade-in-50 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-6 flex-1 flex flex-col gap-2">
                    <p
                      className={`text-gray-700 leading-relaxed ${
                        expandedIds.has(testimonial.id) ? '' : 'line-clamp-3'
                      }`}
                    >
                      &ldquo;{testimonial.feedback}&rdquo;
                    </p>
                    {testimonial.feedback.length > 80 && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(testimonial.id)}
                        className="self-start text-sm font-medium text-primary hover:underline"
                      >
                        {expandedIds.has(testimonial.id) ? 'See less' : 'See more'}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-auto">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      {testimonial.avatar_url ? (
                        <img
                          src={testimonial.avatar_url}
                          alt={testimonial.user_name}
                          className="w-12 h-12 rounded-full object-cover border-2"
                          style={{ borderColor: 'hsl(var(--secondary))' }}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold border-2"
                          style={{
                            backgroundColor: 'hsl(var(--primary))',
                            borderColor: 'hsl(var(--secondary))'
                          }}
                        >
                          {testimonial.user_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold truncate"
                        style={{ color: 'hsl(var(--primary))' }}
                      >
                        {testimonial.user_name}
                      </p>
                      {testimonial.user_title && (
                        <p className="text-sm text-gray-600 truncate">
                          {testimonial.user_title}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full w-12 h-12 shadow-lg border-2 bg-white hover:bg-gray-50 hidden md:flex"
        style={{ borderColor: 'hsl(var(--secondary))' }}
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-6 h-6" style={{ color: 'hsl(var(--primary))' }} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full w-12 h-12 shadow-lg border-2 bg-white hover:bg-gray-50 hidden md:flex"
        style={{ borderColor: 'hsl(var(--secondary))' }}
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-6 h-6" style={{ color: 'hsl(var(--primary))' }} />
      </Button>

      <div className="flex justify-center gap-2 mt-6 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="rounded-full w-10 h-10 border-2"
          style={{ borderColor: 'hsl(var(--secondary))' }}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="rounded-full w-10 h-10 border-2"
          style={{ borderColor: 'hsl(var(--secondary))' }}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
        </Button>
      </div>
    </div>
  );
}
