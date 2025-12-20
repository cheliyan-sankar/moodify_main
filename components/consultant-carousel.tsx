 'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Consultant = {
  id: string;
  full_name?: string;
  title?: string;
  picture_url?: string;
  booking_url?: string;
};

export default function ConsultantCarousel() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let isMounted = true;
    const fetchConsultants = async () => {
      try {
        const { data } = await supabase
          .from('consultants')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(12);

        if (!isMounted) return;
        setConsultants(data || []);
      } catch (err) {
        console.error('Error loading consultants:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchConsultants();
    return () => {
      isMounted = false;
    };
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const speed = 40; // px per second

  // continuous animation effect
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const totalWidth = track.scrollWidth / 2 || 0; // track contains two copies
    let lastTime: number | null = null;

    function step(now: number) {
      if (lastTime == null) lastTime = now;
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (!pausedRef.current && totalWidth > 0) {
        offsetRef.current += speed * delta;
        if (offsetRef.current >= totalWidth) offsetRef.current -= totalWidth;
        const cur = trackRef.current;
        if (cur) cur.style.transform = `translateX(${-offsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    const onEnter = () => { pausedRef.current = true; };
    const onLeave = () => { pausedRef.current = false; };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [consultants]);

  if (loading) {
    return (
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-2 animate-pulse w-full">
            <div className="h-40 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (consultants.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold">Connect with Certified Therapists</h3>
          <p className="text-sm text-muted-foreground">No consultants available right now. Add consultants via the admin panel.</p>
        </CardContent>
      </Card>
    );
  }

  // If 3 or fewer consultants just show them inline
  if (consultants.length <= 3) {
    return (
      <div className="flex gap-4">
        {consultants.map((c) => (
          <div key={c.id} style={{ flex: '0 0 calc((100% - 32px) / 3)' }}>
            <Card className="relative border-2 overflow-hidden rounded-lg h-[220px]">
              {c.picture_url ? (
                <div className="relative h-full w-full">
                  <img src={c.picture_url} alt={c.full_name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between">
                    <div className="text-white">
                      <h4 className="text-lg font-bold">{c.full_name || 'Consultant'}</h4>
                      <p className="text-sm opacity-90">{c.title || 'Therapist'}</p>
                    </div>

                    <div>
                      {c.booking_url ? (
                        <a href={c.booking_url} target="_blank" rel="noopener noreferrer">
                          <Button className="rounded-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm">Book Now</Button>
                        </a>
                      ) : (
                        <Link href={`/consultants/${c.id}`}>
                          <Button className="rounded-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm">Details</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-full flex items-center justify-center bg-gray-100">
                  <span className="text-5xl">👩‍⚕️</span>
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
    >
      <div ref={trackRef} className="flex gap-4 will-change-transform">
        {consultants.map((c) => (
          <div key={c.id} style={{ flex: '0 0 calc((100% - 32px) / 3)' }}>
            <Card className="relative border-2 overflow-hidden rounded-lg h-[220px]">
              {c.picture_url ? (
                <div className="relative h-full w-full">
                  <img src={c.picture_url} alt={c.full_name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between">
                    <div className="text-white">
                      <h4 className="text-lg font-bold">{c.full_name || 'Consultant'}</h4>
                      <p className="text-sm opacity-90">{c.title || 'Therapist'}</p>
                    </div>

                    <div>
                      {c.booking_url ? (
                        <a href={c.booking_url} target="_blank" rel="noopener noreferrer">
                          <Button className="rounded-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm">Book Now</Button>
                        </a>
                      ) : (
                        <Link href={`/consultants/${c.id}`}>
                          <Button className="rounded-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm">Details</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-full flex items-center justify-center bg-gray-100">
                  <span className="text-5xl">👩‍⚕️</span>
                </div>
              )}
            </Card>
          </div>
        ))}

        {/** duplicated for seamless looping */}
        {consultants.map((c) => (
          <div key={`dup-${c.id}`} style={{ flex: '0 0 calc((100% - 32px) / 3)' }}>
            <Card className="relative border-2 overflow-hidden rounded-lg h-[220px]">
              {c.picture_url ? (
                <div className="relative h-full w-full">
                  <img src={c.picture_url} alt={c.full_name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between">
                    <div className="text-white">
                      <h4 className="text-lg font-bold">{c.full_name || 'Consultant'}</h4>
                      <p className="text-sm opacity-90">{c.title || 'Therapist'}</p>
                    </div>
                    <div>
                      {c.booking_url ? (
                        <a href={c.booking_url} target="_blank" rel="noopener noreferrer">
                          <Button className="rounded-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm">Book Now</Button>
                        </a>
                      ) : (
                        <Link href={`/consultants/${c.id}`}>
                          <Button className="rounded-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm">Details</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-full flex items-center justify-center bg-gray-100">
                  <span className="text-5xl">👩‍⚕️</span>
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
