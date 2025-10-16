import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { allVocabulary } from './data/vocabulary';
import Controls from './components/Controls';
import Flashcard from './components/Flashcard';
import Drawer from './components/Drawer';
import { WordType, CardSide } from './types';
import { useFlashcards } from './hooks/useFlashcards';

const App: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<WordType[]>([WordType.Adjective, WordType.Adverb, WordType.Noun, WordType.Verb]);
  const [frontContent, setFrontContent] = useState<CardSide[]>([CardSide.Kanji]);
  const [backContent, setBackContent] = useState<CardSide[]>([CardSide.Hiragana, CardSide.English]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);

  const {
    currentCard,
    nextCard,
    prevCard,
    shuffleDeck,
    currentIndex,
    deckSize,
    setDeck,
  } = useFlashcards(allVocabulary);

  const handleTypeChange = useCallback((type: WordType, isChecked: boolean) => {
    setSelectedTypes(prev => {
      const newTypes = new Set(prev);
      if (isChecked) {
        newTypes.add(type);
      } else {
        newTypes.delete(type);
      }
      return Array.from(newTypes);
    });
  }, []);

  const handleSelectAll = useCallback((isChecked: boolean) => {
    if(isChecked) {
      setSelectedTypes([WordType.Adjective, WordType.Adverb, WordType.Noun, WordType.Verb]);
    } else {
      setSelectedTypes([]);
    }
  }, []);

  useEffect(() => {
    const filtered = allVocabulary.filter(word => selectedTypes.includes(word.type));
    setDeck(filtered);
  }, [selectedTypes, setDeck]);
  
  const wordTypes = useMemo(() => [WordType.Adjective, WordType.Adverb, WordType.Noun, WordType.Verb], []);
  const cardSides = useMemo(() => [CardSide.Kanji, CardSide.Hiragana, CardSide.English], []);

  const controlsComponent = (
      <Controls
        wordTypes={wordTypes}
        selectedTypes={selectedTypes}
        onTypeChange={handleTypeChange}
        onSelectAll={handleSelectAll}
        cardSides={cardSides}
        frontContent={frontContent}
        setFrontContent={setFrontContent}
        backContent={backContent}
        setBackContent={setBackContent}
      />
  );

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-sky-400">Japanese Flashcards</h1>
          <p className="text-slate-400 mt-2">Master your vocabulary with an Anki-like experience.</p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          {/* Main content: Flashcard */}
          <div className="flex-1 lg:order-2">
            <Flashcard
              card={currentCard}
              frontContent={frontContent}
              backContent={backContent}
              currentIndex={currentIndex}
              deckSize={deckSize}
              onNext={nextCard}
              onPrev={prevCard}
              onShuffle={shuffleDeck}
            />
          </div>

          {/* Sidebar/Controls */}
          <aside className="w-full lg:w-1/3 xl:w-1/4 lg:order-1">
            {/* Mobile: Button to open drawer */}
            <div className="lg:hidden text-center">
              <button
                ref={drawerTriggerRef}
                onClick={() => setIsDrawerOpen(true)}
                className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
                aria-haspopup="dialog"
                aria-expanded={isDrawerOpen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                Customize Deck & Display
              </button>
            </div>
            
            {/* Desktop: Static controls */}
            <div className="hidden lg:block">
              {controlsComponent}
            </div>
          </aside>
        </main>
      </div>

      {/* Mobile Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} triggerRef={drawerTriggerRef}>
        {controlsComponent}
      </Drawer>
    </div>
  );
};

export default App;