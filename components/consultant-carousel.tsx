'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

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

  const visibleConsultants = useMemo(
    () =>
      consultants.filter(
        (c) => !!c?.id && !!c.full_name?.trim()
      ),
    [consultants]
  );

  const ConsultantCard = ({ consultant }: { consultant: Consultant }) => {
    const name = consultant.full_name?.trim() || 'Consultant Name';
    const title = consultant.title?.trim() || 'Title';

    const Action = ({ children }: { children: React.ReactNode }) =>
      consultant.booking_url ? (
        <a href={consultant.booking_url} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <Link href={`/consultants/${consultant.id}`}>{children}</Link>
      );

    return (
      <div className="rounded-2xl bg-card text-card-foreground shadow-sm border-2 p-3">
        <div className="aspect-[4/3] w-full rounded-2xl bg-muted overflow-hidden">
          {consultant.picture_url ? (
            <img
              src={consultant.picture_url}
              alt={name}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : null}
        </div>

        <div className="mt-2">
          <div className="inline-flex max-w-full rounded-full bg-primary/10 px-3 py-1">
            <span className="truncate text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary">
              {name}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Heart className="h-4 w-4 text-destructive" fill="currentColor" />
            <span className="truncate text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary">
              {title}
            </span>
          </div>

          <Action>
            <Button className="rounded-full px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-widest">
              Consult Now
            </Button>
          </Action>
        </div>
      </div>
    );
  };


  useEffect(() => {
    let isMounted = true;

    const fetchConsultants = async () => {
      try {
        const res = await fetch('/api/consultants', { cache: 'no-store' });
        const json = (await res.json().catch(() => ({}))) as any;
        if (!isMounted) return;
        setConsultants((json?.consultants as Consultant[]) || []);
      } catch (err) {
        console.error('Error loading consultants:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchConsultants();

    const onFocus = () => {
      // When the user comes back from the admin tab, refresh.
      fetchConsultants();
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchConsultants();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const totalWidthRef = useRef(0);
  const resumeTimeoutRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const didDragRef = useRef(false);
  const lastMoveTimeRef = useRef<number>(0);
  const lastMoveXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0); // px/sec, positive means moving left
  const momentumRafRef = useRef<number | null>(null);
  const speed = 40; // px per second

  const wrapOffset = (value: number) => {
    const width = totalWidthRef.current;
    if (!width || width <= 0) return 0;
    let next = value % width;
    if (next < 0) next += width;
    return next;
  };

  const applyTransform = () => {
    const track = trackRef.current;
    if (track) track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  };

  const scheduleResume = (delayMs = 900) => {
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, delayMs);
  };

  const stopMomentum = () => {
    if (momentumRafRef.current) cancelAnimationFrame(momentumRafRef.current);
    momentumRafRef.current = null;
  };

  const startMomentum = (initialVelocityPxPerSec: number) => {
    stopMomentum();

    // Keep paused during momentum; we'll resume after it settles.
    pausedRef.current = true;
    velocityRef.current = initialVelocityPxPerSec;

    let lastTime: number | null = null;
    const deceleration = 2600; // px/sec^2 (tuned for a quick, smooth settle)

    const step = (now: number) => {
      if (lastTime == null) lastTime = now;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const v0 = velocityRef.current;
      if (Math.abs(v0) < 40) {
        stopMomentum();
        scheduleResume();
        return;
      }

      offsetRef.current = wrapOffset(offsetRef.current + v0 * dt);
      applyTransform();

      // Apply constant deceleration opposite to direction of travel.
      const dv = deceleration * dt;
      if (v0 > 0) velocityRef.current = Math.max(0, v0 - dv);
      else velocityRef.current = Math.min(0, v0 + dv);

      momentumRafRef.current = requestAnimationFrame(step);
    };

    momentumRafRef.current = requestAnimationFrame(step);
  };

  // continuous animation effect
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const recalc = () => {
      totalWidthRef.current = track.scrollWidth / 2 || 0; // track contains two copies
    };

    recalc();
    let lastTime: number | null = null;

    function step(now: number) {
      if (lastTime == null) lastTime = now;
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      const width = totalWidthRef.current;
      if (!pausedRef.current && width > 0) {
        offsetRef.current += speed * delta;
        if (offsetRef.current >= width) offsetRef.current -= width;
        const cur = trackRef.current;
        if (cur) cur.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    const onEnter = () => { pausedRef.current = true; };
    const onLeave = () => { pausedRef.current = false; };

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => recalc()) : null;
    if (ro) {
      ro.observe(container);
      ro.observe(track);
    }

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopMomentum();
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      if (ro) ro.disconnect();
    };
  }, [visibleConsultants]);

  // Before the admin adds any consultants (or if rows are incomplete), render nothing.
  // This prevents an “empty card” from showing on the homepage.
  if (loading || visibleConsultants.length === 0) return null;

  const Section = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-6">
      <h2 className="section-title font-semibold text-primary mb-4 text-center">
        Need Professional Support?
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center mb-4">
        Connect with <span className="font-semibold">CERTIFIED Mental Health Counsellors</span> from Hexpertify.
      </p>
      {children}
    </div>
  );

  // If 3 or fewer consultants just show them inline
  if (visibleConsultants.length <= 3) {
    return (
      <Section>
        <div className="flex gap-4 overflow-x-hidden">
          {visibleConsultants.map((c) => (
            <div key={c.id} className="consultant-card-wrapper">
              <ConsultantCard consultant={c} />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', touchAction: 'pan-y' }}
        onPointerDown={(e) => {
          // Left button / touch only
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);

          stopMomentum();

          pausedRef.current = true;
          isDraggingRef.current = true;
          didDragRef.current = false;
          dragStartXRef.current = e.clientX;
          dragStartOffsetRef.current = offsetRef.current;

          lastMoveTimeRef.current = performance.now();
          lastMoveXRef.current = e.clientX;
          velocityRef.current = 0;

          try {
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          } catch {
            // no-op
          }
        }}
        onPointerMove={(e) => {
          if (!isDraggingRef.current) return;
          const delta = dragStartXRef.current - e.clientX;
          if (Math.abs(delta) > 4) didDragRef.current = true;

          offsetRef.current = wrapOffset(dragStartOffsetRef.current + delta);
          applyTransform();

          const now = performance.now();
          const dt = (now - lastMoveTimeRef.current) / 1000;
          if (dt > 0) {
            const dx = lastMoveXRef.current - e.clientX;
            // velocity is in the same direction as offset (drag left increases offset)
            velocityRef.current = dx / dt;
            lastMoveTimeRef.current = now;
            lastMoveXRef.current = e.clientX;
          }
        }}
        onPointerUp={(e) => {
          if (!isDraggingRef.current) return;
          isDraggingRef.current = false;

          try {
            (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
          } catch {
            // no-op
          }

          // Add a little inertia so sliding feels natural.
          const v = velocityRef.current;
          if (Math.abs(v) > 200) startMomentum(v);
          else scheduleResume();
        }}
        onPointerCancel={() => {
          if (!isDraggingRef.current) return;
          isDraggingRef.current = false;
          scheduleResume();
        }}
        onWheel={(e) => {
          // Support trackpads / shift+wheel for horizontal scrolling.
          const useDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
          if (!useDelta) return;

          e.preventDefault();
          if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
          pausedRef.current = true;
          offsetRef.current = wrapOffset(offsetRef.current + useDelta);
          applyTransform();
          scheduleResume();
        }}
        onClickCapture={(e) => {
          // Prevent accidental clicks when the user was dragging.
          if (!didDragRef.current) return;
          e.preventDefault();
          e.stopPropagation();
          didDragRef.current = false;
        }}
      >
        <div ref={trackRef} className="flex gap-4 will-change-transform">
          {visibleConsultants.map((c) => (
            <div key={c.id} className="consultant-card-wrapper">
              <ConsultantCard consultant={c} />
            </div>
          ))}

          {/** duplicated for seamless looping */}
          {visibleConsultants.map((c) => (
            <div key={`dup-${c.id}`} className="consultant-card-wrapper">
              <ConsultantCard consultant={c} />
            </div>
          ))}
        </div>

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

          /* One card per view on mobile; more on larger screens */
          .consultant-card-wrapper {
            flex: 0 0 100%;
            max-width: 100%;
          }

          @media (min-width: 640px) {
            .consultant-card-wrapper {
              flex: 0 0 calc((100% - 16px) / 2);
              max-width: calc((100% - 16px) / 2);
            }
          }

          @media (min-width: 1024px) {
            .consultant-card-wrapper {
              flex: 0 0 calc((100% - 32px) / 3);
              max-width: calc((100% - 32px) / 3);
            }
          }
        `}</style>
      </div>
    </Section>
  );
}
