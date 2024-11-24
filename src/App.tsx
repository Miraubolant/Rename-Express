import React, { useState, useCallback, KeyboardEvent, useEffect } from 'react';
import { FileTable } from './components/FileTable';
import { BatchRenameTools } from './components/BatchRenameTools';
import { DropZone } from './components/DropZone';
import { Files, Download, Search, Wand2, Moon, Sun, FolderPlus, ExternalLink } from 'lucide-react';
import { FileData } from './types';
import JSZip from 'jszip';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showDropZone, setShowDropZone] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileDrop = useCallback(async (items: DataTransferItemList) => {
    const newFiles: FileData[] = [];
    const processEntry = async (entry: FileSystemEntry, path = '') => {
      if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry;
        return new Promise<void>((resolve) => {
          fileEntry.file((file) => {
            const id = crypto.randomUUID();
            newFiles.push({
              id,
              name: file.name,
              originalName: file.name,
              type: file.type,
              size: file.size,
              modified: new Date(file.lastModified).toISOString(),
              path: path + file.name,
              file,
            });
            resolve();
          });
        });
      } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry;
        const dirReader = dirEntry.createReader();
        return new Promise<void>((resolve) => {
          dirReader.readEntries(async (entries) => {
            for (const entry of entries) {
              await processEntry(entry, path + entry.name + '/');
            }
            resolve();
          });
        });
      }
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await processEntry(entry);
        }
      }
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setSelectedFiles(new Set([...selectedFiles, ...newFiles.map(f => f.id)]));
    setShowDropZone(false);
  }, [selectedFiles]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleReplace();
    }
  };

  const handleReplace = () => {
    if (!findText) return;
    const filteredIds = new Set(filteredFiles.map(f => f.id));
    setFiles(files.map(file => ({
      ...file,
      name: selectedFiles.has(file.id) && filteredIds.has(file.id)
        ? file.name.replaceAll(findText, replaceText)
        : file.name
    })));
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    files.forEach(file => {
      zip.file(file.name, file.file);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'renamed-files.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleAllFiles = (selected: boolean) => {
    if (selected) {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
    } else {
      setSelectedFiles(new Set());
    }
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <Files className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Renommage de fichiers</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://jpg.miraubolant.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              JPG Express
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Guide rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-start space-x-2">
              <span className="font-medium">1.</span>
              <p>Glissez-déposez vos fichiers ou dossiers dans la zone ci-dessous</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">2.</span>
              <p>Utilisez les outils de renommage pour modifier les noms de fichiers</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">3.</span>
              <p>Téléchargez vos fichiers renommés en un seul ZIP</p>
            </div>
          </div>
        </div>

        {/* Dropzone or New Folder Button */}
        <div className="mb-8">
          {showDropZone ? (
            <DropZone onDrop={handleFileDrop} />
          ) : (
            <button
              onClick={() => setShowDropZone(true)}
              className="w-full flex items-center justify-center h-32 border-2 border-dashed border-blue-300 dark:border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <FolderPlus className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  Ajouter un nouveau dossier
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Rename Tools */}
        <div className="space-y-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col space-y-4">
              <BatchRenameTools 
                files={files} 
                setFiles={setFiles} 
                selectedFiles={selectedFiles}
                filteredFiles={filteredFiles}
                onDownload={handleDownload}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Texte à rechercher..."
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Remplacer par..."
                  />
                </div>
              </div>
              <button
                onClick={handleReplace}
                disabled={!findText}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Remplacer
              </button>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Filtrer les fichiers..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <FileTable 
            files={filteredFiles}
            selectedFiles={selectedFiles}
            onToggleAll={toggleAllFiles}
            onToggleFile={toggleFileSelection}
          />

          {filteredFiles.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {files.length === 0 ? (
                "Déposez des fichiers pour commencer"
              ) : (
                "Aucun fichier ne correspond à votre recherche"
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Toutes les opérations sont effectuées localement dans votre navigateur.</p>
          <p>Aucun fichier n'est téléchargé sur un serveur.</p>
          <p className="mt-4 text-xs">Créé par Victor Mirault</p>
        </div>
      </div>
    </div>
  );
}

export default App;