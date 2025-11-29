import React, { useState } from 'react';
import { Wand2, Rocket, Dog, Cat, Star } from 'lucide-react';
import MagicButton from './MagicButton';
import MagicLoader from './MagicLoader';
import { generateMagicImage } from '../services/geminiService';
import { GenerationResult } from '../types';

interface GeneratorProps {
  onImageGenerated: (imgData: string, prompt: string) => void;
}

const Generator: React.FC<GeneratorProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    const result: GenerationResult = await generateMagicImage(prompt);
    
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    } else if (result.image) {
      onImageGenerated(result.image, prompt);
    }
  };

  const suggestions = [
    { text: "A cute robot eating pizza", icon: <Rocket size={18} /> },
    { text: "A dinosaur playing soccer", icon: <Star size={18} /> },
    { text: "A flying cat in space", icon: <Cat size={18} /> },
    { text: "A puppy with sunglasses", icon: <Dog size={18} /> },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-indigo-900 drop-shadow-sm">What should we create?</h2>
        <p className="text-xl text-indigo-600">Type something fun below!</p>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-indigo-100">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A rainbow colored hamster driving a car..."
          className="w-full h-32 p-4 text-2xl border-2 border-indigo-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-200 outline-none resize-none placeholder-indigo-300 text-indigo-900 font-bold"
        />
        
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s.text}
              onClick={() => setPrompt(s.text)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full font-bold text-sm transition-colors"
            >
              {s.icon} {s.text}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          {loading ? (
            <MagicLoader message="Painting your masterpiece..." />
          ) : (
            <div className="w-full flex flex-col gap-4">
               <MagicButton 
                onClick={handleGenerate} 
                disabled={!prompt.trim()} 
                size="lg" 
                className="w-full"
                icon={<Wand2 className="w-6 h-6 animate-pulse" />}
              >
                Make Magic!
              </MagicButton>
              {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-xl border-2 border-red-200 text-center font-bold animate-bounce">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
