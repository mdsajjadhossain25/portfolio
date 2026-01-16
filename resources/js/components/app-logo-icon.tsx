import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
            <text x="16" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="700" fill="white" textAnchor="middle">SC</text>
        </svg>
    );
}
