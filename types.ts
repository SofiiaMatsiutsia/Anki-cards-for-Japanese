export enum WordType {
  Noun = 'Noun',
  Verb = 'Verb',
  Adjective = 'Adjective',
  Adverb = 'Adverb',
}

export enum CardSide {
    Kanji = 'Kanji',
    Hiragana = 'Hiragana',
    English = 'English',
}

export interface VocabularyItem {
  kanji: string;
  hiragana: string;
  translation: string;
  kanjiMeanings: string;
  type: WordType;
}