import React from 'react';
import { hospitalInfo } from '../../data/hospitalData';

const DEPT_COLORS = [
    'from-sky-500 to-blue-600',
    'from-purple-500 to-violet-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-sky-600',
    'from-indigo-500 to-purple-600',
    'from-green-500 to-emerald-600',
    'from-red-500 to-pink-600',
    'from-yellow-500 to-amber-600',
    'from-blue-500 to-indigo-600',
    'from-teal-500 to-cyan-600',
];

const DEPT_ICONS = {
    Cardiology: '❤️', Neurology: '🧠', Orthopedics: '🦴', Oncology: '🔬',
    Pediatrics: '👶', Gynecology: '🌸', Gastroenterology: '💊', Nephrology: '🫘',
    Pulmonology: '🫁', Dermatology: '✨', Ophthalmology: '👁️', ENT: '👂',
};

export default function DepartmentsSection() {
    return (
        <section id="departments" className="py-24 bg-surfaceAlt">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="badge badge-primary mb-4">Departments</span>
                    <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-black mb-4 gradient-text">
                        Our Specialties
                    </h2>
                    <div className="section-divider" />
                    <p className="text-base text-muted max-w-lg mx-auto mt-4">
                        World-class care across {hospitalInfo.departments.length} medical specialties,
                        powered by cutting-edge technology and expert physicians.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {hospitalInfo.departments.map((dept, i) => (
                        <button
                            key={dept}
                            onClick={() => document.querySelector('#doctors')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300
                         hover:-translate-y-1 hover:shadow-glow-lg bg-surface border border-hborder"
                        >
                            {/* Gradient accent bar */}
                            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${DEPT_COLORS[i % DEPT_COLORS.length]}`} />

                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${DEPT_COLORS[i % DEPT_COLORS.length]}
                              flex items-center justify-center text-2xl mb-4 shadow-md
                              group-hover:scale-110 transition-transform duration-300`}>
                                {DEPT_ICONS[dept] || '🏥'}
                            </div>

                            <h3 className="font-bold text-htext text-sm leading-snug mb-1">{dept}</h3>
                            <p className="text-[11px] text-muted">View Doctors →</p>

                            {/* Subtle hover bg */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${DEPT_COLORS[i % DEPT_COLORS.length]}
                              opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
