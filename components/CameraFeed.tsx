import React, { useRef, useEffect, useState } from 'react';
import { CameraIcon, RefreshIcon } from './Icons';

interface CameraFeedProps {
  onCapture: (base64Image: string | null) => void;
  isProcessing: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ onCapture, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      // If we have an image, we pause the stream logic to save resources, 
      // or we could keep it running. For simplicity and battery, we stop it when captured.
      if (capturedImage) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false,
        });
        currentStream = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Critical: wait for metadata to ensure play works correctly on all devices
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current?.play();
            } catch (e) {
              console.error("Video play failed:", e);
            }
          };
        }
        setError(null);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Unable to access camera. Please ensure permissions are granted.");
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedImage]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Mirror the context to match the CSS-mirrored video feed
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        onCapture(dataUrl);
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    onCapture(null);
  };

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-myco-light group">
      {/* Video Feed - Only show if no captured image */}
      {!capturedImage && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]" 
        />
      )}
      
      {/* Captured Preview */}
      {capturedImage && (
        <img 
          src={capturedImage} 
          alt="Captured" 
          className="w-full h-full object-cover absolute inset-0" 
        />
      )}

      {/* Hidden Canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-myco-dark/80 p-6 text-center z-20">
          <p className="text-red-400 font-mono">{error}</p>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent flex justify-center pb-8 z-10">
        {!capturedImage ? (
          <button
            onClick={captureFrame}
            disabled={!!error || isProcessing}
            className="group/btn flex items-center gap-3 px-8 py-4 bg-myco-fungi hover:bg-amber-500 text-white rounded-full font-sans font-bold tracking-wide transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
          >
            <CameraIcon className="w-6 h-6" />
            <span className="uppercase text-sm">Capture Look</span>
          </button>
        ) : (
          <button
            onClick={retake}
            disabled={isProcessing}
            className="flex items-center gap-3 px-8 py-4 bg-myco-light hover:bg-stone-600 text-white rounded-full font-sans font-bold tracking-wide transition-all transform hover:scale-105 disabled:opacity-50"
          >
            <RefreshIcon className="w-6 h-6" />
            <span className="uppercase text-sm">Retake</span>
          </button>
        )}
      </div>
    </div>
  );
};