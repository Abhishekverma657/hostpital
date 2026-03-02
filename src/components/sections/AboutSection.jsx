import React from 'react';
import { hospitalInfo } from '../../data/hospitalData';

const floatCards = [
    { icon: '⭐', value: `${hospitalInfo.rating}/5`, label: 'Patient Rating', pos: 'top-8 -right-8', delay: '0s' },
    { icon: '👨‍⚕️', value: `${hospitalInfo.totalDoctors}+`, label: 'Specialists', pos: 'bottom-20 -right-10', delay: '0.5s' },
    { icon: '🏆', value: '25+ Yrs', label: 'Of Excellence', pos: '-bottom-6 left-10', delay: '1s' },
];

const highlights = [
    'Multi-specialty tertiary care hospital',
    'NABH & JCI dual accreditation',
    '24×7 emergency & trauma care',
    'Cashless insurance for 200+ companies',
    'International patient care desk',
];

export default function AboutSection() {
    return (
        <section id="about" className="py-24" style={{ background: 'var(--color-background)' }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* ── Visual ── */}
                    <div className="relative">
                        {/* Main visual card */}
                        <div className="rounded-3xl overflow-hidden h-[480px] relative"
                            style={{ background: 'var(--color-gradient-hero)' }}>
                            {/* Radial glow */}
                            <div className="absolute inset-0"
                                style={{
                                    background: 'radial-gradient(circle at 30% 50%, rgba(14,165,233,0.3) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(16,185,129,0.2) 0%, transparent 50%)',
                                }} />
                            {/* Grid */}
                            <div className="absolute inset-0 opacity-30"
                                style={{
                                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                                    backgroundSize: '40px 40px',
                                }} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                                <span className="text-[8rem] drop-shadow-2xl">🏥</span>
                                <span className="text-xl font-bold text-white/90 tracking-wide">MediCare Hospital</span>
                                <div className="flex gap-2 mt-2">
                                    <span className="badge badge-success">NABH</span>
                                    <span className="badge badge-primary">JCI</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating stat cards */}
                        {floatCards.map(c => (
                            <div key={c.label}
                                className={`absolute ${c.pos} bg-surface border border-hborder rounded-2xl
                               px-4 py-3 flex items-center gap-3 shadow-float animate-float`}
                                style={{ animationDelay: c.delay }}>
                                <span className="text-2xl">{c.icon}</span>
                                <div>
                                    <div className="text-lg font-black text-htext leading-none">{c.value}</div>
                                    <div className="text-[11px] text-muted font-medium mt-0.5">{c.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Text ── */}
                    <div>
                        <span className="badge badge-primary mb-4">About Us</span>

                        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black text-htext leading-tight mb-4">
                            Pioneering Healthcare<br />
                            <span style={{ color: 'var(--color-primary)' }}>Since {hospitalInfo.established}</span>
                        </h2>

                        <div className="w-14 h-1 rounded-full mb-6" style={{ background: 'var(--color-gradient)' }} />

                        <p className="text-base text-muted leading-relaxed mb-7">{hospitalInfo.about}</p>

                        {/* Highlights */}
                        <ul className="space-y-3 mb-9">
                            {highlights.map(h => (
                                <li key={h} className="flex items-center gap-3 text-sm font-medium text-htext">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center
                                   justify-center text-xs flex-shrink-0 font-bold">✓</span>
                                    {h}
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-4 flex-wrap">
                            <button onClick={() => document.querySelector('#doctors')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-primary">
                                Meet Our Doctors
                            </button>
                            <button onClick={() => document.querySelector('#facilities')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-outline">
                                Our Facilities
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
