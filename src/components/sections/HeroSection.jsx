import React, { useEffect, useRef } from 'react';
import { hospitalInfo } from '../../data/hospitalData';

const STATS = [
    { value: hospitalInfo.totalPatients, label: 'Patients Treated' },
    { value: `${hospitalInfo.totalDoctors}+`, label: 'Expert Doctors' },
    { value: hospitalInfo.totalBeds, label: 'Hospital Beds' },
    { value: hospitalInfo.successRate, label: 'Success Rate' },
];

export default function HeroSection() {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-20"
            style={{ background: 'var(--color-gradient-hero)' }}
        >
            {/* Decorative blobs */}
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 animate-float-slow blur-3xl"
                style={{ background: 'var(--color-primary)' }} />
            <div className="absolute -bottom-28 -left-28 w-96 h-96 rounded-full opacity-30 animate-float blur-3xl"
                style={{ background: 'var(--color-secondary)', animationDirection: 'reverse' }} />
            <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full opacity-10 animate-float-slow blur-3xl"
                style={{ background: 'var(--color-accent)' }} />

            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">

                    {/* ── Left: Text ── */}
                    <div>
                        {/* Accreditation badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10
                            backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold
                            uppercase tracking-wider mb-7 animate-fade-up">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            {hospitalInfo.accreditation}
                        </div>

                        <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] font-black text-white leading-[1.1]
                           tracking-tight mb-6 animate-fade-up animate-delay-1">
                            Your Health Is Our{' '}
                            <span className="bg-clip-text text-transparent"
                                style={{ backgroundImage: 'linear-gradient(135deg,#38bdf8,#34d399,#a3e635)' }}>
                                Greatest Priority
                            </span>
                        </h1>

                        <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-xl animate-fade-up animate-delay-2">
                            {hospitalInfo.tagline}. Trusted by{' '}
                            <span className="text-white font-semibold">1.5 lakh+ patients</span> — now offering
                            online appointment booking with top specialists.
                        </p>

                        <div className="flex gap-4 flex-wrap mb-10 animate-fade-up animate-delay-3">
                            <button onClick={() => document.querySelector('#doctors')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-primary text-base px-8 py-3.5">
                                <span>📅</span> Book Appointment
                            </button>
                            <button onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-ghost text-base px-8 py-3.5">
                                <span>▶</span> Learn More
                            </button>
                        </div>

                        {/* Trust bar */}
                        <div className="flex items-center gap-6 flex-wrap animate-fade-up animate-delay-4">
                            {[
                                { icon: '⭐', text: `${hospitalInfo.rating} Rating` },
                                { icon: '🏆', text: `Est. ${hospitalInfo.established}` },
                                { icon: '🔒', text: 'Safe & Secure' },
                            ].map((item, i) => (
                                <React.Fragment key={item.text}>
                                    {i > 0 && <div className="w-px h-5 bg-white/20" />}
                                    <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                                        <span className="text-base">{item.icon}</span>
                                        {item.text}
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Stats card ── */}
                    <div className="glass p-8 animate-float">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
                                Live Statistics
                            </span>
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live
                            </span>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {STATS.map(s => (
                                <div key={s.label}>
                                    <div className="text-3xl font-black text-white leading-none mb-1">{s.value}</div>
                                    <div className="text-xs text-white/55 font-medium">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Department chips */}
                        <div className="border-t border-white/10 pt-5 flex flex-wrap gap-2">
                            {hospitalInfo.departments.slice(0, 6).map(d => (
                                <span key={d}
                                    className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-medium text-white/75
                                 hover:bg-white/20 transition-colors cursor-default">
                                    {d}
                                </span>
                            ))}
                            <span className="px-3 py-1 rounded-full bg-primary/30 text-[11px] font-medium text-sky-200">
                                +{hospitalInfo.departments.length - 6} more
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SVG Wave */}
            <div className="absolute bottom-0 inset-x-0 pointer-events-none">
                <svg viewBox="0 0 1440 90" fill="none" className="w-full block">
                    <path
                        d="M0 60L60 55C120 50 240 42 360 46C480 50 600 66 720 70C840 74 960 66 1080 58C1200 50 1320 42 1380 38L1440 34V90H0V60Z"
                        fill="var(--color-background, #f8fafc)"
                    />
                </svg>
            </div>
        </section>
    );
}
