import React from 'react';
import { hospitalInfo } from '../../data/hospitalData';

export default function FacilitiesSection() {
    return (
        <section id="facilities" className="py-24 bg-surfaceAlt">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="badge badge-primary mb-4">Infrastructure</span>
                    <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-black mb-4 gradient-text">
                        World-Class Facilities
                    </h2>
                    <div className="section-divider" />
                    <p className="text-base text-muted max-w-lg mx-auto mt-4">
                        State-of-the-art infrastructure designed to deliver the highest standard of care.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                    {hospitalInfo.facilities.map((f, i) => (
                        <div key={f.title}
                            className="group bg-surface border border-hborder rounded-2xl p-6 text-center
                            hover:-translate-y-2 hover:shadow-glow-lg transition-all duration-300">
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {f.icon}
                            </div>
                            <h3 className="font-bold text-htext mb-1">{f.title}</h3>
                            <p className="text-xs text-muted">{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Stats banner */}
                <div className="rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8"
                    style={{ background: 'var(--color-gradient-hero)' }}>
                    {[
                        { icon: '🏥', value: '500+', label: 'Hospital Beds' },
                        { icon: '🔬', value: '18', label: 'Operation Theatres' },
                        { icon: '🚑', value: '24/7', label: 'Emergency Care' },
                        { icon: '🩺', value: '120+', label: 'Expert Specialists' },
                    ].map(s => (
                        <div key={s.label} className="text-center text-white">
                            <div className="text-4xl mb-3">{s.icon}</div>
                            <div className="text-3xl font-black mb-1">{s.value}</div>
                            <div className="text-sm text-white/65 font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
