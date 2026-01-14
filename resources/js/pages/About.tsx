/**
 * About Page
 * 
 * Anime-style storytelling layout with:
 * - Scroll-based animations
 * - HUD skill meters
 * - Timeline/journey section
 * - Personal info panels
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Head } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { GlitchText } from '@/components/ui/glitch-text';
import { GlassCard } from '@/components/ui/glass-card';
import { HUDPanel } from '@/components/ui/hud-panel';
import { SkillMeter } from '@/components/ui/skill-meter';
import { staggerContainer, staggerItem } from '@/animations/transitions';

// Skills data
const technicalSkills = [
    { label: 'Computer Vision (OpenCV, PIL)', percentage: 92, color: 'cyan' as const },
    { label: 'Deep Learning (PyTorch, TensorFlow)', percentage: 90, color: 'cyan' as const },
    { label: 'CNNs / LSTMs / Transformers', percentage: 88, color: 'purple' as const },
    { label: 'Object Detection (YOLO, Faster R-CNN)', percentage: 85, color: 'purple' as const },
    { label: 'LLM & RAG Systems (LangChain)', percentage: 82, color: 'green' as const },
    { label: 'Python / NumPy / Pandas', percentage: 95, color: 'cyan' as const },
];

const softSkills = [
    { label: 'Research & Analysis', percentage: 92, color: 'crimson' as const },
    { label: 'Technical Communication', percentage: 88, color: 'crimson' as const },
    { label: 'Problem Decomposition', percentage: 90, color: 'green' as const },
    { label: 'Experiment Design', percentage: 85, color: 'purple' as const },
];

// Journey/Timeline data
const journey = [
    {
        year: '2024',
        title: 'Junior AI Engineer',
        company: 'Deep Mind Labs Ltd.',
        description: 'Building production CV systems, HAR models, and LLM-powered applications.',
    },
    {
        year: '2023',
        title: 'AI Research Intern',
        company: 'Research Lab',
        description: 'Developed CNN+LSTM models for human activity recognition. Published research.',
    },
    {
        year: '2022',
        title: 'ML Project Lead',
        company: 'University of Rajshahi',
        description: 'Led computer vision research projects. Ranked 6th in department (CGPA: 3.69/4.0).',
    },
    {
        year: '2021',
        title: 'Deep Learning Student',
        company: 'Self-Study & Coursework',
        description: 'Mastered PyTorch, TensorFlow. Built object detection and segmentation pipelines.',
    },
];

// Personal info
const personalInfo = [
    { label: 'Company', value: 'Deep Mind Labs', icon: '🏢' },
    { label: 'Education', value: 'Univ. of Rajshahi', icon: '🎓' },
    { label: 'Focus', value: 'Computer Vision', icon: '👁️' },
    { label: 'Status', value: 'Open to Research', icon: '✅' },
];

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const isHeroInView = useInView(heroRef, { once: true });
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });
    
    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
    
    return (
        <PortfolioLayout transitionType="cyberSlash">
            <Head title="About" />
            
            <div ref={containerRef}>
                {/* Hero Section */}
                <section ref={heroRef} className="relative min-h-[70vh] flex items-center py-20">
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ y: backgroundY }}
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    </motion.div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left: Image/Avatar */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -50 }}
                                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="relative aspect-square max-w-md mx-auto">
                                    {/* Rotating border */}
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl"
                                        style={{
                                            background: 'linear-gradient(45deg, #00ffff, #a78bfa, #dc267f, #00ffff)',
                                            backgroundSize: '300% 300%',
                                        }}
                                        animate={{
                                            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                    />
                                    
                                    {/* Inner container */}
                                    <div className="absolute inset-[3px] rounded-2xl bg-black overflow-hidden">
                                        {/* Placeholder for avatar */}
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                                            <motion.div
                                                className="text-8xl"
                                                animate={{ 
                                                    scale: [1, 1.1, 1],
                                                    rotate: [0, 5, -5, 0],
                                                }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                            >
                                                👨‍💻
                                            </motion.div>
                                        </div>
                                        
                                        {/* Scan line */}
                                        <motion.div
                                            className="absolute inset-x-0 h-[2px] bg-cyan-500/50"
                                            animate={{ top: ['0%', '100%'] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        />
                                    </div>
                                    
                                    {/* Corner decorations */}
                                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-500" />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-500" />
                                    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-500" />
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-500" />
                                </div>
                            </motion.div>
                            
                            {/* Right: Content */}
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate={isHeroInView ? "animate" : "initial"}
                            >
                                <motion.div variants={staggerItem} className="mb-6">
                                    <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
                                        // Profile & Research Path
                                    </span>
                                </motion.div>
                                
                                <motion.h1
                                    variants={staggerItem}
                                    className="text-4xl sm:text-5xl font-bold text-white mb-6"
                                >
                                    AI{' '}
                                    <GlitchText as="span" className="text-cyan-400">
                                        Engineer
                                    </GlitchText>
                                    <br />& Vision Systems Builder
                                </motion.h1>
                                
                                <motion.p
                                    variants={staggerItem}
                                    className="text-white/60 text-lg leading-relaxed mb-8"
                                >
                                    Junior AI Engineer at Deep Mind Labs Ltd. specializing in Computer Vision 
                                    and Deep Learning. Building intelligent systems that see, understand, 
                                    and act on visual data.
                                </motion.p>
                                
                                <motion.p
                                    variants={staggerItem}
                                    className="text-white/50 leading-relaxed mb-8"
                                >
                                    Strong academic foundation from University of Rajshahi (CGPA: 3.69/4.0, 
                                    Rank: 6th). Expertise in CNNs, LSTMs, Transformers, YOLO-based detection, 
                                    U-Net segmentation, and LLM-powered RAG systems.
                                </motion.p>
                                
                                {/* Quick info badges */}
                                <motion.div
                                    variants={staggerItem}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    {personalInfo.map((info) => (
                                        <div
                                            key={info.label}
                                            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                                        >
                                            <span className="text-xl">{info.icon}</span>
                                            <div>
                                                <div className="text-white/40 text-xs font-mono uppercase">{info.label}</div>
                                                <div className="text-white text-sm font-medium">{info.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                
                {/* Skills Section */}
                <section className="relative py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
                                // Technical Proficiency
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
                                AI/ML <GlitchText as="span" className="text-purple-400">Stack</GlitchText>
                            </h2>
                        </motion.div>
                        
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Technical Skills */}
                            <HUDPanel
                                title="Core AI Skills"
                                status="online"
                                accentColor="cyan"
                                dataReadout="ML_STACK"
                            >
                                <div className="space-y-6">
                                    {technicalSkills.map((skill, index) => (
                                        <motion.div
                                            key={skill.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <SkillMeter
                                                label={skill.label}
                                                percentage={skill.percentage}
                                                color={skill.color}
                                                showLevel
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </HUDPanel>
                            
                            {/* Soft Skills */}
                            <HUDPanel
                                title="Research Skills"
                                status="online"
                                accentColor="purple"
                                dataReadout="RESEARCH_SKILLS"
                            >
                                <div className="space-y-6">
                                    {softSkills.map((skill, index) => (
                                        <motion.div
                                            key={skill.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <SkillMeter
                                                label={skill.label}
                                                percentage={skill.percentage}
                                                color={skill.color}
                                                showLevel
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </HUDPanel>
                        </div>
                    </div>
                </section>
                
                {/* Journey/Timeline Section */}
                <section className="relative py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
                                // Research Path
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
                                My <GlitchText as="span" className="text-crimson-400 text-pink-400">Journey</GlitchText>
                            </h2>
                        </motion.div>
                        
                        {/* Timeline */}
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-30" />
                            
                            <div className="space-y-8">
                                {journey.map((item, index) => (
                                    <motion.div
                                        key={item.year}
                                        className="relative pl-20"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {/* Year marker */}
                                        <div className="absolute left-0 w-16 h-16 flex items-center justify-center">
                                            <motion.div
                                                className="w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [1, 0.7, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: index * 0.3,
                                                }}
                                            />
                                        </div>
                                        
                                        <GlassCard variant="default" size="md" hover="lift">
                                            <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                                                <div>
                                                    <span className="text-cyan-400 font-mono text-sm">{item.year}</span>
                                                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                                                </div>
                                                <span className="text-purple-400 text-sm font-mono">
                                                    {item.company}
                                                </span>
                                            </div>
                                            <p className="text-white/50 text-sm">{item.description}</p>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Values Section */}
                <section className="relative py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
                                // Core Values
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
                                What Drives Me
                            </h2>
                        </motion.div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Research Rigor',
                                    description: 'Approaching every problem with scientific methodology. Reproducible experiments, clear metrics.',
                                    icon: '🔬',
                                },
                                {
                                    title: 'Continuous Learning',
                                    description: 'Staying current with state-of-the-art models, papers, and techniques in CV and NLP.',
                                    icon: '📚',
                                },
                                {
                                    title: 'Production Mindset',
                                    description: 'Building AI systems that work in the real world, not just in notebooks.',
                                    icon: '🚀',
                                },
                                {
                                    title: 'Performance Focus',
                                    description: 'Optimizing inference speed, model size, and accuracy trade-offs for deployment.',
                                    icon: '⚡',
                                },
                                {
                                    title: 'Explainability',
                                    description: 'Making AI decisions interpretable. Grad-CAM, attention visualization, feature analysis.',
                                    icon: '💡',
                                },
                                {
                                    title: 'Ethical AI',
                                    description: 'Building responsible systems with bias awareness and fairness considerations.',
                                    icon: '⚖️',
                                },
                            ].map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <GlassCard variant="default" size="md" hover="scale">
                                        <span className="text-3xl mb-4 block">{value.icon}</span>
                                        <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
                                        <p className="text-white/50 text-sm">{value.description}</p>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PortfolioLayout>
    );
}
