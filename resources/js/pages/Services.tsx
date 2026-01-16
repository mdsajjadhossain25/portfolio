/**
 * Services Page (Dynamic)
 * 
 * Services and pricing section with:
 * - Dynamic service cards from database
 * - Futuristic HUD panels
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
import { 
    Brain, 
    Code, 
    Search, 
    Briefcase, 
    Users,
    Zap,
    ArrowRight,
    Check,
    Clock,
    DollarSign,
    Star,
} from 'lucide-react';

interface ServiceFeature {
    id: number;
    feature_text: string;
    display_order: number;
}

interface Service {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    detailed_description: string | null;
    service_type: string;
    service_type_label: string;
    pricing_model: string;
    pricing_model_label: string;
    price_label: string | null;
    duration: string | null;
    icon: string | null;
    is_featured: boolean;
    is_active: boolean;
    display_order: number;
    features: ServiceFeature[];
}

interface Props {
    featuredServices: Service[];
    regularServices: Service[];
    servicesByType: Record<string, Service[]>;
    allServices: Service[];
}

// Icon mapping for service types
const serviceTypeIcons: Record<string, React.ReactNode> = {
    consulting: <Brain className="w-8 h-8" />,
    development: <Code className="w-8 h-8" />,
    research: <Search className="w-8 h-8" />,
    freelance: <Briefcase className="w-8 h-8" />,
    hiring: <Users className="w-8 h-8" />,
};

// Color mapping for service types (for HUDPanel)
const serviceTypeColors: Record<string, 'cyan' | 'purple' | 'crimson'> = {
    consulting: 'cyan',
    development: 'purple',
    research: 'crimson',
    freelance: 'cyan',
    hiring: 'purple',
};

// Dynamic icon component
function ServiceIcon({ icon, serviceType }: { icon: string | null; serviceType: string }) {
    if (icon) {
        // Check for common icon names and return corresponding Lucide icons
        const iconMap: Record<string, React.ReactNode> = {
            brain: <Brain className="w-8 h-8" />,
            code: <Code className="w-8 h-8" />,
            search: <Search className="w-8 h-8" />,
            briefcase: <Briefcase className="w-8 h-8" />,
            users: <Users className="w-8 h-8" />,
            zap: <Zap className="w-8 h-8" />,
        };
        return iconMap[icon.toLowerCase()] || serviceTypeIcons[serviceType] || <Zap className="w-8 h-8" />;
    }
    return serviceTypeIcons[serviceType] || <Zap className="w-8 h-8" />;
}

export default function Services({ featuredServices, regularServices, allServices }: Props) {
    const [hoveredService, setHoveredService] = useState<number | null>(null);
    
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
                        <span className="text-cyan-600 dark:text-cyan-400 font-mono text-sm uppercase tracking-wider">
                            // AI Solutions
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
                            AI Services &{' '}
                            <GlitchText as="span" className="text-purple-600 dark:text-purple-400">
                                Consulting
                            </GlitchText>
                        </h1>
                        <p className="text-gray-600 dark:text-white/50 text-lg max-w-2xl mx-auto">
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
                    
                    {/* Featured Services */}
                    {featuredServices.length > 0 && (
                        <div className="mb-16">
                            <motion.div
                                className="text-center mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-yellow-400 text-sm font-medium">Featured Services</span>
                                </div>
                            </motion.div>
                            
                            <div className={`grid gap-6 ${
                                featuredServices.length === 1 
                                    ? 'max-w-2xl mx-auto' 
                                    : featuredServices.length === 2 
                                        ? 'lg:grid-cols-2' 
                                        : 'lg:grid-cols-3'
                            }`}>
                                {featuredServices.map((service, index) => (
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
                                            accentColor={serviceTypeColors[service.service_type] ?? 'cyan'}
                                            className="h-full"
                                        >
                                            <div className="text-cyan-400 mb-4">
                                                <ServiceIcon icon={service.icon} serviceType={service.service_type} />
                                            </div>
                                            
                                            {/* Pricing Badge */}
                                            {service.price_label && (
                                                <div className="inline-flex items-center gap-1 px-3 py-1 mb-4 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                                                    <DollarSign className="w-3 h-3 text-cyan-400" />
                                                    <span className="text-cyan-400 text-sm font-medium">
                                                        {service.price_label}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <p className="text-gray-600 dark:text-white/60 text-sm mb-6 leading-relaxed">
                                                {service.short_description}
                                            </p>
                                            
                                            {service.duration && (
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-white/50 text-xs mb-4">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{service.duration}</span>
                                                </div>
                                            )}
                                            
                                            <ul className="space-y-2 mb-6">
                                                {service.features.slice(0, 5).map((feature, i) => (
                                                    <motion.li
                                                        key={feature.id}
                                                        className="flex items-center gap-2 text-gray-700 dark:text-white/70 text-sm"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.3 + i * 0.05 }}
                                                    >
                                                        <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                                                        {feature.feature_text}
                                                    </motion.li>
                                                ))}
                                                {service.features.length > 5 && (
                                                    <li className="text-gray-500 dark:text-white/50 text-xs pl-6">
                                                        +{service.features.length - 5} more features
                                                    </li>
                                                )}
                                            </ul>
                                            
                                            <Link href="/contact" className="block">
                                                <GlowButton 
                                                    variant="cyan" 
                                                    size="sm" 
                                                    className="w-full"
                                                >
                                                    Get Started
                                                    <ArrowRight className="w-4 h-4" />
                                                </GlowButton>
                                            </Link>
                                        </HUDPanel>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Regular Services */}
                    {regularServices.length > 0 && (
                        <div className="mb-20">
                            <motion.div
                                className="text-center mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    All <GlitchText as="span" className="text-cyan-600 dark:text-cyan-400">Services</GlitchText>
                                </h2>
                            </motion.div>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regularServices.map((service, index) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05, duration: 0.5 }}
                                        onMouseEnter={() => setHoveredService(service.id)}
                                        onMouseLeave={() => setHoveredService(null)}
                                    >
                                        <GlassCard
                                            variant={serviceTypeColors[service.service_type] || 'default'}
                                            size="md"
                                            hover="glow"
                                            className="h-full"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-xl bg-${serviceTypeColors[service.service_type] || 'cyan'}-500/10`}>
                                                    <ServiceIcon icon={service.icon} serviceType={service.service_type} />
                                                </div>
                                                {service.price_label && (
                                                    <span className="text-sm font-medium text-gray-700 dark:text-white/80">
                                                        {service.price_label}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">
                                                {service.title}
                                            </h3>
                                            
                                            <span className="inline-block px-2 py-0.5 mb-3 text-xs rounded-full bg-gray-100/80 dark:bg-white/10 text-gray-600 dark:text-white/60">
                                                {service.service_type_label}
                                            </span>
                                            
                                            <p className="text-gray-600 dark:text-white/50 text-sm mb-4 line-clamp-2">
                                                {service.short_description}
                                            </p>
                                            
                                            {service.features.length > 0 && (
                                                <ul className="space-y-1 mb-4">
                                                    {service.features.slice(0, 3).map((feature) => (
                                                        <li 
                                                            key={feature.id}
                                                            className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-xs"
                                                        >
                                                            <span className="w-1 h-1 rounded-full bg-cyan-600 dark:bg-cyan-400" />
                                                            <span className="line-clamp-1">{feature.feature_text}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            
                                            <Link 
                                                href="/contact" 
                                                className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-sm hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
                                            >
                                                Learn More
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            
            {/* Process Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-cyan-600 dark:text-cyan-400 font-mono text-sm uppercase tracking-wider">
                            // ML Pipeline
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-4">
                            My <GlitchText as="span" className="text-purple-600 dark:text-purple-400">Process</GlitchText>
                        </h2>
                    </motion.div>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { number: '01', title: 'Problem Definition', description: 'Understanding the business problem and defining ML success metrics.' },
                            { number: '02', title: 'Data Analysis', description: 'Evaluating data quality, quantity, and preprocessing requirements.' },
                            { number: '03', title: 'Model Selection', description: 'Choosing architecture based on constraints: accuracy, speed, deployment.' },
                            { number: '04', title: 'Training & Tuning', description: 'Iterative training with hyperparameter optimization and validation.' },
                            { number: '05', title: 'Evaluation', description: 'Rigorous testing with held-out data. Confusion matrices, PR curves.' },
                            { number: '06', title: 'Deployment', description: 'Production deployment with monitoring, logging, and maintenance plan.' },
                        ].map((step, index) => (
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
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">{step.title}</h3>
                                    <p className="text-gray-600 dark:text-white/50 text-sm">{step.description}</p>
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
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Ready to build an AI solution?
                            </h2>
                            <p className="text-gray-600 dark:text-white/60 mb-8 max-w-xl mx-auto">
                                Let's discuss your ML requirements and find the optimal approach 
                                for your specific use case.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/contact">
                                    <GlowButton variant="cyan" size="lg" animatedBorder>
                                        Get AI Consultation
                                        <ArrowRight className="w-5 h-5" />
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
            
            {/* Empty State */}
            {allServices.length === 0 && (
                <section className="relative py-20">
                    <div className="max-w-2xl mx-auto px-4 text-center">
                        <GlassCard variant="default" size="lg">
                            <Briefcase className="w-16 h-16 text-cyan-500/50 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Services Coming Soon
                            </h2>
                            <p className="text-gray-600 dark:text-white/50 mb-6">
                                I'm currently setting up my services. Check back soon or reach out directly!
                            </p>
                            <Link href="/contact">
                                <GlowButton variant="cyan">
                                    Contact Me
                                </GlowButton>
                            </Link>
                        </GlassCard>
                    </div>
                </section>
            )}
        </PortfolioLayout>
    );
}
