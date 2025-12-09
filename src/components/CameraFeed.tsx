import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraFeedProps {
  isActive: boolean;
  onCapture?: () => void;
  size?: number;
}

const CameraFeed = ({ isActive, onCapture, size = 200 }: CameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  if (error) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-muted/50 rounded-xl border border-border"
        style={{ width: size, height: size }}
      >
        <CameraOff className="w-12 h-12 text-destructive mb-2" />
        <p className="text-sm text-muted-foreground text-center px-4">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3"
          onClick={startCamera}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-muted/50 rounded-xl border border-border"
        style={{ width: size, height: size }}
      >
        <Camera className="w-16 h-16 text-primary" />
        <p className="text-muted-foreground mt-2">Ready to scan your face</p>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-xl border-2 border-primary glow-blue"
        style={{ transform: 'scaleX(-1)' }}
      />
      
      {/* Scanning overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
        
        {/* Scanning line animation */}
        <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-foreground">Scanning...</span>
      </div>
    </div>
  );
};

export default CameraFeed;
