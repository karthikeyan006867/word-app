'use client'

import React, { useState } from 'react'
import { FiX, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi'

interface ChartInsertProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (chartConfig: any) => void
}

const ChartInsert: React.FC<ChartInsertProps> = ({ isOpen, onClose, onInsert }) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'doughnut'>('bar')
  const [chartTitle, setChartTitle] = useState('Chart Title')
  const [labels, setLabels] = useState('Q1, Q2, Q3, Q4')
  const [data, setData] = useState('30, 40, 35, 50')

  if (!isOpen) return null

  const handleInsert = () => {
    const chartConfig = {
      type: chartType,
      title: chartTitle,
      labels: labels.split(',').map(l => l.trim()),
      data: data.split(',').map(d => parseFloat(d.trim())),
    }
    onInsert(chartConfig)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiBarChart2 /> Insert Chart
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Chart Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Chart Type</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'bar', icon: FiBarChart2, label: 'Bar' },
                { type: 'line', icon: FiTrendingUp, label: 'Line' },
                { type: 'pie', icon: FiPieChart, label: 'Pie' },
                { type: 'doughnut', icon: FiPieChart, label: 'Doughnut' },
              ].map((chart) => (
                <button
                  key={chart.type}
                  onClick={() => setChartType(chart.type as any)}
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                    chartType === chart.type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <chart.icon className="w-6 h-6" />
                  <span className="text-sm">{chart.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chart Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Chart Title</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
          </div>

          {/* Labels */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Labels (comma-separated)
            </label>
            <input
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              placeholder="Q1, Q2, Q3, Q4"
            />
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Data (comma-separated numbers)
            </label>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              placeholder="30, 40, 35, 50"
            />
          </div>

          {/* Preview Notice */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              📊 Chart will be inserted as an image. For interactive charts, database integration is required.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleInsert}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Insert Chart
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartInsert
