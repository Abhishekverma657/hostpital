import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctors } from '../data/hospitalData';

/* ── helpers ─────────────────────────────────────────────────────── */
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getTodayName() {
    const idx = new Date().getDay(); // 0=Sun
    return idx === 0 ? 'Sunday' : DAYS[idx - 1];
}
function getNowMins() {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
}
function toMins(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}
function fmt(t) {
    const [h, m] = t.split(':').map(Number);
    const p = h >= 12 ? 'PM' : 'AM';
    const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hr}:${m.toString().padStart(2, '0')} ${p}`;
}
function slotStatus(time, bookedSlots) {
    const now = getNowMins();
    const sm = toMins(time);
    const booked = bookedSlots.includes(time);
    if (now >= sm && now < sm + 30) return 'live';
    if (sm < now) return booked ? 'past-booked' : 'past';
    return booked ? 'booked' : 'available';
}
function groupSessions(slots) {
    return {
        morning: slots.filter(s => toMins(s) < 720),
        afternoon: slots.filter(s => toMins(s) >= 720 && toMins(s) < 1020),
        evening: slots.filter(s => toMins(s) >= 1020),
    };
}
function StarRating({ r }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ fontSize: 16, color: i <= Math.round(r) ? '#f59e0b' : '#e2e8f0' }}>★</span>
            ))}
        </div>
    );
}

/* ── Slot button ──────────────────────────────────────────────── */
function SlotBtn({ time, status, selected, onClick, waitMins }) {
    const styles = {
        live: 'bg-emerald-500 text-white border-emerald-500 ring-2 ring-emerald-300 ring-offset-1',
        booked: 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through',
        'past-booked': 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed',
        past: 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed',
        available: 'bg-white text-htext border-hborder hover:border-primary hover:text-primary hover:scale-105 cursor-pointer',
    };
    const tags = { live: '🟢 Live', booked: '🔴 Booked', past: 'Past', 'past-booked': 'Past' };
    const clickable = status === 'available';
    return (
        <button
            onClick={() => clickable && onClick(time)}
            disabled={!clickable}
            className={`relative rounded-xl border text-center transition-all duration-200 p-3
        ${styles[status] || styles.available}
        ${selected ? '!text-white !border-transparent scale-105 shadow-glow' : ''}
        ${status === 'live' ? 'animate-pulse' : ''}`}
            style={selected && clickable ? { background: 'var(--color-gradient)', borderColor: 'transparent' } : {}}
        >
            <div className="text-sm font-bold leading-none">{fmt(time)}</div>
            {tags[status] && <div className="text-[10px] font-semibold mt-1">{tags[status]}</div>}
            {status === 'available' && waitMins != null && (
                <div className="text-[10px] text-slate-400 mt-0.5">~{waitMins}m wait</div>
            )}
        </button>
    );
}

/* ── Slot section (Morning / Afternoon / Evening) ─────────────── */
function SlotSection({ title, icon, slots, bookedSlots, selected, onSelect, waitBase }) {
    if (!slots.length) return null;
    const freeCount = slots.filter(s => slotStatus(s, bookedSlots) === 'available').length;
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">{icon}</span>
                <h3 className="text-sm font-bold text-htext uppercase tracking-wider">{title}</h3>
                <div className="flex-1 h-px bg-hborder" />
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full
          ${freeCount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {freeCount} free
                </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2.5">
                {slots.map((s, i) => (
                    <SlotBtn
                        key={s} time={s}
                        status={slotStatus(s, bookedSlots)}
                        selected={selected === s}
                        onClick={t => onSelect(t === selected ? null : t)}
                        waitMins={!bookedSlots.includes(s) ? waitBase + i * 8 : null}
                    />
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function DoctorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const doctor = doctors.find(d => d.id === parseInt(id));

    const todayName = getTodayName();
    const [activeDay, setActiveDay] = useState(todayName);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [activeTab, setActiveTab] = useState('slots');  // default: slots
    const [patientName, setPatientName] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [patientNote, setPatientNote] = useState('');
    const [booked, setBooked] = useState(false);
    const [nowMins, setNowMins] = useState(getNowMins());

    useEffect(() => {
        window.scrollTo(0, 0);
        const t = setInterval(() => setNowMins(getNowMins()), 30000);
        return () => clearInterval(t);
    }, []);

    if (!doctor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-6xl">🔍</div>
                <h2 className="text-2xl font-bold text-htext">Doctor not found</h2>
                <button onClick={() => navigate('/')} className="btn-primary">← Back to Home</button>
            </div>
        );
    }

    const daySlots = doctor.slots[activeDay] || [];
    const { morning, afternoon, evening } = groupSessions(daySlots);

    const totalSlots = daySlots.length;
    const bookedCount = daySlots.filter(s => doctor.bookedSlots.includes(s)).length;
    const availableCount = daySlots.filter(s => slotStatus(s, doctor.bookedSlots) === 'available').length;
    const liveSlot = daySlots.find(s => slotStatus(s, doctor.bookedSlots) === 'live');
    const upcomingBooked = selectedSlot
        ? doctor.bookedSlots.filter(s => toMins(s) < toMins(selectedSlot) && toMins(s) > getNowMins()).length
        : 0;
    const estWait = upcomingBooked * 15;

    const canBook = selectedSlot && patientName.trim() && patientPhone.trim();

    const handleBook = () => { if (canBook) setBooked(true); };

    const TABS = [
        { id: 'slots', label: 'Book Appointment', icon: '📅' },
        { id: 'overview', label: 'Profile', icon: '👤' },
        { id: 'education', label: 'Education', icon: '🎓' },
        { id: 'schedule', label: 'Weekly Schedule', icon: '🗓️' },
    ];

    return (
        <div className="min-h-screen font-sans" style={{ background: 'var(--color-background)' }}>

            {/* ── Top bar ───────────────────────────────────────────── */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-hborder shadow-card">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-sm font-semibold text-muted
                       hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/5"
                    >
                        ← Back
                    </button>
                    <div className="w-px h-5 bg-hborder" />
                    {/* Logo */}
                    <button onClick={() => navigate('/')} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center
                            font-black text-white text-lg shadow-glow">+</div>
                        <span className="font-extrabold text-primary text-base hidden sm:block">MediCare Hospital</span>
                    </button>
                    <div className="flex-1" />
                    <a href="tel:+919810011111"
                        className="flex items-center gap-2 text-xs font-bold text-danger
                        px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                        Emergency: +91 98100 11111
                    </a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* ════ HERO SECTION ════════════════════════════════════ */}
                <div className="rounded-3xl overflow-hidden mb-8 shadow-float">
                    {/* Banner */}
                    <div className="h-40 relative" style={{ background: `linear-gradient(135deg, ${doctor.color}22, ${doctor.color}44)` }}>
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 60%, transparent 100%)', opacity: 0.7 }} />
                        <div className="absolute inset-0"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                                backgroundSize: '32px 32px',
                            }} />
                    </div>

                    {/* Profile card */}
                    <div className="bg-white px-6 sm:px-10 pb-8 relative">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14">
                            {/* Big avatar */}
                            <div className="w-28 h-28 rounded-3xl flex items-center justify-center text-4xl font-black
                              text-white shadow-xl flex-shrink-0 border-4 border-white"
                                style={{ background: `linear-gradient(135deg, ${doctor.color}, ${doctor.color}99)` }}>
                                {doctor.initials}
                            </div>

                            <div className="flex-1 pt-3 sm:pt-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h1 className="text-2xl sm:text-3xl font-black text-htext">{doctor.name}</h1>
                                    {availableCount > 0
                                        ? <span className="badge badge-success text-[11px] px-3">● Available Today</span>
                                        : <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-[11px] font-bold">● Fully Booked</span>}
                                </div>
                                <p className="text-base text-muted font-semibold">{doctor.designation} · {doctor.department}</p>
                                <p className="text-sm text-subtle mt-0.5">{doctor.qualification}</p>
                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                    <StarRating r={doctor.rating} />
                                    <span className="font-bold text-htext">{doctor.rating}</span>
                                    <span className="text-sm text-muted">({doctor.reviews.toLocaleString()} reviews)</span>
                                </div>
                            </div>

                            {/* Quick facts */}
                            <div className="flex gap-3 sm:gap-4 flex-wrap">
                                {[
                                    { icon: '⏱️', val: doctor.experience, lbl: 'Experience' },
                                    { icon: '💵', val: `₹${doctor.consultationFee}`, lbl: 'Consultation' },
                                    { icon: '🕑', val: `${doctor.availability.from} – ${doctor.availability.to}`, lbl: 'OPD Timing' },
                                ].map(f => (
                                    <div key={f.lbl}
                                        className="text-center px-4 py-3 rounded-2xl bg-surfaceAlt border border-hborder min-w-[90px]">
                                        <div className="text-2xl mb-1">{f.icon}</div>
                                        <div className="text-xs font-black text-htext leading-snug">{f.val}</div>
                                        <div className="text-[10px] text-muted mt-0.5">{f.lbl}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════ MAIN CONTENT GRID ════════════════════════════════ */}
                <div className="grid lg:grid-cols-[1fr_380px] gap-6">

                    {/* ── Left: tabs + content ────────────────────────── */}
                    <div>
                        {/* Tab bar */}
                        <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-hborder mb-6 shadow-card overflow-x-auto">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                              whitespace-nowrap transition-all duration-200 flex-shrink-0
                    ${activeTab === tab.id
                                            ? 'text-white shadow-glow'
                                            : 'text-muted hover:text-htext'}`}
                                    style={activeTab === tab.id ? { background: 'var(--color-gradient)' } : {}}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.label}
                                    {tab.id === 'slots' && availableCount > 0 && (
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black
                      ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                            {availableCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* ─── SLOT BOOKING TAB ─────────────────────────── */}
                        {activeTab === 'slots' && !booked && (
                            <div className="bg-white rounded-3xl border border-hborder p-6 sm:p-8 shadow-card">

                                {/* Live now alert */}
                                {liveSlot && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl mb-6 border border-emerald-200"
                                        style={{ background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)' }}>
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white text-xl flex items-center
                                    justify-center animate-pulse flex-shrink-0">🟢</div>
                                        <div>
                                            <div className="text-sm font-black text-emerald-700">Doctor is Active Right Now</div>
                                            <div className="text-xs text-emerald-600 mt-0.5">
                                                Currently in session — {fmt(liveSlot)} slot is live
                                            </div>
                                        </div>
                                        <div className="ml-auto text-right flex-shrink-0">
                                            <div className="text-sm font-black text-emerald-700">{bookedCount} in queue</div>
                                            <div className="text-xs text-emerald-600">~{bookedCount * 12}min total wait</div>
                                        </div>
                                    </div>
                                )}

                                {/* Day selector */}
                                <div className="mb-7">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-base font-black text-htext">Select a Day</h2>
                                        <span className="text-[11px] text-muted font-medium">
                                            Today: <span className="font-bold text-primary">{todayName}</span>
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {DAYS.map(day => {
                                            const daySlotList = doctor.slots[day] || [];
                                            const freeSlots = daySlotList.filter(s => !doctor.bookedSlots.includes(s)).length;
                                            const hasSlots = daySlotList.length > 0;
                                            const isToday = day === todayName;
                                            const isActive = day === activeDay;
                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => { if (hasSlots) { setActiveDay(day); setSelectedSlot(null); } }}
                                                    disabled={!hasSlots}
                                                    className={`flex flex-col items-center rounded-2xl py-3 px-1 text-center
                                      transition-all duration-200 border
                            ${!hasSlots
                                                            ? 'opacity-30 cursor-not-allowed bg-slate-50 border-hborder'
                                                            : isActive
                                                                ? 'border-transparent text-white shadow-glow'
                                                                : 'border-hborder bg-white hover:border-primary hover:text-primary'}`}
                                                    style={isActive && hasSlots ? { background: 'var(--color-gradient)' } : {}}
                                                >
                                                    <span className={`text-xs font-bold uppercase tracking-wide
                            ${isActive ? 'text-white/80' : 'text-muted'}`}>
                                                        {day.slice(0, 3)}
                                                    </span>
                                                    {isToday && (
                                                        <span className={`text-[9px] font-black mt-0.5
                              ${isActive ? 'text-white' : 'text-primary'}`}>TODAY</span>
                                                    )}
                                                    {hasSlots && (
                                                        <span className={`text-[10px] font-black mt-1
                              ${isActive ? 'text-white' : freeSlots > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                                                            {freeSlots > 0 ? `${freeSlots} free` : 'Full'}
                                                        </span>
                                                    )}
                                                    {!hasSlots && (
                                                        <span className="text-[10px] text-slate-400 mt-1">Off</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Availability stats strip */}
                                {daySlots.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3 mb-7">
                                        {[
                                            { label: 'Total Slots', val: totalSlots, color: 'text-htext', bg: 'bg-surfaceAlt border-hborder' },
                                            { label: 'Pre-Booked', val: bookedCount, color: 'text-red-500', bg: 'bg-red-50 border-red-100' },
                                            { label: 'Available', val: availableCount, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                                            { label: 'Occupancy', val: `${totalSlots ? Math.round((bookedCount / totalSlots) * 100) : 0}%`, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
                                        ].map(s => (
                                            <div key={s.label}
                                                className={`${s.bg} rounded-2xl p-4 text-center border`}>
                                                <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                                                <div className="text-[11px] text-muted font-medium mt-0.5">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Slot sessions */}
                                {daySlots.length === 0 ? (
                                    <div className="text-center py-16 text-muted">
                                        <span className="text-6xl block mb-4">📵</span>
                                        <div className="text-base font-bold">No OPD sessions on {activeDay}</div>
                                        <div className="text-sm mt-1">Please select another day</div>
                                    </div>
                                ) : (
                                    <>
                                        <SlotSection title="Morning Session" icon="🌅" slots={morning} bookedSlots={doctor.bookedSlots} selected={selectedSlot} onSelect={setSelectedSlot} waitBase={5} />
                                        <SlotSection title="Afternoon Session" icon="☀️" slots={afternoon} bookedSlots={doctor.bookedSlots} selected={selectedSlot} onSelect={setSelectedSlot} waitBase={10} />
                                        <SlotSection title="Evening Session" icon="🌆" slots={evening} bookedSlots={doctor.bookedSlots} selected={selectedSlot} onSelect={setSelectedSlot} waitBase={6} />
                                    </>
                                )}

                                {/* Legend */}
                                <div className="flex flex-wrap gap-4 text-xs text-muted pt-4 border-t border-hborder">
                                    {[
                                        { bg: 'bg-emerald-500', label: 'Live Now (Doctor active)' },
                                        { bg: 'bg-white border border-hborder', label: 'Available' },
                                        { bg: 'bg-slate-200', label: 'Booked' },
                                        { bg: 'bg-slate-100', label: 'Past' },
                                    ].map(l => (
                                        <span key={l.label} className="flex items-center gap-1.5">
                                            <span className={`w-3.5 h-3.5 rounded-md ${l.bg} inline-block flex-shrink-0`} />
                                            {l.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ─── BOOKING CONFIRMED ────────────────────────── */}
                        {activeTab === 'slots' && booked && (
                            <div className="bg-white rounded-3xl border border-hborder p-10 shadow-card text-center">
                                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center
                                text-5xl mx-auto mb-6 shadow-md">✅</div>
                                <h2 className="text-2xl font-black text-htext mb-2">Appointment Confirmed!</h2>
                                <p className="text-muted mb-8">A confirmation has been sent to your mobile number.</p>

                                <div className="bg-surfaceAlt rounded-2xl p-6 border border-hborder text-left space-y-4 mb-8 max-w-md mx-auto">
                                    {[
                                        { icon: '👤', k: 'Patient', v: patientName },
                                        { icon: '📞', k: 'Phone', v: patientPhone },
                                        { icon: '📅', k: 'Date & Time', v: `${activeDay}, ${fmt(selectedSlot)}` },
                                        { icon: '👨‍⚕️', k: 'Doctor', v: doctor.name },
                                        { icon: '🏥', k: 'Department', v: doctor.department },
                                        { icon: '💵', k: 'Consultation Fee', v: `₹${doctor.consultationFee} (Pay at OPD counter)` },
                                        { icon: '⏱️', k: 'Estimated Wait', v: `~${estWait} minutes` },
                                        { icon: '🕑', k: 'Report At', v: `${fmt(selectedSlot)} (Arrive 10 min early)` },
                                    ].map(r => (
                                        <div key={r.k} className="flex items-start gap-3">
                                            <span className="w-6 text-center text-base flex-shrink-0 mt-0.5">{r.icon}</span>
                                            <span className="text-xs text-muted w-28 flex-shrink-0 font-semibold pt-0.5">{r.k}</span>
                                            <span className="text-sm font-bold text-htext">{r.v}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 justify-center flex-wrap">
                                    <button
                                        onClick={() => {
                                            setBooked(false); setSelectedSlot(null);
                                            setPatientName(''); setPatientPhone(''); setPatientAge(''); setPatientNote('');
                                        }}
                                        className="btn-outline"
                                    >
                                        Book Another Slot
                                    </button>
                                    <button onClick={() => navigate('/')} className="btn-primary">
                                        ← Back to Home
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ─── PROFILE TAB ──────────────────────────────── */}
                        {activeTab === 'overview' && (
                            <div className="bg-white rounded-3xl border border-hborder p-8 shadow-card space-y-7">
                                <div>
                                    <h2 className="text-sm font-black text-muted uppercase tracking-wider mb-3">About Doctor</h2>
                                    <p className="text-base text-muted leading-relaxed">{doctor.about}</p>
                                </div>

                                <div>
                                    <h2 className="text-sm font-black text-muted uppercase tracking-wider mb-3">Specializations</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.specializations.map(s => (
                                            <span key={s} className="px-4 py-2 rounded-full text-sm font-medium border border-hborder
                                               text-muted hover:border-primary hover:text-primary transition-colors">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <h2 className="text-sm font-black text-muted uppercase tracking-wider mb-3">Languages</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.languages.map(l => (
                                                <span key={l} className="badge badge-primary px-4 py-2 text-sm">{l}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-muted uppercase tracking-wider mb-3">Awards & Recognition</h2>
                                        <ul className="space-y-2">
                                            {doctor.awards.map(a => (
                                                <li key={a} className="flex items-start gap-2 text-sm text-muted">
                                                    <span className="text-amber-400 mt-0.5 flex-shrink-0">🏆</span> {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── EDUCATION TAB ────────────────────────────── */}
                        {activeTab === 'education' && (
                            <div className="bg-white rounded-3xl border border-hborder p-8 shadow-card">
                                <h2 className="text-sm font-black text-muted uppercase tracking-wider mb-6">Education & Training</h2>
                                <div className="relative">
                                    <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-hborder" />
                                    <div className="space-y-6">
                                        {doctor.education.map((edu, i) => (
                                            <div key={i} className="relative pl-14">
                                                <div className="absolute left-3.5 top-2 w-3.5 h-3.5 rounded-full border-2 bg-white"
                                                    style={{ borderColor: 'var(--color-primary)' }} />
                                                <div className="bg-surfaceAlt rounded-2xl p-5 border border-hborder">
                                                    <div className="flex items-start justify-between gap-3 mb-1">
                                                        <h3 className="font-black text-base text-htext">{edu.degree}</h3>
                                                        <span className="badge badge-primary flex-shrink-0">{edu.year}</span>
                                                    </div>
                                                    <p className="text-sm text-muted">{edu.institution}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── SCHEDULE TAB ─────────────────────────────── */}
                        {activeTab === 'schedule' && (
                            <div className="bg-white rounded-3xl border border-hborder p-8 shadow-card">
                                <h2 className="text-sm font-black text-muted uppercase tracking-wider mb-6">Weekly OPD Schedule</h2>
                                <div className="space-y-3">
                                    {DAYS.map(day => {
                                        const sl = doctor.slots[day] || [];
                                        const avail = sl.filter(s => !doctor.bookedSlots.includes(s)).length;
                                        const bkd = sl.filter(s => doctor.bookedSlots.includes(s)).length;
                                        const occu = sl.length ? Math.round((bkd / sl.length) * 100) : 0;
                                        return (
                                            <div key={day}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all
                             ${sl.length > 0 ? 'border-hborder bg-white hover:border-primary/30 hover:bg-primary/5 cursor-pointer'
                                                        : 'border-dashed border-slate-200 bg-slate-50 opacity-60'}`}
                                                onClick={() => { if (sl.length > 0) { setActiveDay(day); setActiveTab('slots'); } }}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black
                          ${sl.length > 0 ? 'text-white shadow-glow' : 'bg-slate-100 text-slate-400'}`}
                                                    style={sl.length > 0 ? { background: 'var(--color-gradient)' } : {}}>
                                                    {day.slice(0, 3).toUpperCase()}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-htext text-sm">{day}</span>
                                                        {day === todayName && (
                                                            <span className="badge badge-primary text-[10px]">Today</span>
                                                        )}
                                                        {sl.length === 0 && (
                                                            <span className="text-xs font-semibold text-slate-400">No OPD</span>
                                                        )}
                                                    </div>
                                                    {sl.length > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-muted">{doctor.availability.from} – {doctor.availability.to}</span>
                                                            <span className="text-xs text-emerald-600 font-semibold">{avail} slots free</span>
                                                        </div>
                                                    )}

                                                    {sl.length > 0 && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            {/* Occupancy bar */}
                                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full transition-all duration-500"
                                                                    style={{
                                                                        width: `${occu}%`,
                                                                        background: occu > 80 ? '#ef4444'
                                                                            : occu > 50 ? '#f59e0b'
                                                                                : 'var(--color-secondary)',
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] text-muted font-medium flex-shrink-0">{occu}% booked</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {sl.length > 0 && (
                                                    <div className="text-right flex-shrink-0">
                                                        <div className="text-lg font-black text-htext">{sl.length}</div>
                                                        <div className="text-[10px] text-muted">total slots</div>
                                                        {avail > 0 && (
                                                            <div className="text-[10px] text-primary font-bold mt-0.5">Book →</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right sidebar: patient form + doctor info ─── */}
                    <div className="space-y-5">

                        {/* Patient form card */}
                        {!booked && (
                            <div className="bg-white rounded-3xl border border-hborder p-6 shadow-card sticky top-24">
                                <h2 className="text-base font-black text-htext mb-1">
                                    {selectedSlot ? `📅 Confirm Appointment` : '📋 Patient Details'}
                                </h2>
                                {selectedSlot && (
                                    <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                                        <span className="text-primary text-lg">✓</span>
                                        <div>
                                            <div className="text-xs font-black text-primary">{activeDay}, {fmt(selectedSlot)}</div>
                                            <div className="text-[10px] text-muted">~{estWait}min estimated wait</div>
                                        </div>
                                    </div>
                                )}
                                {!selectedSlot && (
                                    <p className="text-xs text-muted mb-4">Fill in your details and select a slot from the left.</p>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text" value={patientName}
                                            onChange={e => setPatientName(e.target.value)}
                                            placeholder="Enter patient's full name"
                                            className="w-full px-4 py-3 rounded-xl border border-hborder text-sm bg-white text-htext
                                 placeholder:text-subtle focus:outline-none focus:border-primary
                                 focus:ring-2 focus:ring-primary/15 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel" value={patientPhone}
                                            onChange={e => setPatientPhone(e.target.value)}
                                            placeholder="+91 9XXXXXXXXX"
                                            className="w-full px-4 py-3 rounded-xl border border-hborder text-sm bg-white text-htext
                                 placeholder:text-subtle focus:outline-none focus:border-primary
                                 focus:ring-2 focus:ring-primary/15 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
                                            Age
                                        </label>
                                        <input
                                            type="number" value={patientAge}
                                            onChange={e => setPatientAge(e.target.value)}
                                            placeholder="Patient age"
                                            min={1} max={120}
                                            className="w-full px-4 py-3 rounded-xl border border-hborder text-sm bg-white text-htext
                                 placeholder:text-subtle focus:outline-none focus:border-primary
                                 focus:ring-2 focus:ring-primary/15 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
                                            Reason / Chief Complaint
                                        </label>
                                        <textarea
                                            value={patientNote}
                                            onChange={e => setPatientNote(e.target.value)}
                                            placeholder="Brief description of your concern (optional)"
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-hborder text-sm bg-white text-htext
                                 placeholder:text-subtle focus:outline-none focus:border-primary
                                 focus:ring-2 focus:ring-primary/15 transition-all resize-none"
                                        />
                                    </div>

                                    {/* Fee summary */}
                                    {selectedSlot && (
                                        <div className="bg-surfaceAlt rounded-xl p-4 border border-hborder space-y-2">
                                            <h3 className="text-xs font-black text-muted uppercase tracking-wider mb-2">Summary</h3>
                                            {[
                                                { k: 'Slot', v: `${activeDay}, ${fmt(selectedSlot)}` },
                                                { k: 'Doctor', v: doctor.name },
                                                { k: 'Fee', v: `₹${doctor.consultationFee}` },
                                                { k: 'Est. Wait', v: `~${estWait} min` },
                                            ].map(r => (
                                                <div key={r.k} className="flex justify-between text-xs">
                                                    <span className="text-muted">{r.k}</span>
                                                    <span className="font-bold text-htext">{r.v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleBook}
                                        disabled={!canBook}
                                        className={`w-full btn-primary justify-center py-4 rounded-xl text-sm
                      ${!canBook ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    >
                                        {!selectedSlot
                                            ? '← Select a slot first'
                                            : !patientName || !patientPhone
                                                ? 'Fill required details'
                                                : `✅ Confirm – ${activeDay}, ${fmt(selectedSlot)}`}
                                    </button>

                                    <p className="text-center text-[10px] text-muted">
                                        🔒 Your data is secure. By booking, you agree to our terms.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Doctor mini info card */}
                        {!booked && (
                            <div className="bg-white rounded-3xl border border-hborder p-6 shadow-card">
                                <h3 className="text-xs font-black text-muted uppercase tracking-wider mb-4">Quick Info</h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: '🏥', label: 'Department', value: doctor.department },
                                        { icon: '🌐', label: 'Languages', value: doctor.languages.join(', ') },
                                        { icon: '📍', label: 'Location', value: 'OPD Block, Ground Floor' },
                                        { icon: '📞', label: 'Helpline', value: '+91 98100 00000', href: 'tel:+919810000000' },
                                    ].map(r => (
                                        <div key={r.label} className="flex items-start gap-3 text-sm">
                                            <span className="text-base mt-0.5 flex-shrink-0">{r.icon}</span>
                                            <span className="text-muted w-24 flex-shrink-0 text-xs font-semibold pt-0.5">{r.label}</span>
                                            {r.href
                                                ? <a href={r.href} className="font-semibold text-primary hover:underline text-xs">{r.value}</a>
                                                : <span className="font-semibold text-htext text-xs">{r.value}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
