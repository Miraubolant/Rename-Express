import React from 'react';
import { File, FileText, FileCode } from 'lucide-react';
import { FileData } from '../types';

interface FileTableProps {
  files: FileData[];
  selectedFiles: Set<string>;
  onToggleAll: (selected: boolean) => void;
  onToggleFile: (fileId: string) => void;
}

function getFileIcon(type: string) {
  if (type.includes('text')) return FileText;
  if (type.includes('javascript') || type.includes('typescript') || type.includes('json')) return FileCode;
  return File;
}

export function FileTable({ files, selectedFiles, onToggleAll, onToggleFile }: FileTableProps) {
  const allSelected = files.length > 0 && files.every(file => selectedFiles.has(file.id));
  const someSelected = files.some(file => selectedFiles.has(file.id));

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                checked={allSelected}
                ref={input => {
                  if (input) {
                    input.indeterminate = someSelected && !allSelected;
                  }
                }}
                onChange={(e) => onToggleAll(e.target.checked)}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nom original
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nouveau nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Taille
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Modifié le
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {files.map((file) => {
            const Icon = getFileIcon(file.type);
            const isRenamed = file.name !== file.originalName;
            return (
              <tr 
                key={file.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  isRenamed ? 'bg-green-50 dark:bg-green-900/20' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    checked={selectedFiles.has(file.id)}
                    onChange={() => onToggleFile(file.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                      {file.originalName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${isRenamed ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-900 dark:text-gray-200'}`}>
                    {file.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {file.type || 'Inconnu'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(file.modified).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 octets';
  const k = 1024;
  const sizes = ['octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default FileTable;