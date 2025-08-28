import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" aria-label="JualS Logo">
      <defs>
        <linearGradient id="gold_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="75" cy="75" r="73" fill="url(#gold_gradient)" />
      <circle cx="75" cy="75" r="68" fill="white" />
      <text 
        x="50%" 
        y="48%" 
        dominantBaseline="central" 
        textAnchor="middle" 
        fontFamily="'Trebuchet MS', sans-serif" 
        fontSize="40" 
        fontWeight="bold" 
        fill="#f97316"
        stroke="#eab308"
        strokeWidth="0.5"
      >
        JualS
      </text>
      <text 
        x="50%" 
        y="65%" 
        dominantBaseline="central" 
        textAnchor="middle" 
        fontFamily="'Trebuchet MS', sans-serif" 
        fontSize="12" 
        fontWeight="bold" 
        fill="#ef4444"
      >
        Beauty of jewels
      </text>
    </svg>
  );
};

export default Logo;
