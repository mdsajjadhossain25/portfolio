/**
 * About Page
 * 
 * Dynamic portfolio about page with:
 * - Profile information from database
 * - Skills displayed as tags/pills (NO percentage bars)
 * - Experience timeline
 * - Futuristic modern styling
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Head } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { GlitchText } from '@/components/ui/glitch-text';
import { GlassCard } from '@/components/ui/glass-card';
import { HUDPanel } from '@/components/ui/hud-panel';
import { staggerContainer, staggerItem } from '@/animations/transitions';

// Types
interface Skill {
    id: number;
    name: string;
    icon: string | null;
    tag: string | null;
    description: string | null;
    isFeatured: boolean;
}

interface SkillCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: 'cyan' | 'purple' | 'green' | 'crimson';
    skills: Skill[];
}

interface Experience {
    id: number;
    title: string;
    company: string;
    location: string | null;
    type: string;
    year: string;
    dateRange: string;
    isCurrent: boolean;
    description: string | null;
    highlights: string[] | null;
}

interface Profile {
    fullName: string;
    title: string;
    subtitle: string | null;
    shortBio: string;
    longBio: string | null;
    profileImage: string | null;
    company: string | null;
    location: string | null;
    yearsOfExperience: number | null;
    university: string | null;
    cgpa: number | null;
    academicHighlight: string | null;
    resumeUrl: string | null;
    email: string | null;
    phone: string | null;
    socialLinks: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
    } | null;
    status: string;
}

interface Props {
    profile: Profile | null;
    skillCategories: SkillCategory[];
    experiences: Experience[];
}

// Color mappings for skill categories
const colorClasses = {
    cyan: {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        hover: 'hover:bg-cyan-500/20 hover:border-cyan-500/50',
        glow: 'shadow-cyan-500/20',
    },
    purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        hover: 'hover:bg-purple-500/20 hover:border-purple-500/50',
        glow: 'shadow-purple-500/20',
    },
    green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        hover: 'hover:bg-green-500/20 hover:border-green-500/50',
        glow: 'shadow-green-500/20',
    },
    crimson: {
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/30',
        text: 'text-pink-400',
        hover: 'hover:bg-pink-500/20 hover:border-pink-500/50',
        glow: 'shadow-pink-500/20',
    },
};

// Default fallback data when no profile exists
const defaultProfile: Profile = {
    fullName: 'Your Name',
    title: 'AI Engineer',
    subtitle: 'Building intelligent systems',
    shortBio: 'Welcome to my portfolio. Configure your profile in the admin dashboard.',
    longBio: null,
    profileImage: null,
    company: null,
    location: null,
    yearsOfExperience: null,
    university: null,
    cgpa: null,
    academicHighlight: null,
    resumeUrl: null,
    email: null,
    phone: null,
    socialLinks: null,
    status: 'Open to Opportunities',
};

// Skill Tag Component - Modern pill/tag display (NO percentages)
function SkillTag({ skill, color }: { skill: Skill; color: 'cyan' | 'purple' | 'green' | 'crimson' }) {
    const colors = colorClasses[color];
    
    return (
        <motion.div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 ${colors.bg} ${colors.border} ${colors.hover}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            {skill.icon && <span className="text-sm">{skill.icon}</span>}
            <span className={`text-sm font-medium ${colors.text}`}>{skill.name}</span>
            {skill.tag && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
                    {skill.tag}
                </span>
            )}
            {skill.isFeatured && (
                <span className="text-yellow-400 text-xs">⭐</span>
            )}
        </motion.div>
    );
}

// Skill Category Card Component
function SkillCategoryCard({ category }: { category: SkillCategory }) {
    const colors = colorClasses[category.color] || colorClasses.cyan;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <HUDPanel
                title={category.name}
                status="online"
                accentColor={category.color}
                dataReadout={category.slug.toUpperCase().replace(/-/g, '_')}
            >
                <div className="space-y-4">
                    {category.description && (
                        <p className="text-sm text-white/50">{category.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, index) => (
                            <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <SkillTag skill={skill} color={category.color} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </HUDPanel>
        </motion.div>
    );
}

export default function About({ profile: profileData, skillCategories, experiences }: Props) {
    const profile = profileData || defaultProfile;
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const isHeroInView = useInView(heroRef, { once: true });
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });
    
    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

    // Build personal info dynamically
    const personalInfo = [
        profile.company && { label: 'Company', value: profile.company, icon: '🏢' },
        profile.university && { label: 'Education', value: profile.university, icon: '🎓' },
        profile.location && { label: 'Location', value: profile.location, icon: '📍' },
        { label: 'Status', value: profile.status, icon: '✅' },
    ].filter(Boolean) as { label: string; value: string; icon: string }[];
    
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
                                        {profile.profileImage ? (
                                            <img
                                                src={profile.profileImage}
                                                alt={profile.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
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
                                        )}
                                        
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
                                    <GlitchText as="span" className="text-cyan-400">
                                        {profile.fullName.split(' ')[0]}
                                    </GlitchText>
                                    {profile.fullName.split(' ').slice(1).length > 0 && (
                                        <> {profile.fullName.split(' ').slice(1).join(' ')}</>
                                    )}
                                    <br />
                                    <span className="text-white/80 text-3xl">{profile.title}</span>
                                </motion.h1>
                                
                                {profile.subtitle && (
                                    <motion.p
                                        variants={staggerItem}
                                        className="text-purple-400 text-lg mb-4 italic"
                                    >
                                        "{profile.subtitle}"
                                    </motion.p>
                                )}
                                
                                <motion.p
                                    variants={staggerItem}
                                    className="text-white/60 text-lg leading-relaxed mb-8"
                                >
                                    {profile.shortBio}
                                </motion.p>
                                
                                {/* Academic info */}
                                {(profile.university || profile.cgpa || profile.academicHighlight) && (
                                    <motion.p
                                        variants={staggerItem}
                                        className="text-white/50 leading-relaxed mb-8"
                                    >
                                        {profile.university && (
                                            <>Academic foundation from {profile.university}</>
                                        )}
                                        {profile.cgpa && (
                                            <> (CGPA: {profile.cgpa}/4.0)</>
                                        )}
                                        {profile.academicHighlight && (
                                            <>. {profile.academicHighlight}</>
                                        )}
                                    </motion.p>
                                )}
                                
                                {/* Quick info badges */}
                                {personalInfo.length > 0 && (
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
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>
                
                {/* Skills Section - Using Tags/Pills (NO percentage bars) */}
                {skillCategories.length > 0 && (
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
                                    My <GlitchText as="span" className="text-purple-400">Skills</GlitchText>
                                </h2>
                            </motion.div>
                            
                            <div className="grid gap-6 lg:grid-cols-2">
                                {skillCategories.map((category) => (
                                    <SkillCategoryCard key={category.id} category={category} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
                
                {/* Journey/Timeline Section */}
                {experiences.length > 0 && (
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
                                    My <GlitchText as="span" className="text-pink-400">Journey</GlitchText>
                                </h2>
                            </motion.div>
                            
                            {/* Timeline */}
                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-30" />
                                
                                <div className="space-y-8">
                                    {experiences.map((item, index) => (
                                        <motion.div
                                            key={item.id}
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
                                                {item.description && (
                                                    <p className="text-white/50 text-sm">{item.description}</p>
                                                )}
                                                {item.isCurrent && (
                                                    <span className="mt-2 inline-block rounded-full bg-green-500/10 border border-green-500/30 px-2 py-0.5 text-xs text-green-400">
                                                        Current Position
                                                    </span>
                                                )}
                                            </GlassCard>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
                
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

                {/* Contact CTA Section */}
                {(profile.email || profile.resumeUrl) && (
                    <section className="relative py-20">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <GlassCard variant="gradient" size="lg">
                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        Let's Work Together
                                    </h3>
                                    <p className="text-white/60 mb-6">
                                        Interested in AI/ML consulting, research collaboration, or just want to chat?
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {profile.email && (
                                            <a
                                                href={`mailto:${profile.email}`}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
                                            >
                                                📧 Get in Touch
                                            </a>
                                        )}
                                        {profile.resumeUrl && (
                                            <a
                                                href={profile.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                📄 Download Resume
                                            </a>
                                        )}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </div>
                    </section>
                )}
            </div>
        </PortfolioLayout>
    );
}
