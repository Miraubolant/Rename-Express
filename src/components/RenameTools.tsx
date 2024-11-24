import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { FileData } from '../types';

interface RenameToolsProps {
  files: FileData[];
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
}

export function RenameTools({ files, setFiles }: RenameToolsProps) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const handleRename = () => {
    if (!findText) return;
    
    setFiles(prevFiles => 
      prevFiles.map(file => ({
        ...file,
        name: file.name.replaceAll(findText, replaceText)
      }))
    );
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Find
        </label>
        <input
          type="text"
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Text to find"
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Replace with
        </label>
        <input
          type="text"
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="New text"
        />
      </div>
      <button
        onClick={handleRename}
        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
      >
        <Wand2 className="h-4 w-4 mr-2" />
        Rename Files
      </button>
    </div>
  );
}