import React, { useState } from 'react';
import { Rocket, Palette, Sparkles, Image as ImageIcon } from 'lucide-react';
import Generator from './components/Generator';
import Editor from './components/Editor';
import { MagicImage } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'generate' | 'edit'>('generate');
  const [currentImage, setCurrentImage] = useState<MagicImage | null>(null);
  const [history, setHistory] = useState<MagicImage[]>([]);

  const handleImageGenerated = (imgData: string, prompt: string) => {
    const newImage: MagicImage = {
      id: Date.now().toString(),
      data: imgData,
      prompt,
      timestamp: Date.now()
    };
    
    setCurrentImage(newImage);
    setHistory(prev => [newImage, ...prev]);
    setView('edit');
  };

  const handleUpdateImage = (imgData: string, prompt: string) => {
     const newImage: MagicImage = {
      id: Date.now().toString(),
      data: imgData,
      prompt: prompt, // The edit prompt
      timestamp: Date.now()
    };
    setCurrentImage(newImage);
    setHistory(prev => [newImage, ...prev]);
  };

  const selectHistoryImage = (img: MagicImage) => {
    setCurrentImage(img);
    setView('edit');
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] font-sans selection:bg-yellow-200 selection:text-indigo-900 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-4 border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setView('generate')}
          >
            <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
              <Sparkles size={28} />
            </div>
            <h1 className="text-3xl font-black text-indigo-900 tracking-tight group-hover:text-indigo-700">
              MagicPix
            </h1>
          </div>
          
          <button 
            className="md:hidden p-2 text-indigo-900 bg-indigo-100 rounded-lg"
            onClick={() => document.getElementById('history-sidebar')?.classList.toggle('hidden')}
          >
            <ImageIcon />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {view === 'generate' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-12 text-center">
                <div className="inline-block px-4 py-1 mb-4 bg-yellow-300 rounded-full text-yellow-900 font-bold text-sm transform -rotate-2">
                  ✨ Powered by AI Magic ✨
                </div>
             </div>
             <Generator onImageGenerated={handleImageGenerated} />
             
             {/* Simple recent history grid for Home view */}
             {history.length > 0 && (
               <div className="mt-20">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                    <ImageIcon className="text-indigo-500"/> Your Recent Magic
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {history.slice(0, 6).map((img) => (
                      <div 
                        key={img.id} 
                        onClick={() => selectHistoryImage(img)}
                        className="aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform bg-white"
                      >
                        <img src={img.data} alt="history" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
               </div>
             )}
           </div>
        )}

        {view === 'edit' && currentImage && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Editor 
              currentImage={currentImage} 
              onBack={() => setView('generate')} 
              onUpdateImage={handleUpdateImage}
            />
          </div>
        )}

      </main>

      {/* Decorative footer elements */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-500"></div>
    </div>
  );
};

export default App;
