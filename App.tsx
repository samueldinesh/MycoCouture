import React, { useState, useCallback } from 'react';
import { CameraFeed } from './components/CameraFeed';
import { ControlPanel } from './components/ControlPanel';
import { Spinner } from './components/Spinner';
import { MagicIcon } from './components/Icons';
import { CustomizationState, DressType, MaterialColor, AccessoryType } from './types';
import { generateTryOn } from './services/geminiService';

const App: React.FC = () => {
  const [customization, setCustomization] = useState<CustomizationState>({
    dressType: DressType.Jacket,
    color: MaterialColor.Natural,
    accessory: AccessoryType.None,
  });

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = useCallback((base64Image: string | null) => {
    setCapturedImage(base64Image);
    if (base64Image) {
      setGeneratedImage(null); // Reset previous result if new capture
      setError(null);
    }
  }, []);

  const handleGenerate = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await generateTryOn(capturedImage, customization);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate the look. Try adjusting the pose or lighting.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomizationChange = (newState: Partial<CustomizationState>) => {
    setCustomization(prev => ({ ...prev, ...newState }));
  };

  return (
    <div className="min-h-screen bg-myco-dark text-stone-200 flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 border-b border-myco-light/30 bg-myco-dark z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
              MYCO<span className="text-myco-fungi">COUTURE</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-myco-accent mt-1">
              Grown from Earth • Designed by AI
            </p>
          </div>
          {process.env.API_KEY ? (
            <div className="px-3 py-1 rounded-full bg-green-900/30 border border-green-800 text-green-500 text-xs font-mono">
              System Online
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-red-900/30 border border-red-800 text-red-500 text-xs font-mono">
              Missing API Key
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: Visuals (Camera & Result) */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto lg:overflow-hidden">
          
          <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">
            
            {/* Camera/Input Section */}
            <div className="flex-1 relative flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-sans text-sm uppercase tracking-widest text-stone-500">Live Feed</h3>
              </div>
              <div className="flex-1 relative rounded-2xl overflow-hidden border border-myco-light/20 bg-black min-h-[300px]">
                <CameraFeed 
                  onCapture={handleCapture} 
                  isProcessing={isProcessing} 
                />
              </div>
            </div>

            {/* Result Section */}
            <div className="flex-1 relative flex flex-col gap-4">
              <h3 className="font-sans text-sm uppercase tracking-widest text-stone-500">
                Mycelium Render
              </h3>
              <div className="flex-1 relative rounded-2xl overflow-hidden border border-myco-light/20 bg-myco-base flex items-center justify-center group min-h-[300px]">
                
                {/* Empty State */}
                {!generatedImage && !isProcessing && (
                  <div className="text-center p-8 opacity-50">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-myco-light flex items-center justify-center">
                      <MagicIcon className="w-8 h-8 text-stone-400" />
                    </div>
                    <p className="font-serif text-xl mb-2">Ready to Weave</p>
                    <p className="text-sm text-stone-400 max-w-xs mx-auto">
                      Capture your photo and click 'Generate' to see the Myco leather adaptation.
                    </p>
                  </div>
                )}

                {/* Processing State */}
                {isProcessing && <Spinner />}

                {/* Result Image */}
                {generatedImage && (
                  <>
                    <img 
                      src={generatedImage} 
                      alt="Myco Couture Result" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4">
                      <a 
                        href={generatedImage} 
                        download="myco-couture.png"
                        className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                        title="Download"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 12.75l-3-3m0 0 3-3m-3 3h7.5" />
                        </svg>
                      </a>
                    </div>
                  </>
                )}

                 {/* Error Message */}
                 {error && (
                   <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-8 text-center">
                     <div>
                       <div className="text-red-500 font-bold mb-2">Generation Failed</div>
                       <p className="text-sm text-stone-300">{error}</p>
                     </div>
                   </div>
                 )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={!capturedImage || isProcessing}
                className={`
                  w-full py-5 rounded-xl font-bold tracking-widest uppercase transition-all duration-300
                  flex items-center justify-center gap-3 shadow-lg
                  ${!capturedImage || isProcessing
                    ? 'bg-stone-800 text-stone-600 cursor-not-allowed border border-stone-700' 
                    : 'bg-gradient-to-r from-myco-leaf to-lime-800 text-white hover:scale-[1.02] hover:shadow-lime-900/50 border border-lime-600'
                  }
                `}
              >
                {isProcessing ? 'Growing Fabric...' : 'Generate Look'}
                {!isProcessing && <MagicIcon className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Right/Bottom Panel: Controls */}
        <div className="lg:w-96 bg-myco-base lg:h-auto flex-shrink-0 z-20 shadow-2xl lg:shadow-none">
          <ControlPanel 
            state={customization} 
            onChange={handleCustomizationChange}
            disabled={isProcessing} 
          />
        </div>

      </main>
    </div>
  );
};

export default App;