import React from 'react';
import { Sparkles } from 'lucide-react';

const MagicLoader: React.FC<{ message?: string }> = ({ message = "Mixing magic potions..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-pulse">
      <div className="relative">
        <Sparkles className="w-16 h-16 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-8 h-8 bg-purple-500 rounded-full opacity-50 blur-xl"></div>
        </div>
      </div>
      <h3 className="mt-4 text-2xl font-bold text-indigo-800 font-comic">{message}</h3>
    </div>
  );
};

export default MagicLoader;
