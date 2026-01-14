/**
 * Services Page
 * 
 * Services and pricing section with:
 * - Animated service cards
 * - Pricing tiers
 * - Strong CTA animations
 * - Availability indicator
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { GlitchText } from '@/components/ui/glitch-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { HUDPanel } from '@/components/ui/hud-panel';
import { staggerContainer, staggerItem } from '@/animations/transitions';

// Services data
const services = [
    {
        id: 'cv-solutions',
        title: 'Computer Vision Solutions',
        description: 'Custom CV systems for object detection, image segmentation, facial recognition, and visual inspection pipelines.',
        icon: '👁️',
        features: [
            'Object Detection (YOLO, Faster R-CNN)',
            'Image Segmentation (U-Net, Mask R-CNN)',
            'Face Recognition & Verification',
            'OCR & Document Processing',
            'Edge Deployment Optimization',
        ],
        color: 'cyan' as const,
    },
    {
        id: 'llm-systems',
        title: 'LLM & RAG Systems',
        description: 'AI-powered applications using large language models. RAG pipelines, chatbots, and intelligent document processing.',
        icon: '🧠',
        features: [
            'RAG Architecture Design',
            'LangChain Integration',
            'Custom Prompt Engineering',
            'Vector Database Setup',
            'API Integration & Deployment',
        ],
        color: 'purple' as const,
    },
    {
        id: 'ai-consulting',
        title: 'AI Consulting & Prototyping',
        description: 'Technical guidance on ML/AI strategy. Rapid prototyping to validate ideas before full development.',
        icon: '💡',
        features: [
            'Feasibility Analysis',
            'Model Architecture Review',
            'Dataset Strategy',
            'Proof-of-Concept Development',
            'Performance Benchmarking',
        ],
        color: 'crimson' as const,
    },
];

// Pricing tiers
const pricingTiers = [
    {
        id: 'prototype',
        name: 'Prototype',
        description: 'Quick proof-of-concept for AI ideas',
        price: '$1,500',
        period: 'starting at',
        features: [
            'Feasibility assessment',
            'Basic model prototype',
            'Dataset analysis',
            '1 week turnaround',
            'Technical report',
        ],
        highlighted: false,
        color: 'default' as const,
    },
    {
        id: 'production',
        name: 'Production Model',
        description: 'Deployment-ready AI solution',
        price: '$4,000',
        period: 'starting at',
        features: [
            'Custom model training',
            'Performance optimization',
            'API endpoint setup',
            'Edge deployment ready',
            '3 weeks delivery',
            'Documentation',
            '2 revision rounds',
        ],
        highlighted: true,
        color: 'cyan' as const,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Full AI pipeline development',
        price: 'Custom',
        period: 'contact for quote',
        features: [
            'End-to-end ML pipeline',
            'MLOps setup',
            'Scalable infrastructure',
            'Monitoring & alerts',
            'Ongoing support',
            'Model retraining strategy',
            'Full documentation',
            'Team knowledge transfer',
        ],
        highlighted: false,
        color: 'purple' as const,
    },
];

// Process steps
const processSteps = [
    {
        number: '01',
        title: 'Problem Definition',
        description: 'Understanding the business problem and defining ML success metrics.',
    },
    {
        number: '02',
        title: 'Data Analysis',
        description: 'Evaluating data quality, quantity, and preprocessing requirements.',
    },
    {
        number: '03',
        title: 'Model Selection',
        description: 'Choosing architecture based on constraints: accuracy, speed, deployment.',
    },
    {
        number: '04',
        title: 'Training & Tuning',
        description: 'Iterative training with hyperparameter optimization and validation.',
    },
    {
        number: '05',
        title: 'Evaluation',
        description: 'Rigorous testing with held-out data. Confusion matrices, PR curves.',
    },
    {
        number: '06',
        title: 'Deployment',
        description: 'Production deployment with monitoring, logging, and maintenance plan.',
    },
];

export default function Services() {
    const [hoveredService, setHoveredService] = useState<string | null>(null);
    
    return (
        <PortfolioLayout transitionType="hudPanel">
            <Head title="Services" />
            
            {/* Hero Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
                            // AI Solutions
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                            AI Services &{' '}
                            <GlitchText as="span" className="text-purple-400">
                                Consulting
                            </GlitchText>
                        </h1>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            From computer vision prototypes to production LLM systems. 
                            Technical AI solutions built for real-world deployment.
                        </p>
                        
                        {/* Availability status */}
                        <motion.div
                            className="inline-flex items-center gap-3 mt-8 px-6 py-3 rounded-full
                                       bg-green-500/10 border border-green-500/30"
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(34, 197, 94, 0.2)',
                                    '0 0 40px rgba(34, 197, 94, 0.3)',
                                    '0 0 20px rgba(34, 197, 94, 0.2)',
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <motion.span
                                className="w-3 h-3 rounded-full bg-green-500"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-green-400 font-medium">
                                Open for AI consulting & projects
                            </span>
                        </motion.div>
                    </motion.div>
                    
                    {/* Services */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-20">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                onMouseEnter={() => setHoveredService(service.id)}
                                onMouseLeave={() => setHoveredService(null)}
                            >
                                <HUDPanel
                                    title={service.title}
                                    status={hoveredService === service.id ? 'processing' : 'online'}
                                    accentColor={service.color}
                                    className="h-full"
                                >
                                    <div className="text-4xl mb-4">{service.icon}</div>
                                    <p className="text-white/60 text-sm mb-6 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {service.features.map((feature, i) => (
                                            <motion.li
                                                key={i}
                                                className="flex items-center gap-2 text-white/70 text-sm"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + i * 0.05 }}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                {feature}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </HUDPanel>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Pricing Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Background accent */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
                            // Investment
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
                            Pricing <GlitchText as="span" className="text-cyan-400">Plans</GlitchText>
                        </h2>
                    </motion.div>
                    
                    <div className="grid lg:grid-cols-3 gap-6">
                        {pricingTiers.map((tier, index) => (
                            <motion.div
                                key={tier.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={tier.highlighted ? 'lg:-mt-4 lg:mb-4' : ''}
                            >
                                <GlassCard
                                    variant={tier.color}
                                    size="lg"
                                    hover="glow"
                                    animatedBorder={tier.highlighted}
                                    className={`h-full ${tier.highlighted ? 'border-cyan-500/50' : ''}`}
                                >
                                    {/* Popular badge */}
                                    {tier.highlighted && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 
                                                        bg-cyan-500 text-black text-xs font-bold uppercase rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-6">
                                        <h3 className="text-white font-semibold text-xl mb-2">{tier.name}</h3>
                                        <p className="text-white/50 text-sm mb-4">{tier.description}</p>
                                        <div className="mb-2">
                                            <span className="text-4xl font-bold text-white">{tier.price}</span>
                                        </div>
                                        <span className="text-white/40 text-sm">{tier.period}</span>
                                    </div>
                                    
                                    <ul className="space-y-3 mb-8">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                                                <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <Link href="/contact" className="block">
                                        <GlowButton
                                            variant={tier.highlighted ? 'cyan' : 'ghost'}
                                            size="md"
                                            className="w-full"
                                        >
                                            Get Started
                                        </GlowButton>
                                    </Link>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Process Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
                                // ML Pipeline
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
                                My <GlitchText as="span" className="text-purple-400">Process</GlitchText>
                            </h2>
                        </motion.div>                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <GlassCard variant="default" size="md" hover="lift">
                                    <span className="text-5xl font-bold text-cyan-500/20 mb-4 block font-mono">
                                        {step.number}
                                    </span>
                                    <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                                    <p className="text-white/50 text-sm">{step.description}</p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="relative py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <GlassCard variant="gradient" size="lg" animatedBorder>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                Ready to build an AI solution?
                            </h2>
                            <p className="text-white/60 mb-8 max-w-xl mx-auto">
                                Let's discuss your ML requirements and find the optimal approach 
                                for your specific use case.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/contact">
                                    <GlowButton variant="cyan" size="lg" animatedBorder>
                                        Get AI Consultation
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </GlowButton>
                                </Link>
                                <Link href="/projects">
                                    <GlowButton variant="ghost" size="lg">
                                        View My Work
                                    </GlowButton>
                                </Link>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </section>
        </PortfolioLayout>
    );
}
