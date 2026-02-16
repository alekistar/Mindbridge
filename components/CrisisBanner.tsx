import React from 'react';
import { CRISIS_RESOURCES } from '../constants';

interface CrisisBannerProps {
  onDismiss?: () => void;
  fullScreen?: boolean;
}

const CrisisBanner: React.FC<CrisisBannerProps> = ({ onDismiss, fullScreen = false }) => {
  return (
    <div 
      role="alert"
      className={`${
        fullScreen 
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm' 
          : 'fixed top-0 left-0 right-0 z-50 shadow-lg'
      } bg-red-600 text-white`}
    >
      <div className={`container mx-auto px-4 py-4 flex flex-col ${fullScreen ? 'text-center items-center gap-6 max-w-lg p-8 rounded-xl bg-red-700' : 'flex-row items-center justify-between'}`}>
        
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-bold text-lg">Need help now?</h3>
            <p className="text-red-100 text-sm md:text-base">{CRISIS_RESOURCES.text}</p>
          </div>
        </div>

        <div className={`flex gap-3 ${fullScreen ? 'flex-col w-full' : 'mt-0'}`}>
          <a 
            href={CRISIS_RESOURCES.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-red-50 transition-colors text-center whitespace-nowrap"
          >
            {CRISIS_RESOURCES.cta}
          </a>
          <div className="text-white font-medium flex items-center justify-center whitespace-nowrap px-4 border border-red-400 rounded-full">
            Call {CRISIS_RESOURCES.hotline}
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="text-red-200 hover:text-white underline text-sm mt-2"
            >
              I am safe now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrisisBanner;