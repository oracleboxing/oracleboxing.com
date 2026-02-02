"use client"
import React from 'react'
import { QuizQuestion } from '@/lib/quiz-types'

interface Props {
  question: QuizQuestion
  value?: number
  onAnswer: (id: number, value: number) => void
}

export function QuizQuestionComponent({ question, value = 0, onAnswer }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">{question.question}</h2>
      <div className="flex flex-col space-y-2 pt-1">
        {question.options.map((opt: { label: string; value: number }) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onAnswer(question.id, opt.value)}
              className={`
                w-full text-left transition-all duration-200 flex items-start gap-3 p-3.5 rounded-xl cursor-pointer border
                ${selected
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.01]'
                  : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400 hover:shadow-sm active:scale-[0.99]'
                }
              `}
            >
              <span
                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  selected ? 'border-white' : 'border-neutral-300'
                }`}
              >
                {selected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
              </span>
              <span className="text-sm leading-snug font-medium">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
