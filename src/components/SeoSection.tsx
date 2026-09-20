import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, HelpCircle, Lightbulb, Target, Compass } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'How does the Memory Card Game work?',
    a: 'You are presented with a grid of face-down cards. Click or tap any card to flip it over, then choose a second card. If the symbols on both cards match, they stay face-up. If they differ, both cards flip back over. The objective is to match all pairs in the fewest moves and fastest time possible.',
  },
  {
    q: 'What is the Daily Challenge mode?',
    a: 'Every day at midnight, a brand-new, deterministically seeded card configuration is generated for that specific date. Every player in the world gets the exact same layout, so you can test your memory against your friends on equal ground.',
  },
  {
    q: 'How is the final score calculated?',
    a: 'Your score rewards matching speed, memory accuracy, and difficulty. It consists of Base Points per pair, a Difficulty Multiplier (up to 2.2× on Hard), a Time Bonus for completing under the target threshold, an Efficiency Bonus for avoiding unnecessary turns, and consecutive match streak bonuses.',
  },
  {
    q: 'Can I play this game completely offline?',
    a: 'Yes! The entire application runs directly on your device with no backend or external server calls. All audio effects, graphics, statistics, and daily challenges work 100% offline.',
  },
  {
    q: 'Can I navigate using only my keyboard?',
    a: 'Absolutely. Use the Tab and Arrow keys to navigate between cards, press Enter or Space to flip, and press Escape to pause the game or dismiss modals.',
  },
];

export const SeoSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section
      aria-label="Game Guide and FAQ"
      className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 border-t border-slate-200/80 dark:border-slate-800/80 mt-12 text-slate-700 dark:text-slate-300"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Rules, scoring mechanics, brain training tips, and common questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* How to Play */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-bold mb-3">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              How to Play
            </h3>
          </div>
          <ol className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside">
            <li>Select your preferred <strong>Difficulty</strong> and <strong>Theme</strong>.</li>
            <li>Click or tap on any face-down card to reveal its symbol.</li>
            <li>Pick a second card to find its matching twin.</li>
            <li>If they match, they remain open. If not, memorize their spots before they flip back!</li>
            <li>Clear the board with maximum accuracy to set a high score.</li>
          </ol>
        </div>

        {/* Game Modes */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-bold mb-3">
            <Compass className="w-5 h-5" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Game Modes & Difficulties
            </h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <li><strong>Easy (4×4):</strong> 8 pairs (16 cards) — perfect for warming up.</li>
            <li><strong>Medium (4×5):</strong> 10 pairs (20 cards) — balanced challenge.</li>
            <li><strong>Hard (6×6):</strong> 18 pairs (36 cards) — serious memory workout.</li>
            <li><strong>Daily Challenge:</strong> Unique layout updated each day with identical cards globally.</li>
          </ul>
        </div>

        {/* How Scoring Works */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold mb-3">
            <Target className="w-5 h-5" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              How Scoring Works
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
            Our scoring formula rewards both speed and deliberate strategy:
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
            <li><strong>Base Points:</strong> 100 points per pair matched.</li>
            <li><strong>Difficulty Bonus:</strong> Multipliers ranging from 1.0× to 3.5×.</li>
            <li><strong>Time Bonus:</strong> Added for every second under the par time limit.</li>
            <li><strong>Move Efficiency:</strong> Bonus for matching close to theoretical minimum moves.</li>
            <li><strong>Combo Streak:</strong> Multiplier bonus for consecutive pairs matched without errors.</li>
          </ul>
        </div>

        {/* Memory Tips */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold mb-3">
            <Lightbulb className="w-5 h-5" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Memory Game Tips
            </h3>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
            <li><strong>Chunk the Grid:</strong> Mentally divide larger grids into 2×2 quadrants.</li>
            <li><strong>Vocalize Symbols:</strong> Silently naming items (e.g., "rocket top right") activates phonological memory.</li>
            <li><strong>Build a Path:</strong> Systematically explore unknown rows instead of random clicks.</li>
            <li><strong>Protect Your Streak:</strong> Only flip a known card when you remember where its match is!</li>
          </ul>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-4">
          <HelpCircle className="w-5 h-5" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 shrink-0 text-slate-400 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
