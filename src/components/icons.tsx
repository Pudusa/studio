import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  twitter: (props: SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 2.8 3.2 3 5.2-1.4 1-3.2 2.2-5.2 2.7-.8 1.1-1.8 2.1-3 3-1.2 1-2.6 1.8-4.2 2.2-2.3.5-4.8.2-7.1-.9-2.5-1.2-4.9-3-7-5.3 1.2 1.1 2.8 2.3 4.4 3.1 1.5.8 3.2.9 4.8.6 1.7-.3 3.3-1 4.6-2 .7-1.1 1.1-2.4 1.2-3.8-.1.1-.3.2-.4.3-1.1.7-2.3.9-3.5.8-1.4-.2-2.8-.8-3.9-1.9-1.1-1.1-1.7-2.6-1.7-4.2 0-1.2.4-2.4 1-3.5 1.7 1.5 3.7 2.8 6 3.6 1.3 1 2.8 1.8 4.4 2.3.3-1.3.4-2.7.2-4-.4-2.2-2.1-4-4.3-4.4-1.5-.2-3 .1-4.3.8-1.3.7-2.4 1.7-3.2 3-1.2-1.2-2.6-2-4.2-2.4-1.5-.4-3.1-.3-4.6.3-1.6.6-3 1.6-4.2 3 1.8-2 4.1-3.3 6.7-4 .7-.2 1.5-.2 2.2-.2 2.3 0 4.5.8 6.4 2.3 1.8 1.4 3.1 3.3 3.8 5.4.3.8.5 1.6.5 2.5 0 2.2-1.2 4.3-3.1 5.5-2.1 1.3-4.6 1.6-7.1.8-1.3-.4-2.5-1-3.6-1.8"/>
    </svg>
  ),
  facebook: (props: SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}>
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  instagram: (props: SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  ),
};
