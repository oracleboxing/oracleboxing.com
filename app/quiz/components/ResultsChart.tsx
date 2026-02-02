"use client"
import React from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  skill: string
  score: number
}

interface Props {
  data: DataPoint[]
  maxScore?: number
}

export function ResultsChart({ data, maxScore = 100 }: Props) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="80%">
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="skill" stroke="#171717" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, maxScore]} tickCount={5} stroke="#D1D5DB" />
          <Radar
            name="You"
            dataKey="score"
            stroke="#171717"
            fill="#171717"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
