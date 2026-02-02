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
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#E5E7EB" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="skill" 
            stroke="#525252" 
            tick={{ fontSize: 11, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, maxScore]} 
            tickCount={5} 
            stroke="#D1D5DB"
            tick={{ fontSize: 10 }}
          />
          <Radar
            name="You"
            dataKey="score"
            stroke="#171717"
            strokeWidth={2}
            fill="#171717"
            fillOpacity={0.15}
            dot={{ r: 4, fill: '#171717', stroke: '#fff', strokeWidth: 2 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
