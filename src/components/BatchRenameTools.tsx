import React from 'react';
import { FileData } from '../types';
import { ArrowDownAZ, ArrowUpAZ, Download } from 'lucide-react';

interface BatchRenameToolsProps {
  files: FileData[];
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
  selectedFiles: Set<string>;
  filteredFiles: FileData[];
  onDownload: () => void;
}

export function BatchRenameTools({ files, setFiles, selectedFiles, filteredFiles, onDownload }: BatchRenameToolsProps) {
  const handleToLowerCase = () => {
    const filteredIds = new Set(filteredFiles.map(f => f.id));
    setFiles(
      files.map((file) => ({
        ...file,
        name: selectedFiles.has(file.id) && filteredIds.has(file.id)
          ? file.name.toLowerCase()
          : file.name,
      }))
    );
  };

  const handleToUpperCase = () => {
    const filteredIds = new Set(filteredFiles.map(f => f.id));
    setFiles(
      files.map((file) => ({
        ...file,
        name: selectedFiles.has(file.id) && filteredIds.has(file.id)
          ? file.name.toUpperCase()
          : file.name,
      }))
    );
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleToLowerCase}
        title="Convertir en minuscules"
        className="inline-flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        <ArrowDownAZ className="h-5 w-5" />
      </button>
      <button
        onClick={handleToUpperCase}
        title="Convertir en majuscules"
        className="inline-flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        <ArrowUpAZ className="h-5 w-5" />
      </button>
      <button
        onClick={onDownload}
        disabled={files.length === 0}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger les fichiers modifiés
      </button>
    </div>
  );
}