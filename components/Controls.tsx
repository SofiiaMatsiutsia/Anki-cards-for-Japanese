
import React from 'react';
import type { WordType, CardSide } from '../types';

interface ControlsProps {
  wordTypes: WordType[];
  selectedTypes: WordType[];
  onTypeChange: (type: WordType, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  cardSides: CardSide[];
  frontContent: CardSide;
  setFrontContent: (side: CardSide) => void;
  backContent: CardSide;
  setBackContent: (side: CardSide) => void;
}

const SideSelector: React.FC<{
  label: string;
  value: CardSide;
  onChange: (value: CardSide) => void;
  options: CardSide[];
}> = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CardSide)}
      className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const Controls: React.FC<ControlsProps> = ({
  wordTypes,
  selectedTypes,
  onTypeChange,
  onSelectAll,
  cardSides,
  frontContent,
  setFrontContent,
  backContent,
  setBackContent
}) => {
  const isAllSelected = selectedTypes.length === wordTypes.length;

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-sky-400 mb-3 border-b border-slate-700 pb-2">Word Types</h3>
        <div className="space-y-2">
           <div className="flex items-center">
            <input
              type="checkbox"
              id="select-all"
              checked={isAllSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="h-4 w-4 rounded border-gray-500 bg-slate-700 text-sky-500 focus:ring-sky-500"
            />
            <label htmlFor="select-all" className="ml-2 block text-sm font-bold text-slate-200">
              All Types
            </label>
          </div>
          {wordTypes.map(type => (
            <div key={type} className="flex items-center pl-2">
              <input
                type="checkbox"
                id={type}
                value={type}
                checked={selectedTypes.includes(type)}
                onChange={(e) => onTypeChange(type, e.target.checked)}
                className="h-4 w-4 rounded border-gray-500 bg-slate-700 text-sky-500 focus:ring-sky-500"
              />
              <label htmlFor={type} className="ml-2 block text-sm text-slate-300">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-sky-400 mb-3 border-b border-slate-700 pb-2">Card Display</h3>
        <div className="space-y-4">
          <SideSelector label="Front Side" value={frontContent} onChange={setFrontContent} options={cardSides} />
          <SideSelector label="Back Side" value={backContent} onChange={setBackContent} options={cardSides} />
        </div>
      </div>
    </div>
  );
};

export default Controls;
