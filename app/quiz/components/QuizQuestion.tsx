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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-neutral-900">{question.question}</h2>
      <div className="flex flex-col space-y-2">
        {question.options.map((opt: { label: string; value: number }) => {
          const selected = value === opt.value
          return (
            <label
              key={opt.value}
              className={`transform transition-all duration-200 flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-white border border-neutral-200 shadow-md ${selected ? 'scale-105 border-neutral-900' : 'hover:scale-105 hover:shadow-lg hover:border-neutral-300'}`}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt.value}
                checked={selected}
                onChange={() => onAnswer(question.id, opt.value)}
                className="sr-only"
                aria-label={opt.label}
              />
              <span
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  selected ? 'border-neutral-900' : 'border-neutral-500'
                }`}
              >
                {selected && <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />}
              </span>
              <span className="text-neutral-900 text-sm leading-snug">{opt.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
