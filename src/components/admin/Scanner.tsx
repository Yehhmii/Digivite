'use client';

import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, AlertCircle, RefreshCw } from 'lucide-react';

type ScanResult = {
  ok: boolean;
  guest?: any;
  message?: string;
};

export default function Scanner({ onResult }: { onResult: (res: ScanResult) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let intervalId: number | null = null;
    let scanningNow = false;
    let lastScanned: string | null = null;

    const tryPlay = async (video: HTMLVideoElement) => {
      try {
        await video.play();
      } catch (err: any) {
        if (err?.name === 'AbortError' || err?.name === 'NotAllowedError') {
          console.warn('video.play() interrupted or not allowed:', err?.name);
        } else {
          console.error('video.play() error', err);
        }
      }
    };

    const startCamera = async () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const constraintsList = [
        { video: { facingMode: { ideal: 'environment' } }, audio: false },
        { video: true, audio: false }
      ];

      for (const constraints of constraintsList) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints as MediaStreamConstraints);
          break;
        } catch (err) {
          stream = null;
        }
      }

      if (!stream) {
        setError('Unable to access camera. Please check camera permissions or ensure device supports video capture.');
        setScanning(false);
        return;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await tryPlay(videoRef.current);
      }

      setScanning(true);

      intervalId = window.setInterval(() => {
        scanFrame();
      }, 300);
    };

    const scanFrame = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;
      const video = videoRef.current;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const BarcodeDetectorCls: any = (window as any).BarcodeDetector;
      if (BarcodeDetectorCls) {
        try {
          const detector = new BarcodeDetectorCls({ formats: ['qr_code'] });
          const barcodes = await detector.detect(canvas as any);
          if (barcodes && barcodes.length > 0) {
            const raw = barcodes[0].rawValue;
            if (raw) {
              handleScanned(raw);
              return;
            }
          }
        } catch (err) {
          // fallback to jsQR below
        }
      }

      try {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code?.data) {
          handleScanned(code.data);
        }
      } catch (err) {
        // handle parse errors silently
      }
    };

    const handleScanned = async (raw: string) => {
      if (scanningNow) return;
      if (raw === lastScanned) return;
      lastScanned = raw;
      scanningNow = true;

      try {
        onResultRef.current({ ok: false, message: 'Verifying QR pass...' });

        const res = await fetch('/api/guest/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: raw }),
          credentials: 'include'
        });

        const data = await res.json();
        if (!res.ok) {
          onResultRef.current({ ok: false, message: data.error || 'Verification failed' });
        } else {
          onResultRef.current({ ok: true, guest: data.guest });
        }
      } catch (err: any) {
        console.error('verify error', err);
        onResultRef.current({ ok: false, message: 'Server connection error' });
      } finally {
        setTimeout(() => {
          scanningNow = false;
        }, 500);
      }
    };

    startCamera();

    return () => {
      if (intervalId) window.clearInterval(intervalId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      startedRef.current = false;
    };

  }, []);

  return (
    <div className="w-full space-y-3">
      {error ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex flex-col items-center text-center gap-3">
          <AlertCircle className="w-8 h-8 text-rose-600" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
          {/* Video Container */}
          <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover" 
              playsInline 
              muted 
            />

            {/* Glowing Target Frame Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl" />

                {/* Animated Scanning Line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.8)] top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Camera Status Badge */}
            <div className="absolute top-3 left-3 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>{scanning ? 'Camera Live' : 'Initializing...'}</span>
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Footer bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              Point viewfinder at guest QR code
            </span>
            <span className="text-[11px] font-mono text-slate-500">Auto-Detect</span>
          </div>
        </div>
      )}
    </div>
  );
}
