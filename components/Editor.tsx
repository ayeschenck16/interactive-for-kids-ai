import React, { useState } from 'react';
import { Sparkles, Download, RefreshCw, ArrowLeft, Palette } from 'lucide-react';
import MagicButton from './MagicButton';
import MagicLoader from './MagicLoader';
import { editMagicImage } from '../services/geminiService';
import { GenerationResult, MagicImage } from '../types';

interface EditorProps {
  currentImage: MagicImage;
  onBack: () => void;
  onUpdateImage: (newImgData: string, prompt: string) => void;
}

const Editor: React.FC<EditorProps> = ({ currentImage, onBack, onUpdateImage }) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!editPrompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    const result: GenerationResult = await editMagicImage(currentImage.data, editPrompt);
    
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    } else if (result.image) {
      onUpdateImage(result.image, editPrompt);
      setEditPrompt(''); // Clear input after successful edit
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.data;
    link.download = `magic-pix-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const presetEdits = [
    "Make it cartoon style",
    "Add sparkles everywhere",
    "Turn it purple",
    "Make it pixel art"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Left Column: Image Display */}
      <div className="w-full lg:w-1/2">
        <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white bg-white">
          <img 
            src={currentImage.data} 
            alt="Magic creation" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-4 left-4">
             <MagicButton onClick={onBack} size="sm" variant="secondary" icon={<ArrowLeft size={16} />}>
               Back
             </MagicButton>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
            <MagicButton onClick={handleDownload} variant="accent" icon={<Download size={20} />}>
              Save Picture
            </MagicButton>
        </div>
      </div>

      {/* Right Column: Edit Controls */}
      <div className="w-full lg:w-1/2 space-y-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-purple-100">
          <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
            <Palette className="text-purple-500" />
            Remix Your Picture
          </h2>
          
          <div className="space-y-4">
            <label className="block text-purple-700 font-bold">What should we change?</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g., Add a hat..."
                className="flex-1 p-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 outline-none font-medium text-lg text-purple-900"
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              />
              <button 
                onClick={handleEdit}
                disabled={loading || !editPrompt.trim()}
                className="bg-purple-500 text-white p-3 rounded-xl hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                <Sparkles size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {presetEdits.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setEditPrompt(preset)}
                  className="px-3 py-2 text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left"
                >
                  ✨ {preset}
                </button>
              ))}
            </div>
          </div>

          {loading && (
             <div className="mt-6">
               <MagicLoader message="Transforming..." />
             </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-pink-100 text-pink-700 rounded-xl font-bold text-center">
              {error}
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-6 rounded-[2rem] border-4 border-blue-100">
           <h3 className="text-xl font-bold text-blue-800 mb-2">Original Idea</h3>
           <p className="text-lg text-blue-600 italic">"{currentImage.prompt}"</p>
        </div>
      </div>
    </div>
  );
};

export default Editor;
