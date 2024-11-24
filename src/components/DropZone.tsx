import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onDrop: (items: DataTransferItemList) => void;
}

export function DropZone({ onDrop }: DropZoneProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      onDrop(items);
    }
  }, [onDrop]);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex items-center justify-center h-32 border-2 border-dashed border-blue-300 dark:border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
    >
      <div className="flex items-center space-x-4">
        <Upload className="h-8 w-8 text-blue-500 dark:text-blue-400" />
        <div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">Déposez vos fichiers ou dossiers ici</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tous les fichiers seront traités récursivement</p>
        </div>
      </div>
    </div>
  );
}