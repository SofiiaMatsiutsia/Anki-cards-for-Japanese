
import { useState, useCallback, useMemo } from 'react';
import type { VocabularyItem } from '../types';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useFlashcards = (initialWords: VocabularyItem[]) => {
  const [deck, setDeckInternal] = useState<VocabularyItem[]>(() => shuffleArray(initialWords));
  const [currentIndex, setCurrentIndex] = useState(0);

  const setDeck = useCallback((words: VocabularyItem[]) => {
    setDeckInternal(shuffleArray(words));
    setCurrentIndex(0);
  }, []);

  const shuffleDeck = useCallback(() => {
    setDeckInternal(prevDeck => shuffleArray(prevDeck));
    setCurrentIndex(0);
  }, []);

  const nextCard = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % deck.length);
  }, [deck.length]);

  const prevCard = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + deck.length) % deck.length);
  }, [deck.length]);

  const currentCard = useMemo(() => deck[currentIndex] || null, [deck, currentIndex]);

  return {
    currentCard,
    currentIndex,
    deckSize: deck.length,
    nextCard,
    prevCard,
    shuffleDeck,
    setDeck,
  };
};
