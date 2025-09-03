// components/guest/Carousel.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";

interface CarouselProps {
  images: string[];            // array of image paths (e.g. ['/c1.jpg', '/c2.jpg'])
  speed?: number;              // px per second, default 60 (tweak to taste)
  itemBaseWidth?: number;      // base width for each item in px (fallback)
}

export default function Carousel({
  images,
  speed = 60,
  itemBaseWidth = 160,
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // translate in px (keeps fractional)
  const translateRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalWidth, setTotalWidth] = useState<number>(0);

  // duplicate images for seamless loop
  const loopImages = [...images, ...images];

  // compute widths & total width (for first images.length)
  const recomputeSizes = () => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    const items = Array.from(track.children) as HTMLElement[];
    if (!items.length) return;

    // compute total width for single set
    let singleSetWidth = 0;
    for (let i = 0; i < images.length; i++) {
      const el = items[i];
      singleSetWidth += el.getBoundingClientRect().width + parseFloat(getComputedStyle(el).marginLeft || "0") + parseFloat(getComputedStyle(el).marginRight || "0");
    }
    setTotalWidth(singleSetWidth);
  };

  // center-detection: decide which item (index in original images) is closest to container center
  const updateActiveIndex = () => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    const items = Array.from(track.children) as HTMLElement[];
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    // trackLeft (distance track has been translated)
    const trackRect = track.getBoundingClientRect();

    // iterate only first set of items
    let closestIndex = 0;
    let closestDist = Infinity;
    for (let i = 0; i < images.length; i++) {
      const item = items[i];
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const dist = Math.abs(itemCenter - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }
    setActiveIndex(closestIndex);
  };

  // animation loop
  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || images.length === 0) return;

    // ensure sizes calculated
    recomputeSizes();
    updateActiveIndex();

    const step = (t: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = t;
      const dt = (t - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = t;

      // move translate left by speed * dt
      translateRef.current -= speed * dt;

      // reset when consumed one set width
      if (totalWidth > 0 && Math.abs(translateRef.current) >= totalWidth) {
        // wrap - ensures seamless jump without visible glitch
        translateRef.current += totalWidth;
      }

      // apply transform
      track.style.transform = `translateX(${translateRef.current}px)`;

      // update active index periodically (not on every frame for perf)
      // we'll update at about every 120ms (approx 8fps)
      const now = performance.now();
      if (!("lastActiveUpdate" in (lastTimeRef as any))) {
        (lastTimeRef as any).lastActiveUpdate = now;
      }
      if (now - (lastTimeRef as any).lastActiveUpdate > 120) {
        updateActiveIndex();
        (lastTimeRef as any).lastActiveUpdate = now;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    const onResize = () => {
      recomputeSizes();
      // if track width changed, keep translateRef bounded
      if (totalWidth > 0) {
        translateRef.current = translateRef.current % totalWidth;
      }
    };

    window.addEventListener("resize", onResize);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      lastTimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, speed, totalWidth]);

  // recompute sizes after first paint (images might load)
  useEffect(() => {
    const handle = () => {
      recomputeSizes();
      updateActiveIndex();
    };
    // re-run on next tick to give DOM time for images
    const id = setTimeout(handle, 100);
    // also run when images load
    const track = trackRef.current;
    const imgs = track ? Array.from(track.querySelectorAll("img")) : [];
    const boundLoaders: (() => void)[] = [];
    imgs.forEach((img) => {
      if (!img.complete) {
        const fn = () => {
          recomputeSizes();
          updateActiveIndex();
        };
        img.addEventListener("load", fn);
        boundLoaders.push(() => img.removeEventListener("load", fn));
      }
    });
    return () => {
      clearTimeout(id);
      boundLoaders.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // Tailwind + small inline styles for items — center one gets a special class
  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center will-change-transform select-none"
        style={{ transform: `translateX(${translateRef.current}px)` }}
      >
        {loopImages.map((src, i) => {
          // compute index in original images
          const idx = i % images.length;
          const isActive = idx === activeIndex;
          return (
            <div
              key={`${i}-${src}`}
              className={`flex-shrink-0 mx-3 transition-transform duration-400 ease-out ${isActive ? "scale-110 z-30" : "scale-95 opacity-80 z-10"}`}
              style={{
                width: itemBaseWidth,
                boxShadow: isActive ? "0 10px 30px rgba(212,175,55,0.14)" : undefined,
                transformOrigin: "center",
              }}
            >
              <div className={`rounded-lg overflow-hidden border border-white/6`} >
                <img src={src} alt={`slide-${idx}`} className="w-full h-36 md:h-44 object-cover block" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
