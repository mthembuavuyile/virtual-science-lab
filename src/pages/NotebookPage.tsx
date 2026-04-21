import React, { useState, useEffect } from 'react';
import { BookMarked, Plus, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Note {
  id: string;
  timestamp: string;
  content: string;
}

export default function NotebookPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentInput, setCurrentInput] = useState('');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('virtualLabNotebook');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      setNotes([
        { id: 'initial', timestamp: new Date().toLocaleString(), content: "System initialized. VyLab platform ready for simulated inputs." }
      ]);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('virtualLabNotebook', JSON.stringify(notes));
  }, [notes]);

  const handleSave = () => {
    if (!currentInput.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      content: currentInput
    };
    setNotes([newNote, ...notes]);
    setCurrentInput('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <BookMarked className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Session Notebook</h1>
            <p className="text-slate-500 text-sm">Notes are saved automatically to your device.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 flex-shrink-0">
        <label className="block text-sm font-semibold text-slate-700 mb-2">New Observation Entry</label>
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Record your observations from the simulator..."
          className="w-full min-h-[120px] bg-slate-50 border border-slate-300 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y transition-shadow placeholder:text-slate-400"
        ></textarea>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={!currentInput.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Save Entry
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-12">
        <AnimatePresence>
          {notes.map(note => (
            <motion.div 
              key={note.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium font-mono bg-slate-100 px-2 py-1 rounded">
                  <Clock className="w-3 h-3" /> {note.timestamp}
                </div>
                <button 
                  onClick={() => deleteNote(note.id)}
                  className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {notes.length === 0 && (
          <div className="text-center text-slate-400 mt-12">
            No entries yet. Start typing above to record your first experiment note.
          </div>
        )}
      </div>
    </div>
  );
}
