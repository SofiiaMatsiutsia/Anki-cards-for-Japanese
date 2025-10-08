import React, { useState, useEffect } from 'react';
import type { VocabularyItem, CardSide } from '../types';
import { CardSide as CardSideEnum } from '../types';

interface FlashcardProps {
  card: VocabularyItem | null;
  frontContent: CardSide;
  backContent: CardSide;
  currentIndex: number;
  deckSize: number;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
}

const CardContent: React.FC<{ side: CardSide, card: VocabularyItem, isBackSide: boolean }> = ({ side, card, isBackSide }) => {
  const renderContent = () => {
    switch (side) {
      case CardSideEnum.Kanji:
        return <p className="text-5xl md:text-7xl font-bold">{card.kanji || card.hiragana}</p>;
      case CardSideEnum.Hiragana:
        return <p className="text-3xl md:text-5xl text-sky-300">{card.hiragana}</p>;
      case CardSideEnum.English:
        return <p className="text-2xl md:text-3xl text-slate-200">{card.translation}</p>;
      case CardSideEnum.HiraganaAndEnglish:
        return (
          <div className="text-center">
            <p className="text-3xl md:text-5xl text-sky-300 mb-4">{card.hiragana}</p>
            <p className="text-2xl md:text-3xl text-slate-200">{card.translation}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
      {renderContent()}
      {card.kanjiMeanings && isBackSide && (
        <p className="absolute bottom-4 text-xs text-slate-400 px-2">{card.kanjiMeanings}</p>
      )}
    </div>
  );
};

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  frontContent,
  backContent,
  currentIndex,
  deckSize,
  onNext,
  onPrev,
  onShuffle,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex, card]);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 300); // Corresponds to transition duration
  };

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center bg-slate-800 rounded-lg shadow-lg p-8 h-80 min-h-full">
        <p className="text-xl text-slate-400">No cards in the deck.</p>
        <p className="text-slate-500 mt-2">Please select at least one word type.</p>
      </div>
    );
  }
  
  const NavButton: React.FC<{onClick: () => void, children: React.ReactNode, ariaLabel: string}> = ({onClick, children, ariaLabel}) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-3 bg-slate-700 rounded-full hover:bg-sky-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="perspective-[1000px]">
        <div
          className={`relative w-full h-80 rounded-lg shadow-2xl transition-transform duration-300 ease-in-out ${isFlipped ? 'transform-rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
          onClick={handleFlip}
        >
          <div className="absolute w-full h-full backface-hidden bg-slate-800 border-2 border-slate-700 rounded-lg overflow-hidden">
            <CardContent side={frontContent} card={card} isBackSide={false} />
          </div>
          <div className="absolute w-full h-full backface-hidden bg-slate-800 border-2 border-sky-600 rounded-lg overflow-hidden transform-rotate-y-180">
            <CardContent side={backContent} card={card} isBackSide={true} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <NavButton onClick={onPrev} ariaLabel="Previous card">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </NavButton>

        <div className="flex flex-col items-center">
            <button onClick={onShuffle} className="text-slate-400 hover:text-sky-400 transition-colors text-sm mb-1" aria-label="Shuffle deck">
                Shuffle Deck
            </button>
            <p className="text-slate-400 font-mono text-lg">{currentIndex + 1} / {deckSize}</p>
        </div>
        
        <NavButton onClick={onNext} ariaLabel="Next card">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </NavButton>
      </div>
      <style>{`
        .perspective-\\[1000px\\] { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .transform-rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default Flashcard;