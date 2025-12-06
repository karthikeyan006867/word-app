'use client'

import React from 'react'
import { FiUsers, FiWifi, FiWifiOff } from 'react-icons/fi'

interface CollaborationStatusProps {
  isConnected?: boolean
  activeUsers?: Array<{ id: string; name: string; color: string }>
}

const CollaborationStatus: React.FC<CollaborationStatusProps> = ({ 
  isConnected = false, 
  activeUsers = [] 
}) => {
  return (
    <div className="collaboration-status no-print">
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-[250px]">
        {/* Connection Status */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          {isConnected ? (
            <>
              <FiWifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
            </>
          ) : (
            <>
              <FiWifiOff className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Offline Mode</span>
            </>
          )}
        </div>

        {/* Active Users */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FiUsers className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isConnected ? `${activeUsers.length} Active` : 'Solo Editing'}
            </span>
          </div>
          
          {isConnected && activeUsers.length > 0 && (
            <div className="space-y-1">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">{user.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Database Integration Notice */}
        {!isConnected && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Enable collaboration with database integration
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollaborationStatus
