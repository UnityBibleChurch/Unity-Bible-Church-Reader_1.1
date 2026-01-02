import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, ChevronRight, ExternalLink, Moon, Sun, Info, CheckCircle, ArrowLeft } from 'lucide-react';

// Import JSON data files
import januaryData from './data/january.json';
import februaryData from './data/february.json';
import marchData from './data/march.json';

// --- CONFIGURATION ---
const LSB_URL_BUILDER = (book: string, chapter: number) =>
`https://read.lsbible.org/?q=${encodeURIComponent(book)}+${chapter}`;

// Combine all month data into one array
const READING_PLAN = [
  ...januaryData,
...februaryData,
...marchData,
// Add more months as you create them
];

// --- HELPER: Parse chapter strings like "1-2" or "3" into arrays ---
const parseChapters = (chapterStr: string): number[] => {
  if (!chapterStr || chapterStr === '') return [];

  const chapters: number[] = [];
  const parts = chapterStr.split(',').map(p => p.trim());

  parts.forEach(part => {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        chapters.push(i);
      }
    } else {
      const num = Number(part);
      if (!isNaN(num)) chapters.push(num);
    }
  });

  return chapters;
};

// --- TYPE DEFINITIONS ---
interface Reading {
  book: string;
  chapters: string;
}

interface DayPlan {
  id: string;
  month: string;
  day: number;
  dateDisplay: string;
  fullDate: string;
  ot: Reading;
  wisdom: Reading;
  nt: Reading;
  isSunday?: boolean;
}

interface ActiveReading {
  book: string;
  chapter: number;
}

// --- COMPONENT: THEME TOGGLE ---
const ThemeToggle: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => (
  <button
  onClick={toggleDarkMode}
  className={`
    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
    ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}
    `}
    title="Toggle Dark Mode"
    >
    <span className="sr-only">Toggle dark mode</span>
    <span
    className={`
      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center
      ${darkMode ? 'translate-x-5' : 'translate-x-0'}
      `}
      >
      {darkMode ? <Moon className="w-3 h-3 text-indigo-600" /> : <Sun className="w-3 h-3 text-orange-400" />}
      </span>
      </button>
);

// --- COMPONENT: ABOUT MODAL ---
const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
    {/* Header */}
    <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
    <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
    <BookOpen className="w-6 h-6 text-white" />
    </div>
    <h2 className="text-2xl font-bold text-white">About</h2>
    </div>
    <button
    onClick={onClose}
    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
    >
    <ArrowLeft className="w-5 h-5" />
    </button>
    </div>
    </div>

    {/* Content */}
    <div className="p-6 space-y-6">
    {/* Church Info */}
    <div className="space-y-3">
    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Unity Bible Church</h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
    "Desire to see God glorified through our worship of Him, building up believers and sharing the Good News of Christ."
    </p>
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-2 border border-slate-200 dark:border-slate-700">
    <p className="text-sm text-slate-700 dark:text-slate-300">
    📍 541 College St. Lewiston, ME 04240
    </p>
    <p className="text-sm text-slate-700 dark:text-slate-300">
    ⏰ Sunday School 9am • Worship 10am
    </p>
    </div>
    </div>

    {/* Reading Plan Info */}
    <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">2026 Reading Plan</h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    Follow along with Unity Bible Church's spiritual growth guide using the Legacy Standard Bible (LSB).
    Read daily from the Old Testament, Wisdom Literature, and New Testament.
    </p>
    </div>

    {/* Features */}
    <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Features</h3>
    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
    <li className="flex items-start gap-2">
    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
    <span>Track your reading progress with checkmarks</span>
    </li>
    <li className="flex items-start gap-2">
    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
    <span>Read scripture directly in the app</span>
    </li>
    <li className="flex items-start gap-2">
    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
    <span>Dark mode for comfortable reading</span>
    </li>
    <li className="flex items-start gap-2">
    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
    <span>Calendar view to navigate any date</span>
    </li>
    </ul>
    </div>

    {/* Version */}
    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
    <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
    Version 1.0 • Built with ❤️ for Unity Bible Church
    </p>
    </div>
    </div>
    </div>
    </div>
  );
};

// --- COMPONENT: READING CARD ---
const ReadingCard: React.FC<{
  title: string;
  reading: Reading;
  onChapterSelect: (book: string, chapter: number) => void;
  selectedChapter: ActiveReading | null;
  onMarkRead: (uniqueId: string) => void;
  completedChapters: string[];
  id: string;
  isSunday?: boolean;
}> = ({ title, reading, onChapterSelect, selectedChapter, onMarkRead, completedChapters, id, isSunday }) => {
  if (!reading || !reading.book) return null;

  // Handle Sunday special case
  if (isSunday) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl shadow-sm border-2 border-amber-200 dark:border-amber-800 overflow-hidden mb-4 md:mb-0 transition-all duration-200 flex flex-col h-full">
      <div className="bg-amber-100/50 dark:bg-amber-900/30 px-3 py-2 border-b border-amber-200 dark:border-amber-800">
      <h3 className="text-[10px] uppercase tracking-widest font-bold text-amber-600 dark:text-amber-500">{title}</h3>
      </div>
      <div className="p-4 flex-grow flex items-center justify-center">
      <p className="text-sm text-center text-amber-800 dark:text-amber-300 font-medium italic">
      {reading.book}
      </p>
      </div>
      </div>
    );
  }

  const chapters = parseChapters(reading.chapters);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-4 md:mb-0 transition-all duration-200 flex flex-col h-full hover:shadow-md dark:hover:border-slate-600">
    <div className="bg-slate-50/50 dark:bg-slate-900/30 px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 flex flex-col gap-1 items-start">
    <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">{title}</h3>
    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 w-full truncate">
    {reading.book} <span className="text-slate-400 dark:text-slate-500 font-normal">Ch {reading.chapters}</span>
    </span>
    </div>
    <div className="p-3 flex-grow bg-white dark:bg-slate-800">
    <div className="flex flex-col gap-1.5">
    {chapters.map(chap => {
      const isSelected = selectedChapter && selectedChapter.book === reading.book && selectedChapter.chapter === chap;
      const uniqueId = `${id}-${reading.book}-${chap}`;
      const isCompleted = completedChapters.includes(uniqueId);

      return (
        <div key={chap} className="flex items-center gap-2">
        <button
        onClick={() => onMarkRead(uniqueId)}
        className={`
          flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors
          ${isCompleted
            ? 'bg-green-500 border-green-500 text-white'
            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-green-400'
          }
          `}
          title="Mark as Read"
          >
          {isCompleted && <CheckCircle className="w-3.5 h-3.5" />}
          </button>

          <button
          onClick={() => onChapterSelect(reading.book, chap)}
          className={`
            flex-grow py-1.5 px-3 rounded-md text-xs font-medium transition-all text-center border
            ${isSelected
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
              : isCompleted
              ? 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 line-through'
              : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-700'
            }
            `}
            >
            Chapter {chap}
            </button>
            </div>
      );
    })}
    </div>
    </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [view, setView] = useState<'daily' | 'calendar'>('daily');
  const [activeReading, setActiveReading] = useState<ActiveReading | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  // Initialize on mount
  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('unity_bible_theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    // Load progress
    const savedProgress = localStorage.getItem('unity_bible_progress');
    if (savedProgress) {
      setCompletedChapters(JSON.parse(savedProgress));
    }

    // Set current date
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];
    const todayIndex = READING_PLAN.findIndex(d => d.id === isoDate);

    if (todayIndex !== -1) {
      setCurrentDateIndex(todayIndex);
    } else {
      setCurrentDateIndex(0);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('unity_bible_theme', newMode ? 'dark' : 'light');
  };

  // Toggle chapter completion
  const toggleChapterRead = (uniqueId: string) => {
    let newCompleted: string[];
    if (completedChapters.includes(uniqueId)) {
      newCompleted = completedChapters.filter(id => id !== uniqueId);
    } else {
      newCompleted = [...completedChapters, uniqueId];
    }
    setCompletedChapters(newCompleted);
    localStorage.setItem('unity_bible_progress', JSON.stringify(newCompleted));
  };

  const handleChapterSelect = (book: string, chapter: number) => {
    setActiveReading({ book, chapter });
  };

  const currentPlan = READING_PLAN[currentDateIndex] as DayPlan;

  const getUrl = () => {
    if (!activeReading) return '';
    return LSB_URL_BUILDER(activeReading.book, activeReading.chapter);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col relative">

    {/* HEADER */}
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-slate-200/50 dark:border-slate-800 transition-colors duration-200">
    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">

    {/* LEFT: Logo & Brand */}
    <div className="flex items-center gap-3">
    <div className="flex-shrink-0">
    {!logoError ? (
      <img
      src="https://www.google.com/s2/favicons?domain=unitybible.com&sz=128"
      alt="Unity Bible Church"
      className="w-10 h-10 object-contain rounded-full shadow-sm bg-white"
      onError={() => setLogoError(true)}
      />
    ) : (
      <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
      <BookOpen className="w-6 h-6 text-white" />
      </div>
    )}
    </div>
    <div className="flex flex-col">
    <span className="font-bold text-slate-800 dark:text-white leading-tight text-sm md:text-base">Unity Bible Church</span>
    <div className="flex items-center gap-2 mt-1">
    <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
    </div>
    </div>

    {/* CENTER: Title */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center">
    <h1 className="text-base font-bold text-slate-800 dark:text-white text-center">
    2026 Spiritual Growth Guide
    </h1>
    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5">
    Legacy Standard Bible
    </span>
    </div>

    {/* RIGHT: Controls */}
    <div className="flex items-center gap-2 md:gap-3">
    <button
    onClick={() => setView(view === 'daily' ? 'calendar' : 'daily')}
    className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700/50 rounded-full border border-slate-100 dark:border-slate-700"
    title="Change Date"
    >
    <Calendar className="w-4 h-4" />
    <span className="text-xs font-semibold hidden sm:inline">Change Date</span>
    </button>

    <button
    onClick={() => setShowAbout(true)}
    className="p-2 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors bg-transparent rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
    title="About"
    >
    <Info className="w-5 h-5" />
    </button>
    </div>
    </div>

    {/* Mobile Title */}
    <div className="md:hidden pb-2 text-center border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
    <h1 className="text-sm font-bold text-slate-700 dark:text-slate-300">
    2026 Spiritual Growth Guide
    </h1>
    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
    Legacy Standard Bible
    </p>
    </div>
    </header>

    <main className="max-w-5xl mx-auto px-4 py-6 pb-24 w-full">
    {view === 'calendar' ? (
      // CALENDAR VIEW
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 sticky top-0 flex justify-between items-center">
      <h2 className="font-bold text-slate-700 dark:text-slate-200">Reading Schedule</h2>
      <button
      onClick={() => setView('daily')}
      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
      >
      Back to Daily View
      </button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[75vh] overflow-y-auto">
      {READING_PLAN.map((day, idx) => (
        <button
        key={day.id}
        onClick={() => {
          setCurrentDateIndex(idx);
          setView('daily');
          setActiveReading(null);
        }}
        className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
          idx === currentDateIndex
          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 pl-3'
          : 'pl-4'
        }`}
        >
        <div>
        <div className="font-medium text-slate-800 dark:text-slate-200">{day.dateDisplay}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        {day.isSunday ? (
          <span className="text-amber-600 dark:text-amber-400 font-medium">Sunday - Rest & Worship</span>
        ) : (
          <>
          {day.ot.book} {day.ot.chapters} • {day.wisdom.book} {day.wisdom.chapters} • {day.nt.book} {day.nt.chapters}
          </>
        )}
        </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
        </button>
      ))}
      </div>
      </div>
    ) : (
      // DAILY VIEW
      <div className="space-y-6">
      {/* Date & Verse Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200 flex justify-center">
      <div className="text-center flex flex-col gap-2 max-w-lg w-full">
      <div className="text-amber-600 dark:text-amber-400 font-serif italic text-base md:text-xl leading-relaxed font-semibold">
      "Your word is a lamp to my feet<br className="hidden sm:inline" /> And a light to my path."
      </div>
      <div className="text-xs font-bold text-amber-700/70 dark:text-amber-500/70 uppercase tracking-widest mt-1">
      Psalm 119:105
      </div>
      <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700/50">
      <div className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">
      {currentPlan.fullDate || currentPlan.dateDisplay}
      </div>
      </div>
      </div>
      </div>

      {/* Reading Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ReadingCard
      title="Old Testament"
      reading={currentPlan.ot}
      onChapterSelect={handleChapterSelect}
      selectedChapter={activeReading}
      onMarkRead={toggleChapterRead}
      completedChapters={completedChapters}
      id={currentPlan.id}
      isSunday={currentPlan.isSunday}
      />
      <ReadingCard
      title="Wisdom"
      reading={currentPlan.wisdom}
      onChapterSelect={handleChapterSelect}
      selectedChapter={activeReading}
      onMarkRead={toggleChapterRead}
      completedChapters={completedChapters}
      id={currentPlan.id}
      isSunday={currentPlan.isSunday}
      />
      <ReadingCard
      title="New Testament"
      reading={currentPlan.nt}
      onChapterSelect={handleChapterSelect}
      selectedChapter={activeReading}
      onMarkRead={toggleChapterRead}
      completedChapters={completedChapters}
      id={currentPlan.id}
      isSunday={currentPlan.isSunday}
      />
      </div>

      {/* Bible Reader */}
      {activeReading && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 shadow-2xl rounded-t-2xl z-20 border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom duration-300 transition-colors">
        <div className="max-w-5xl mx-auto">
        <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur rounded-t-2xl">
        <div className="flex items-center gap-2">
        <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1 rounded-full text-xs">
        {activeReading.book} {activeReading.chapter}
        </span>
        <a
        href={getUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-transparent rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
        title="Open in new tab"
        >
        <ExternalLink className="w-4 h-4" />
        </a>
        </div>
        <button
        onClick={() => setActiveReading(null)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Go Back</span>
        </button>
        </div>
        <iframe
        src={getUrl()}
        className="w-full h-[60vh] border-0"
        title={`${activeReading.book} ${activeReading.chapter}`}
        sandbox="allow-same-origin allow-scripts"
        />
        </div>
        </div>
      )}
      </div>
    )}
    </main>

    {/* About Modal */}
    <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
    </div>
  );
}
