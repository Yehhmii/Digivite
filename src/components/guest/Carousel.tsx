"use client";
import React, { useEffect, useRef, useState } from "react";

interface CarouselProps {
  images: string[];
  speed?: number;
  itemBaseWidth?: number;
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

  const recomputeSizes = () => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    const items = Array.from(track.children) as HTMLElement[];
    if (!items.length) return;

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
    const trackRect = track.getBoundingClientRect();

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

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || images.length === 0) return;

    recomputeSizes();
    updateActiveIndex();

    const step = (t: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = t;
      const dt = (t - lastTimeRef.current) / 1000;
      lastTimeRef.current = t;

      translateRef.current -= speed * dt;

      if (totalWidth > 0 && Math.abs(translateRef.current) >= totalWidth) {
        translateRef.current += totalWidth;
      }

      track.style.transform = `translateX(${translateRef.current}px)`;

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

  useEffect(() => {
    const handle = () => {
      recomputeSizes();
      updateActiveIndex();
    };
    const id = setTimeout(handle, 100);
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

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center will-change-transform select-none"
        style={{ transform: `translateX(${translateRef.current}px)` }}
      >
        {loopImages.map((src, i) => {
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
