import React from 'react';
import { testimonials } from '../../data/hospitalData';

export default function TestimonialsSection() {
    return (
        <section className="py-24" style={{ background: 'var(--color-background)' }}>
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-14">
                    <span className="badge badge-primary mb-4">Testimonials</span>
                    <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-black mb-4 gradient-text">
                        What Our Patients Say
                    </h2>
                    <div className="section-divider" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={t.id}
                            className="card p-7 flex gap-5">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                              flex-shrink-0 text-sm shadow-md"
                                style={{ background: 'var(--color-gradient)' }}>
                                {t.name.split(' ').map(n => n[0]).join('')}
                            </div>

                            <div className="flex-1">
                                {/* Stars */}
                                <div className="flex gap-0.5 mb-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <span key={s} className={s <= t.rating ? 'text-amber-400' : 'text-slate-200'}
                                            style={{ fontSize: 13 }}>★</span>
                                    ))}
                                </div>

                                <p className="text-sm text-muted leading-relaxed mb-4 italic">"{t.text}"</p>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-bold text-htext">{t.name}</div>
                                        <div className="text-[11px] text-muted">{t.department} · {t.date}</div>
                                    </div>
                                    <span className="text-2xl">💬</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
