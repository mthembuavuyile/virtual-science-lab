import React, { useState, useEffect } from 'react';
import { BookMarked, Plus, Clock, Trash2, Search, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Note {
  id: string;
  timestamp: string;
  content: string;
}

export default function NotebookPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('virtualLabNotebook');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
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

  const handleComposerKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const groupedNotes = filteredNotes.reduce<Record<string, Note[]>>((groups, note) => {
    const noteDate = new Date(note.timestamp);
    const group = Number.isNaN(noteDate.getTime())
      ? 'Earlier notes'
      : noteDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    (groups[group] ??= []).push(note);
    return groups;
  }, {});

  return (
    <div className="max-w-5xl mx-auto min-h-full flex flex-col gap-5">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl shrink-0">
            <BookMarked className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Session Notebook</h1>
            <p className="text-slate-500 text-sm">Your observations, reports, and experiment takeaways in one place.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 sm:text-right">
          <FileText className="w-4 h-4 text-blue-500" />
          <span><strong className="text-slate-800">{notes.length}</strong> {notes.length === 1 ? 'entry' : 'entries'} saved locally</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between gap-3 mb-3">
          <label className="block text-sm font-semibold text-slate-800">New observation</label>
          <span className="text-[11px] text-slate-400">Saved on this device</span>
        </div>
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleComposerKeyDown}
          placeholder="What did you observe, measure, or learn?"
          className="w-full min-h-[132px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y transition-shadow placeholder:text-slate-400"
        ></textarea>
        <div className="mt-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-[11px] text-slate-400">Tip: press Ctrl + Enter to save</span>
          <button 
            onClick={handleSave}
            disabled={!currentInput.trim()}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Save Entry
          </button>
        </div>
      </div>

      <div className="pb-12">
        <div className="sticky top-0 z-10 flex flex-col sm:flex-row gap-3 mb-5 py-1 bg-slate-50/95 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search saved notes"
              className="w-full h-10 pl-9 pr-9 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label="Clear search">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="h-10 px-3 bg-slate-100 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-500">
            <Clock className="w-4 h-4" /> Newest first
          </div>
        </div>

        {Object.entries(groupedNotes).map(([group, groupNotes]) => (
          <section key={group} className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 px-1">{group}</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {groupNotes.map(note => (
                  <motion.article
                    key={note.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> {note.timestamp}
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-slate-400 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        aria-label="Delete note"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </section>
        ))}

        {filteredNotes.length === 0 && (
          <div className="text-center bg-white border border-dashed border-slate-300 rounded-xl px-6 py-12">
            <BookMarked className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">{searchTerm ? 'No notes match your search' : 'Your notebook is empty'}</p>
            <p className="text-sm text-slate-400 mt-1">{searchTerm ? 'Try a different word or clear the search.' : 'Add your first observation above.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
