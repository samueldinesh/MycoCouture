import React from 'react';

export const Spinner = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-myco-light rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-myco-fungi rounded-full animate-spin border-t-transparent"></div>
    </div>
    <p className="text-myco-accent text-sm animate-pulse tracking-widest uppercase">Cultivating Mycelium...</p>
  </div>
);
