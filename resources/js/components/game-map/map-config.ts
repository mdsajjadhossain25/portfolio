/**
 * Map Configuration
 * 
 * Defines all navigation nodes for the futuristic game map.
 * Each node represents a page/zone in the portfolio world.
 */

export interface MapNode {
    id: string;
    label: string;
    sublabel: string;
    href: string;
    position: { x: number; y: number }; // Percentage based (0-100)
    color: string;
    glowColor: string;
    icon: string;
    description: string;
    status: 'active' | 'locked' | 'new';
    connections: string[]; // IDs of connected nodes
    size: 'sm' | 'md' | 'lg';
}

export const mapNodes: MapNode[] = [
    {
        id: 'home',
        label: 'COMMAND CENTER',
        sublabel: 'Neural Hub',
        href: '/',
        position: { x: 50, y: 45 },
        color: '#00f5ff',
        glowColor: 'rgba(0, 245, 255, 0.6)',
        icon: '◈',
        description: 'Central hub. AI Engineer building intelligent vision systems.',
        status: 'active',
        connections: ['about', 'projects', 'services', 'blog', 'contact'],
        size: 'lg',
    },
    {
        id: 'about',
        label: 'ABOUT',
        sublabel: 'Profile & Research',
        href: '/about',
        position: { x: 25, y: 28 },
        color: '#a78bfa',
        glowColor: 'rgba(167, 139, 250, 0.6)',
        icon: '◇',
        description: 'Academic foundation, research path, and ML/CV expertise.',
        status: 'active',
        connections: ['home', 'projects'],
        size: 'md',
    },
    {
        id: 'projects',
        label: 'PROJECTS',
        sublabel: 'AI Lab',
        href: '/projects',
        position: { x: 75, y: 24 },
        color: '#22d3ee',
        glowColor: 'rgba(34, 211, 238, 0.6)',
        icon: '⬡',
        description: 'Computer Vision, HAR, Object Detection, RAG systems.',
        status: 'active',
        connections: ['home', 'about', 'services'],
        size: 'md',
    },
    {
        id: 'services',
        label: 'SERVICES',
        sublabel: 'AI Solutions',
        href: '/services',
        position: { x: 78, y: 58 },
        color: '#f472b6',
        glowColor: 'rgba(244, 114, 182, 0.6)',
        icon: '⬢',
        description: 'CV solutions, model prototyping, LLM integration.',
        status: 'active',
        connections: ['home', 'projects', 'contact'],
        size: 'md',
    },
    {
        id: 'blog',
        label: 'BLOG',
        sublabel: 'Research Notes',
        href: '/blog',
        position: { x: 20, y: 62 },
        color: '#4ade80',
        glowColor: 'rgba(74, 222, 128, 0.6)',
        icon: '◆',
        description: 'Experiment logs, model comparisons, AI insights.',
        status: 'active',
        connections: ['home', 'contact'],
        size: 'md',
    },
    {
        id: 'contact',
        label: 'CONTACT',
        sublabel: 'Connect',
        href: '/contact',
        position: { x: 50, y: 78 },
        color: '#fb923c',
        glowColor: 'rgba(251, 146, 60, 0.6)',
        icon: '◎',
        description: 'Research opportunities, AI consulting, engineering roles.',
        status: 'active',
        connections: ['home', 'services', 'blog'],
        size: 'md',
    },
];

// Get node by ID
export function getNodeById(id: string): MapNode | undefined {
    return mapNodes.find(node => node.id === id);
}

// Get connected nodes
export function getConnectedNodes(id: string): MapNode[] {
    const node = getNodeById(id);
    if (!node) return [];
    return node.connections.map(connId => getNodeById(connId)).filter(Boolean) as MapNode[];
}

// Get node by href
export function getNodeByHref(href: string): MapNode | undefined {
    return mapNodes.find(node => node.href === href);
}
