import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Search,
  Copy,
  Check,
  Cpu,
  CornerDownRight,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { FLUTTER_FILES, FLUTTER_TREE_DATA } from '../data/flutterCode';
import { FolderNode, FlutterFile } from '../types';

interface CodeExplorerProps {
  onNotify: (message: string) => void;
}

export default function CodeExplorer({ onNotify }: CodeExplorerProps) {
  // Config states
  const [selectedFileKey, setSelectedFileKey] = useState<string>('lib/main.dart');
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({
    '/': true,
    '/lib': true,
    '/lib/core': true,
    '/lib/core/theme': true,
    '/lib/features': true,
    '/lib/features/home': true,
    '/lib/features/home/presentation': true,
    '/lib/features/home/presentation/screens': true,
    '/lib/features/products': true
  });
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Find the selected file's contents
  const currentFile = FLUTTER_FILES.find((f) => f.path === selectedFileKey) || FLUTTER_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    onNotify(`Copied ${currentFile.name} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFolder = (path: string) => {
    setExpandedPaths((prev) => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Helper function to render folder tree recursively
  const renderTree = (node: FolderNode, depth = 0) => {
    const isFolder = !!node.children;
    const isExpanded = expandedPaths[node.path];
    const isSelected = selectedFileKey === node.fileKey;

    if (isFolder) {
      return (
        <div key={node.path} className="select-none">
          <div
            onClick={() => toggleFolder(node.path)}
            className="flex items-center space-x-1.5 py-1 px-2 hover:bg-emerald-50/50 rounded-md cursor-pointer text-slate-700 text-xs font-medium group transition-colors"
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-emerald-700 fill-emerald-100/50" />
            ) : (
              <Folder className="w-4 h-4 text-emerald-600 fill-emerald-50" />
            )}
            <span className="truncate group-hover:text-slate-900">{node.name}</span>
          </div>

          {isExpanded && node.children && (
            <div className="mt-0.5">
              {node.children.map((child) => renderTree(child, depth + 1))}
            </div>
          )}
        </div>
      );
    } else {
      // Is file
      const isDart = node.name.endsWith('.dart');
      const isYaml = node.name.endsWith('.yaml');

      return (
        <div
          key={node.path}
          onClick={() => {
            if (node.fileKey) {
              setSelectedFileKey(node.fileKey);
            }
          }}
          className={`flex items-center space-x-1.5 py-1 px-2 my-0.5 rounded-md cursor-pointer text-xs font-semibold select-none transition-all ${
            isSelected
              ? 'bg-emerald-50 text-emerald-800 border-l-2 border-emerald-600'
              : 'text-slate-600 hover:bg-neutral-100 hover:text-slate-900'
          }`}
          style={{ paddingLeft: `${depth * 14 + 18}px` }}
        >
          {isYaml ? (
            <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-amber-500'}`} />
          ) : (
            <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-emerald-500'}`} />
          )}
          <span className="truncate">{node.name}</span>
        </div>
      );
    }
  };

  // Quick list of matching files for search
  const filteredFilesList = FLUTTER_FILES.filter((file) => {
    return (
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row h-[785px] max-w-full font-sans">
      {/* Sidebar - Files Tree */}
      <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50 p-4.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <Cpu className="w-5 h-5 text-emerald-800" />
            <h3 className="font-extrabold text-emerald-800 text-xs uppercase tracking-wider">
              Nulac Clean Architecture
            </h3>
          </div>

          {/* Quick search inside Dart source codebase */}
          <div className="relative mt-3.5 flex items-center bg-white rounded-xl border border-slate-200 px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search code symbols..."
              className="bg-transparent text-xs text-slate-800 focus:outline-none w-full font-sans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Directory section */}
          {searchQuery ? (
            <div className="mt-4 space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block mb-1">
                Found {filteredFilesList.length} matches
              </span>
              {filteredFilesList.map((file) => (
                <button
                  key={file.path}
                  onClick={() => {
                    setSelectedFileKey(file.path);
                    setSearchQuery('');
                  }}
                  className="w-full text-left truncate flex items-center space-x-1.5 p-1.5 bg-white border border-slate-100 hover:border-emerald-600 text-emerald-800 text-xs font-semibold rounded-lg"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="truncate">{file.path}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4 overflow-y-auto max-h-[500px] pr-1">
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block mb-2.5">
                Directory tree (Expandable)
              </span>
              {renderTree(FLUTTER_TREE_DATA)}
            </div>
          )}
        </div>

        {/* Integration guides block */}
        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 flex items-center mb-1">
            <Info className="w-3.5 h-3.5 mr-1 text-emerald-700" /> Flutter Integration
          </h4>
          <p className="text-[9.5px] text-slate-600 leading-normal font-sans font-medium">
            Copy this ready structure directly to your <code>lib/</code>. Set <code>flutter_bloc</code> and <code>get_it</code> inside <code>pubspec.yaml</code> for injection container compilation.
          </p>
        </div>
      </div>

      {/* Main codebase terminal panel */}
      <div className="flex-1 bg-slate-900 text-slate-100 flex flex-col justify-between overflow-hidden">
        {/* Terminal Tab header bar */}
        <div className="bg-slate-950 px-5 py-3 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 bg-red-500/80 rounded-full inline-block" />
              <span className="w-2.5 h-2.5 bg-yellow-500/80 rounded-full inline-block" />
              <span className="w-2.5 h-2.5 bg-green-500/80 rounded-full inline-block" />
            </div>
            <span className="text-[11.5px] font-mono text-slate-400 font-semibold tracking-wider italic flex items-center">
              <CornerDownRight className="w-3.5 h-3.5 text-emerald-500 mr-1" />
              {currentFile.path}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy File'}</span>
          </button>
        </div>

        {/* Editor Code Viewport Area */}
        <div className="flex-1 overflow-auto p-5 font-mono text-[12px] leading-relaxed text-[#D4D4D4] bg-[#1E1E1E]">
          <pre className="whitespace-pre">
            {currentFile.content.split('\n').map((line, index) => {
              // Extremely basic color highlights for keywords inside Dart files
              let highlightedLine = line;
              // Highlight Dart keywords
              highlightedLine = highlightedLine
                .replace(/\b(import|class|extends|factory|required|super|final|var|return|const|static|void|async|await|switch|case|default|double|int|String|List|Map|WidgetsFlutterBinding|MaterialPageRoute|MaterialApp|ThemeData)\b/g, '<span class="text-[#569CD6] font-bold">$1</span>')
                .replace(/\b(ProductModel|Product|AppTheme|AppRouter|GetProductsUseCase|ProductRepository|ProductBloc|ProductLoaded|NulacApp|NulacApp|Nulac|pub_init_1|SL|GetIt)\b/g, '<span class="text-[#4FC1FF] font-bold">$1</span>')
                .replace(/('[^']*')/g, '<span class="text-[#CE9178]">$1</span>')
                .replace(/(\/\/.+)/g, '<span class="text-[#6A9955] italic">$1</span>');

              return (
                <div key={index} className="flex space-x-4 hover:bg-white/5 py-0.5 rounded transition-colors">
                  <span className="w-5 text-right text-slate-600 select-none text-[10px] font-sans font-medium px-1 ">{index + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: highlightedLine }} />
                </div>
              );
            })}
          </pre>
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-950 px-5 py-2 flex justify-between items-center text-[10px] text-slate-500 font-mono select-none">
          <span>Language: {currentFile.language.toUpperCase()}</span>
          <span>Nulac Dairy clean-arch template setup (Production grade)</span>
        </div>
      </div>
    </div>
  );
}
