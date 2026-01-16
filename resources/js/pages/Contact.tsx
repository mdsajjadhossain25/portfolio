/**
 * Contact Page
 * 
 * Animated contact form with:
 * - Interactive hover states
 * - Form validation
 * - Success/error animations
 * - Contact information
 * - Honeypot spam protection
 */

import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { GlitchText } from '@/components/ui/glitch-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { HUDPanel } from '@/components/ui/hud-panel';

// Contact methods
const contactMethods = [
    {
        label: 'Email',
        value: 'sajjad@deepmindlabs.ai',
        icon: '📧',
        href: 'mailto:sajjad@deepmindlabs.ai',
        description: 'For project inquiries & collaboration',
    },
    {
        label: 'LinkedIn',
        value: '@sajjad-ai',
        icon: '💼',
        href: 'https://linkedin.com',
        description: 'Professional network & research',
    },
    {
        label: 'GitHub',
        value: '@sajjad-ml',
        icon: '💻',
        href: 'https://github.com',
        description: 'Open source AI projects',
    },
    {
        label: 'Google Scholar',
        value: 'Sajjad AI',
        icon: '📚',
        href: 'https://scholar.google.com',
        description: 'Research publications',
    },
];

// Form field component
function FormField({ 
    label, 
    name, 
    type = 'text', 
    placeholder, 
    required = false,
    value,
    onChange,
    error,
    textarea = false,
}: {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    textarea?: boolean;
}) {
    const [isFocused, setIsFocused] = useState(false);
    
    const inputClasses = `
        w-full px-4 py-3 bg-white/5 border rounded-lg
        text-white placeholder-white/30 text-sm
        transition-all duration-300
        ${error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
            : 'border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/30'
        }
        focus:outline-none focus:ring-1
    `;
    
    return (
        <div className="relative">
            <label className="block text-white/70 text-sm font-medium mb-2">
                {label}
                {required && <span className="text-cyan-400 ml-1">*</span>}
            </label>
            
            <div className="relative">
                {textarea ? (
                    <textarea
                        name={name}
                        placeholder={placeholder}
                        required={required}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        rows={5}
                        className={inputClasses}
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        required={required}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={inputClasses}
                    />
                )}
                
                {/* Focus indicator */}
                <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: isFocused ? '100%' : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </div>
            
            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-xs mt-1"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Contact() {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '', // Honeypot field
    });
    
    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setSubmitStatus('success');
            reset();
            // Reset status after 5 seconds
            const timer = setTimeout(() => setSubmitStatus('idle'), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);
    
    const handleChange = (field: keyof typeof data) => (value: string) => {
        setData(field, value);
        // Clear error when user starts typing
        if (errors[field]) {
            clearErrors(field);
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        post('/contact', {
            preserveScroll: true,
            onError: () => {
                setSubmitStatus('error');
            },
        });
    };
    
    return (
        <PortfolioLayout transitionType="energyWave">
            <Head title="Contact" />
            
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
                            // Collaboration Terminal
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                            Let's{' '}
                            <GlitchText as="span" className="text-cyan-400">
                                Collaborate
                            </GlitchText>
                        </h1>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            Looking for AI consulting, research collaboration, or engineering roles? 
                            Let's discuss how I can contribute to your AI initiatives.
                        </p>
                    </motion.div>
                    
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Contact Form */}
                        <motion.div
                            className="lg:col-span-3"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <HUDPanel
                                title="Start Conversation"
                                status={processing ? 'processing' : 'online'}
                                accentColor="cyan"
                                dataReadout="COMMS_ACTIVE"
                            >
                                <AnimatePresence mode="wait">
                                    {submitStatus === 'success' ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="py-12 text-center"
                                        >
                                            <motion.div
                                                className="text-6xl mb-4"
                                                animate={{ 
                                                    scale: [1, 1.2, 1],
                                                    rotate: [0, 10, -10, 0],
                                                }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                ✅
                                            </motion.div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                            <p className="text-white/60">
                                                Thank you for reaching out. I'll review and respond within 24-48 hours.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            {/* Honeypot field - hidden from users */}
                                            <div className="hidden" aria-hidden="true">
                                                <input
                                                    type="text"
                                                    name="website"
                                                    value={data.website}
                                                    onChange={(e) => setData('website', e.target.value)}
                                                    tabIndex={-1}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <FormField
                                                    label="Name"
                                                    name="name"
                                                    placeholder="Your name"
                                                    required
                                                    value={data.name}
                                                    onChange={handleChange('name')}
                                                    error={errors.name}
                                                />
                                                <FormField
                                                    label="Email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    required
                                                    value={data.email}
                                                    onChange={handleChange('email')}
                                                    error={errors.email}
                                                />
                                            </div>
                                            
                                            <FormField
                                                label="Subject"
                                                name="subject"
                                                placeholder="e.g., CV model for industrial inspection"
                                                required
                                                value={data.subject}
                                                onChange={handleChange('subject')}
                                                error={errors.subject}
                                            />
                                            
                                            <FormField
                                                label="Message"
                                                name="message"
                                                placeholder="Describe your AI project, research collaboration idea, or role opportunity..."
                                                required
                                                value={data.message}
                                                onChange={handleChange('message')}
                                                error={errors.message}
                                                textarea
                                            />
                                            
                                            <div className="flex items-center justify-between pt-4">
                                                <p className="text-white/40 text-xs font-mono">
                                                    * Required fields
                                                </p>
                                                <GlowButton
                                                    type="submit"
                                                    variant="cyan"
                                                    size="lg"
                                                    disabled={processing}
                                                    animatedBorder
                                                >
                                                    {processing ? (
                                                        <>
                                                            <motion.span
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                                className="inline-block"
                                                            >
                                                                ⚡
                                                            </motion.span>
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Send Message
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </GlowButton>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </HUDPanel>
                        </motion.div>
                        
                        {/* Contact Info */}
                        <motion.div
                            className="lg:col-span-2 space-y-6"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {/* Availability card */}
                            <GlassCard variant="cyan" size="md" animatedBorder>
                                <div className="flex items-center gap-3 mb-4">
                                    <motion.div
                                        className="w-3 h-3 rounded-full bg-green-500"
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <span className="text-green-400 font-mono text-sm uppercase">
                                        Open for Collaboration
                                    </span>
                                </div>
                                <p className="text-white/60 text-sm">
                                    Available for AI consulting, research collaboration, and 
                                    full-time engineering opportunities. Response: 24-48h.
                                </p>
                            </GlassCard>
                            
                            {/* Contact methods */}
                            <div className="space-y-3">
                                {contactMethods.map((method, index) => (
                                    <motion.a
                                        key={method.label}
                                        href={method.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                                    >
                                        <GlassCard
                                            variant="default"
                                            size="sm"
                                            hover="scale"
                                            hudCorners={false}
                                            className="group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl group-hover:scale-110 transition-transform">
                                                    {method.icon}
                                                </span>
                                                <div className="flex-1">
                                                    <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                                                        {method.label}
                                                    </div>
                                                    <div className="text-white/40 text-sm">{method.description}</div>
                                                </div>
                                                <svg 
                                                    className="w-5 h-5 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </GlassCard>
                                    </motion.a>
                                ))}
                            </div>
                            
                            {/* Location info */}
                            <GlassCard variant="default" size="md" hudCorners={false}>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🎓</span>
                                    <div>
                                        <div className="text-white font-medium mb-1">Background</div>
                                        <div className="text-white/50 text-sm">
                                            University of Rajshahi • CGPA: 3.69/4.0
                                            <br />
                                            Deep Mind Labs Ltd. • AI Engineer
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>
            </section>
            
            {/* FAQ Section */}
            <section className="relative py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            Frequently Asked <GlitchText as="span" className="text-purple-400">Questions</GlitchText>
                        </h2>
                    </motion.div>
                    
                    <div className="space-y-4">
                        {[
                            {
                                q: 'What types of AI projects do you work on?',
                                a: 'I specialize in Computer Vision (object detection, segmentation, face recognition), Human Activity Recognition, and LLM-based applications (RAG systems, chatbots). Both research prototypes and production deployments.',
                            },
                            {
                                q: 'Can you integrate AI into existing systems?',
                                a: 'Yes. I have experience integrating ML models into web applications (Django, Laravel, React) via REST APIs. This includes model serving, API design, and frontend integration.',
                            },
                            {
                                q: 'What\'s your approach to new AI projects?',
                                a: 'I start with problem definition and data analysis. Then model selection based on constraints (accuracy, speed, deployment). Iterative training, rigorous evaluation, and production deployment with monitoring.',
                            },
                            {
                                q: 'Are you open to research collaborations?',
                                a: 'Absolutely. I\'m interested in research opportunities in Computer Vision and applied ML. Open to co-authoring papers, joint experiments, and academic partnerships.',
                            },
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard variant="default" size="md" hover="none" hudCorners={false}>
                                    <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                                    <p className="text-white/50 text-sm">{faq.a}</p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </PortfolioLayout>
    );
}
