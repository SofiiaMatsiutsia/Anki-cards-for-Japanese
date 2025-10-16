import React from 'react';
import type { WordType, CardSide } from '../types';

interface ControlsProps {
  wordTypes: WordType[];
  selectedTypes: WordType[];
  onTypeChange: (type: WordType, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  cardSides: CardSide[];
  frontContent: CardSide[];
  setFrontContent: (side: CardSide[]) => void;
  backContent: CardSide[];
  setBackContent: (side: CardSide[]) => void;
}

const MultiSideSelector: React.FC<{
  label: string;
  options: CardSide[];
  selectedOptions: CardSide[];
  onChange: (newOptions: CardSide[]) => void;
}> = ({ label, options, selectedOptions, onChange }) => {
  const handleCheckboxChange = (option: CardSide, isChecked: boolean) => {
    let newSelection: CardSide[];
    if (isChecked) {
      newSelection = [...selectedOptions, option];
    } else {
      // Prevent removing the last item, ensuring a side is never empty
      if (selectedOptions.length > 1) {
        newSelection = selectedOptions.filter(item => item !== option);
      } else {
        return; // Do nothing if trying to uncheck the last item
      }
    }
    onChange(newSelection);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="space-y-2">
        {options.map(option => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              id={`${label}-${option}`}
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              className="h-4 w-4 rounded border-gray-500 bg-slate-700 text-sky-500 focus:ring-sky-500"
            />
            <label htmlFor={`${label}-${option}`} className="ml-2 block text-sm text-slate-300">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

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
          <MultiSideSelector label="Front Side" options={cardSides} selectedOptions={frontContent} onChange={setFrontContent} />
          <MultiSideSelector label="Back Side" options={cardSides} selectedOptions={backContent} onChange={setBackContent} />
        </div>
      </div>
    </div>
  );
};

export default Controls;