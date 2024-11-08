// src/components/transferProgress.jsx
import React from 'react';
import { Progress } from '@/components/ui/progress';

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

export const formatTransferRate = (bitsPerSecond) => {
  if (!bitsPerSecond && bitsPerSecond !== 0) return 'N/A';
  const mbps = bitsPerSecond / 1024 / 1024;
  if (mbps < 0.1) return '< 0.1 Mbps';
  return `${mbps.toFixed(1)} Mbps`;
};

export const calculateTimeRemaining = (startTime, percentComplete) => {
  if (!startTime || percentComplete <= 0) return 'Calculating...';
  
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const elapsedMs = now - start;
  
  if (percentComplete === 0) return 'Calculating...';
  
  const totalEstimatedMs = (elapsedMs / percentComplete) * 100;
  const remainingMs = totalEstimatedMs - elapsedMs;
  
  const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
  if (remainingMinutes < 1) return 'Less than a minute';
  if (remainingMinutes < 60) return `${remainingMinutes} minutes`;
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;
  return `${remainingHours}h ${remainingMins}m`;
};

export const TransferProgress = ({ 
  transferProgress, 
  transferStartedOn,
  currentRateBitsPerSecond 
}) => {
  const percentComplete = transferProgress?.percentComplete || 0;
  const timeRemaining = calculateTimeRemaining(transferStartedOn, percentComplete);

  return (
    <div className="space-y-2">
      <Progress 
        value={percentComplete} 
        className="h-2"
      />
      <div className="flex flex-wrap justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span>
          {transferProgress?.filesRemaining || 0} files remaining
        </span>
        <span>
          {formatTransferRate(currentRateBitsPerSecond)}
        </span>
        <span>
          {transferProgress?.bytesTransferred ? 
            `${formatBytes(transferProgress.bytesTransferred)} transferred` : 
            'Calculating...'
          }
        </span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Estimated time remaining: {timeRemaining}
      </div>
    </div>
  );
};