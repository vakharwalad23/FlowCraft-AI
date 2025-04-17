import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // Background with dark theme
      <div
        style={{
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
        }}
      >
        {/* Flow diagram with creative elements */}
        <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Gradient background */}
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#111" />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Base circle with gradient */}
          <circle cx="50" cy="50" r="48" fill="url(#flowGradient)" />
          
          {/* Flow diagram elements */}
          <g filter="url(#glow)">
            {/* Main flow path */}
            <path 
              d="M25 30 C40 25, 45 45, 50 50 C55 55, 60 75, 75 70" 
              stroke="#8b5cf6" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round"
            />
            
            {/* Flow nodes */}
            <circle cx="25" cy="30" r="6" fill="#6366f1" />
            <circle cx="50" cy="50" r="8" fill="#8b5cf6" />
            <circle cx="75" cy="70" r="6" fill="#6366f1" />
            
            {/* Secondary flow elements */}
            <circle cx="35" cy="65" r="5" fill="#4f46e5" opacity="0.8" />
            <circle cx="65" cy="35" r="5" fill="#4f46e5" opacity="0.8" />
            <path 
              d="M35 65 C45 60, 55 40, 65 35" 
              stroke="#6366f1" 
              strokeWidth="2" 
              fill="none" 
              strokeDasharray="3,2"
              opacity="0.8"
            />
            
            {/* AI element in center */}
            <path 
              d="M50 35 Q60 40, 60 50 Q60 60, 50 65 Q40 60, 40 50 Q40 40, 50 35Z" 
              fill="#ec4899" 
              opacity="0.9" 
            />
            
            {/* Pulse effect around center */}
            <circle cx="50" cy="50" r="15" fill="none" stroke="#ec4899" strokeWidth="1" opacity="0.3" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#ec4899" strokeWidth="0.5" opacity="0.2" />
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
