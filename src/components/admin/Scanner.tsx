'use client';

import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

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
        setError('Unable to access camera. Please allow camera permissions or use a supported device.');
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
        // implement parse errors
      }
    };

    const handleScanned = async (raw: string) => {
      if (scanningNow) return;
      if (raw === lastScanned) return;
      lastScanned = raw;
      scanningNow = true;

      try {
        onResultRef.current({ ok: false, message: 'Verifying...' });

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
        onResultRef.current({ ok: false, message: 'Server error during verification' });
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
    <div className="w-full">
      {error ? (
        <div className="p-4 text-sm text-red-600">{error}</div>
      ) : (
        <div className="relative w-full">
          <video ref={videoRef} className="w-full h-auto rounded bg-black" playsInline muted />
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-40 sm:w-80 sm:h-56 border-4 border-dashed border-indigo-400 rounded-md" />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="mt-2 text-sm text-gray-600">Scanning... point camera at QR code</div>
        </div>
      )}
    </div>
  );
}
