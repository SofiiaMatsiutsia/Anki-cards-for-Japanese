import React, { useState, useEffect, useMemo } from 'react';
import type { VocabularyItem, CardSide } from '../types';
import { CardSide as CardSideEnum } from '../types';

interface FlashcardProps {
  card: VocabularyItem | null;
  frontContent: CardSide[];
  backContent: CardSide[];
  currentIndex: number;
  deckSize: number;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
}

const CardContent: React.FC<{ sides: CardSide[], card: VocabularyItem, isBackSide: boolean }> = ({ sides, card, isBackSide }) => {
  const sortedSides = useMemo(() => {
    // Define a canonical order to prevent content jumping if user re-orders selection
    const order = [CardSideEnum.Hiragana, CardSideEnum.Kanji, CardSideEnum.English];
    return sides.slice().sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [sides]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-4">
      {sortedSides.map(side => {
        switch (side) {
          case CardSideEnum.Kanji:
            return <p key={side} className="text-5xl md:text-7xl font-bold">{card.kanji || card.hiragana}</p>;
          case CardSideEnum.Hiragana:
            return <p key={side} className="text-3xl md:text-5xl text-sky-300">{card.hiragana}</p>;
          case CardSideEnum.English:
            return <p key={side} className="text-2xl md:text-3xl text-slate-200">{card.translation}</p>;
          default:
            return null;
        }
      })}
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
  
  // State for swipe gestures
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);

  useEffect(() => {
    setIsFlipped(false);
    setTouchDeltaX(0); // Reset position for new card
  }, [currentIndex, card]);

  const handleFlip = () => {
    if (isAnimating || touchDeltaX !== 0) return; // Don't flip while swiping
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 300); // Corresponds to transition duration
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent space from scrolling the page
      handleFlip();
    }
  };

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center bg-slate-800 rounded-lg shadow-lg p-8 h-80 min-h-full">
        <p className="text-xl text-slate-400">No cards in the deck.</p>
        <p className="text-slate-500 mt-2">Please select at least one word type.</p>
      </div>
    );
  }
  
  const SWIPE_THRESHOLD = 75; // Minimum pixels for a swipe

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || isAnimating) return;
    const delta = e.touches[0].clientX - touchStartX;
    setTouchDeltaX(delta);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || isAnimating) return;

    if (Math.abs(touchDeltaX) > SWIPE_THRESHOLD) {
      // Swipe detected. Swipe right (positive delta) is prev, swipe left (negative delta) is next.
      if (touchDeltaX < 0) {
        onNext();
      } else {
        onPrev();
      }
    } else {
      // Not a valid swipe, snap back
      setTouchDeltaX(0);
    }
    setTouchStartX(null);
  };

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
      <div
        className="perspective-[1000px] cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative w-full h-80 rounded-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-opacity-75"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateX(${touchDeltaX}px) ${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}`,
            transition: touchStartX === null ? 'transform 0.3s ease-in-out' : 'none',
          }}
          onClick={handleFlip}
          onKeyDown={handleKeyDown}
          role="button"
          aria-roledescription="flippable flashcard"
          aria-label={isFlipped ? 'Card back, press space or enter to flip' : 'Card front, press space or enter to flip'}
          tabIndex={0}
        >
          <div className="absolute w-full h-full backface-hidden bg-slate-800 border-2 border-slate-700 rounded-lg overflow-hidden">
            <CardContent sides={frontContent} card={card} isBackSide={false} />
          </div>
          <div className="absolute w-full h-full backface-hidden bg-slate-800 border-2 border-sky-600 rounded-lg overflow-hidden transform-rotate-y-180">
            <CardContent sides={backContent} card={card} isBackSide={true} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <NavButton onClick={onPrev} ariaLabel="Previous card">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </NavButton>

        <div className="flex flex-col items-center">
            <button onClick={onShuffle} className="text-slate-400 hover:text-sky-400 transition-colors text-sm mb-1 focus:outline-none focus:underline" aria-label="Shuffle deck">
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