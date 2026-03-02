import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctors } from '../../data/hospitalData';

const DEPARTMENTS = ['All', ...new Set(doctors.map(d => d.department))];

function StarRating({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}
                    style={{ fontSize: 13 }}>★</span>
            ))}
        </div>
    );
}

function DoctorCard({ doctor, onClick }) {
    const available = doctor.slots[Object.keys(doctor.slots).find(d =>
        (doctor.slots[d] || []).some(s => !doctor.bookedSlots.includes(s))
    ) || ''].filter ? true : false;

    return (
        <div
            className="card group cursor-pointer"
            onClick={() => onClick(doctor.id)}
        >
            {/* Color top bar */}
            <div className="h-1.5 rounded-t-xl2" style={{ background: doctor.color }} />

            <div className="p-6">
                {/* Avatar + info */}
                <div className="flex items-start gap-4 mb-5">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white
                       shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                        style={{ background: `linear-gradient(135deg, ${doctor.color}, ${doctor.color}88)` }}
                    >
                        {doctor.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-htext text-base leading-snug group-hover:text-primary transition-colors truncate">
                            {doctor.name}
                        </h3>
                        <p className="text-xs text-muted font-medium mt-0.5">{doctor.designation}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <StarRating rating={doctor.rating} />
                            <span className="text-xs text-muted">({doctor.reviews.toLocaleString()})</span>
                        </div>
                    </div>
                </div>

                {/* Info rows */}
                <div className="space-y-2 mb-5">
                    {[
                        { icon: '🏥', text: doctor.department },
                        { icon: '⏱️', text: `${doctor.experience} Experience` },
                        { icon: '🕑', text: `${doctor.availability.from} – ${doctor.availability.to}` },
                    ].map(item => (
                        <div key={item.text} className="flex items-center gap-2 text-xs text-muted">
                            <span className="flex-shrink-0">{item.icon}</span>
                            <span className="truncate">{item.text}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-hborder my-4" />

                {/* Next available + fee */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-0.5">Next Available</div>
                        <div className="text-xs font-bold text-emerald-600">{doctor.nextAvailable}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-0.5">Fee</div>
                        <div className="text-sm font-bold text-htext">₹{doctor.consultationFee}</div>
                    </div>
                </div>

                {/* CTA */}
                <button
                    className="w-full btn-primary justify-center text-sm py-2.5"
                    onClick={e => { e.stopPropagation(); onClick(doctor.id); }}
                >
                    View Profile & Book Slot
                </button>
            </div>
        </div>
    );
}

export default function DoctorsSection() {
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    const filtered = filter === 'All' ? doctors : doctors.filter(d => d.department === filter);

    return (
        <section id="doctors" className="py-24" style={{ background: 'var(--color-background)' }}>
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-14">
                    <span className="badge badge-primary mb-4">Our Team</span>
                    <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-black mb-4 gradient-text">
                        Meet Our Specialists
                    </h2>
                    <div className="section-divider" />
                    <p className="text-base text-muted max-w-lg mx-auto mt-4">
                        {doctors.length}+ expert doctors — click any card to view full profile and book a slot.
                    </p>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap justify-center mb-12">
                    {DEPARTMENTS.map(dept => (
                        <button
                            key={dept}
                            onClick={() => setFilter(dept)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border
                ${filter === dept
                                    ? 'text-white border-transparent shadow-glow'
                                    : 'border-hborder text-muted hover:border-primary hover:text-primary bg-surface'}`}
                            style={filter === dept ? { background: 'var(--color-gradient)' } : {}}
                        >
                            {dept}
                        </button>
                    ))}
                </div>

                {/* Doctor cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(doc => (
                        <DoctorCard
                            key={doc.id}
                            doctor={doc}
                            onClick={id => navigate(`/doctor/${id}`)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
