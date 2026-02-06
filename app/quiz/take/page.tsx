'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import QuizHeader from '../components/QuizHeader';
import { ProgressBar } from '../components/ProgressBar';
import { calculateDiagnosticResults } from '@/lib/diagnostic-quiz';

interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
}

interface QuizQuestion {
  id: string;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  context: string;
  explanation: string;
  diagrams: { image: string }[];
  options: QuizOption[];
  correctAnswer: string;
}

const STORAGE_KEY = 'ob-diagnostic-progress';

function loadProgress(): { responses: Record<string, string>; current: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveProgress(responses: Record<string, string>, current: number) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ responses, current })); } catch {}
}

function clearProgress() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
}

export default function QuizTakePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const [started, setStarted] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/quiz-review-data-v2.json')
      .then(r => r.json())
      .then((data: QuizQuestion[]) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);

        const saved = loadProgress();
        if (saved && saved.current > 0) {
          setResponses(saved.responses);
          setCurrent(saved.current);
          setStarted(true);
        }
        setHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (hydrated && started && questions.length) {
      saveProgress(responses, current);
    }
  }, [responses, current, started, hydrated, questions.length]);

  const q = questions[current];
  const total = questions.length;
  const hasAnswer = q ? !!responses[q.id] : false;
  const diagram = q?.diagrams?.[0]?.image || null;

  // Auto-advance if landing on an already-answered question
  useEffect(() => {
    if (!q || !started || !hydrated) return;
    if (responses[q.id] && !showFeedback) {
      const timer = setTimeout(() => {
        if (current < total - 1) {
          setDirection(1);
          setCurrent(i => i + 1);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [current, q, responses, showFeedback, started, hydrated, total]);

  const handleAnswer = useCallback((optionId: string) => {
    if (!q || showFeedback) return;

    setSelectedAnswer(optionId);
    setShowFeedback(true);

    const isCorrect = q.correctAnswer?.toUpperCase() === optionId.toUpperCase();
    setResponses(prev => ({ ...prev, [q.id]: optionId }));

    feedbackTimer.current = setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      if (current < total - 1) {
        setDirection(1);
        setCurrent(i => i + 1);
      }
    }, isCorrect ? 800 : 1800);
  }, [q, current, total, showFeedback]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const calcResult = calculateDiagnosticResults(responses);
      const id = crypto.randomUUID();
      const result = {
        ...calcResult,
        responses,
        id,
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem('ob-diagnostic-result', JSON.stringify(result));
      clearProgress();

      // Save to server so email links work
      fetch('/api/quiz/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, result }),
      }).catch(() => {});

      router.push(`/quiz/results-diagnostic?id=${id}`);
    } catch {
      alert('Failed to submit. Please try again.');
      setSubmitting(false);
    }
  };

  // Intro screen
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
        <QuizHeader />
        <main className="flex-grow flex flex-col items-center justify-center px-4 -mt-16">
          <div className="max-w-md text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight">How Well Do You Know Boxing?</h1>
            <p className="mt-4 text-lg text-neutral-600">
              {total > 0 ? `${total} questions · about 5 minutes` : 'Loading...'}
            </p>
            <button
              onClick={() => setStarted(true)}
              disabled={!questions.length}
              className="mt-8 inline-flex items-center gap-2 bg-[#37322F] text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-[#49423D] transition-colors disabled:opacity-50"
            >
              Start Test
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
        <QuizHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-neutral-500 text-xl">Loading...</div>
        </main>
      </div>
    );
  }

  const isLastQuestion = current === total - 1;
  const isLastAndAnswered = isLastQuestion && hasAnswer && !showFeedback;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
      <main className="flex-grow flex flex-col items-center px-4 py-6 sm:py-10">
        {/* Progress */}
        <div className="w-full max-w-2xl">
          <div className="mb-2">
            <span className="text-sm text-neutral-400 font-medium">
              {current + 1} / {total}
            </span>
          </div>
          <ProgressBar current={current + (hasAnswer ? 1 : 0)} total={total} />
        </div>

        {/* Question card */}
        <div className="w-full max-w-2xl mt-4 sm:mt-6 relative" style={{ minHeight: '400px' }}>
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={q.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full bg-white border border-neutral-200 shadow-sm p-5 sm:p-8 rounded-xl"
            >
              {/* Question */}
              <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 leading-snug mb-3">
                {q.question}
              </h2>
              {q.context && (
                <p className="text-neutral-500 text-sm mb-3">{q.context}</p>
              )}

              {/* Diagram */}
              {diagram && (
                <div className="rounded-xl overflow-hidden mb-4 border border-neutral-200">
                  <img
                    src={diagram.startsWith('http') ? diagram : `/quiz-diagrams-v2/${diagram}`}
                    alt="Question diagram"
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Options */}
              <div className="flex flex-col space-y-2 pt-1">
                {q.options.map(opt => {
                  const isSelected = selectedAnswer?.toUpperCase() === opt.id.toUpperCase();
                  const isCorrectOption = q.correctAnswer?.toUpperCase() === opt.id.toUpperCase();
                  const alreadyAnswered = !!responses[q.id] && !showFeedback;

                  let classes = 'w-full text-left transition-all duration-200 flex items-start gap-3 p-3.5 rounded-xl cursor-pointer border';

                  if (showFeedback) {
                    if (isCorrectOption) {
                      classes += ' bg-green-50 text-green-900 border-green-400 shadow-md';
                    } else if (isSelected && !isCorrectOption) {
                      classes += ' bg-red-50 text-red-900 border-red-400';
                    } else {
                      classes += ' bg-white text-neutral-400 border-neutral-100 opacity-50';
                    }
                  } else if (alreadyAnswered) {
                    const prevAnswer = responses[q.id];
                    if (prevAnswer?.toUpperCase() === opt.id.toUpperCase()) {
                      classes += isCorrectOption
                        ? ' bg-green-50 text-green-900 border-green-300'
                        : ' bg-red-50 text-red-900 border-red-300';
                    } else if (isCorrectOption) {
                      classes += ' bg-green-50 text-green-900 border-green-300';
                    } else {
                      classes += ' bg-white text-neutral-900 border-neutral-200';
                    }
                  } else {
                    classes += ' bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400 hover:shadow-sm active:scale-[0.99]';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleAnswer(opt.id)}
                      disabled={showFeedback || alreadyAnswered}
                      className={classes}
                    >
                      <span className={`mt-0.5 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                        showFeedback && isCorrectOption ? 'bg-green-500 text-white' :
                        showFeedback && isSelected && !isCorrectOption ? 'bg-red-500 text-white' :
                        'bg-neutral-100 text-neutral-500 border border-neutral-200'
                      }`}>
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="text-sm sm:text-base leading-snug font-medium">
                        {opt.text}
                        {showFeedback && isCorrectOption && (
                          <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                        )}
                        {showFeedback && isSelected && !isCorrectOption && (
                          <span className="ml-2 text-red-600 font-semibold">✗</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback: wrong answer explanation */}
              {showFeedback && selectedAnswer?.toUpperCase() !== q.correctAnswer?.toUpperCase() && q.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-lg p-3 bg-neutral-50"
                >
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3">{q.explanation}</p>
                </motion.div>
              )}

              {/* Submit on last question */}
              {isLastAndAnswered && (
                <div className="mt-5">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full ob-btn ob-btn-primary disabled:opacity-50"
                  >
                    {submitting ? 'Calculating...' : 'See My Results →'}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
