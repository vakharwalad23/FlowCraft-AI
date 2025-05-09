import React from "react";

interface CursorSVGProps {
  className?: string;
}

export function CursorSVG({ className }: CursorSVGProps) {
  return (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g id="Cursor / Graphic Default">
        <g id="Rectangle 237" filter="url(#filter0_d_8_111)">
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M23 16.5068L11 11L13.8382 24L17.3062 18.8654L23 16.5068Z" 
            fill="#000000"
          />
          <path 
            d="M23.1914 16.9687L24.2499 16.5302L23.2085 16.0523L11.2085 10.5456L10.2978 10.1276L10.5115 11.1066L13.3497 24.1066L13.5988 25.2477L14.2525 24.2799L17.6364 19.2698L23.1914 16.9687Z" 
            stroke="white" 
            strokeMiterlimit="16"
          />
        </g>
      </g>
      <defs>
        <filter 
          id="filter0_d_8_111" 
          x="6.59552" 
          y="7.25522" 
          width="21.9043" 
          height="23.2402" 
          filterUnits="userSpaceOnUse" 
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix 
            in="SourceAlpha" 
            type="matrix" 
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" 
            result="hardAlpha"
          />
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="1.5"/>
          <feColorMatrix 
            type="matrix" 
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8_111"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8_111" result="shape"/>
        </filter>
      </defs>
    </svg>
  );
}
