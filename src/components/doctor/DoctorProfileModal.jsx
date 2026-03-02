import React, { useState, useEffect } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/* ── Helpers ─────────────────────────────────────────────────── */
function getNowMins() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

function toMins(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function formatTime12(t) {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

function getTodayName() {
    return DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

/* ── Slot status logic ───────────────────────────────────────── */
function getSlotStatus(timeStr, bookedSlots) {
    const nowMins = getNowMins();
    const slotMins = toMins(timeStr);
    const isBooked = bookedSlots.includes(timeStr);
    // Slot duration = 30 min
    if (nowMins >= slotMins && nowMins < slotMins + 30) return 'live';
    if (slotMins < nowMins) return isBooked ? 'past-booked' : 'past';
    return isBooked ? 'booked' : 'available';
}

/* ── Group slots by session ──────────────────────────────────── */
function groupBySession(slots) {
    const morning = slots.filter(s => toMins(s) < 12 * 60);
    const afternoon = slots.filter(s => toMins(s) >= 12 * 60 && toMins(s) < 17 * 60);
    const evening = slots.filter(s => toMins(s) >= 17 * 60);
    return { morning, afternoon, evening };
}

/* ── Star Rating ─────────────────────────────────────────────── */
function StarRating({ rating, size = 14 }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}
                    style={{ fontSize: size }}>★</span>
            ))}
        </div>
    );
}

/* ── Single slot button ──────────────────────────────────────── */
function SlotButton({ time, status, isSelected, onClick, waitMins }) {
    const labels = {
        live: { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-500', tag: '🟢 Live Now' },
        booked: { bg: 'bg-slate-100', text: 'text-slate-400', border: 'border-slate-200', tag: '🔴 Booked' },
        'past-booked': { bg: 'bg-slate-50', text: 'text-slate-300', border: 'border-slate-150', tag: '' },
        past: { bg: 'bg-slate-50', text: 'text-slate-300', border: 'border-slate-150', tag: '' },
        available: { bg: 'bg-surface', text: 'text-htext', border: 'border-hborder', tag: '' },
    };

    const s = labels[status] || labels['available'];
    const clickable = status === 'available';

    return (
        <button
            onClick={() => clickable && onClick(time)}
            disabled={!clickable}
            title={!clickable ? (status === 'booked' ? 'This slot is already booked' : 'Slot not bookable') : `Book ${formatTime12(time)}`}
            className={`relative rounded-xl border text-center transition-all duration-200 p-2.5
        ${s.bg} ${s.text} ${s.border}
        ${clickable ? 'hover:border-primary hover:text-primary hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
        ${isSelected ? '!border-primary !text-white scale-105 shadow-glow' : ''}
        ${status === 'live' ? 'ring-2 ring-emerald-400 ring-offset-1 animate-pulse' : ''}`}
            style={isSelected ? { background: 'var(--color-gradient)' } : {}}
        >
            <div className="text-xs font-bold leading-none">{formatTime12(time)}</div>
            {s.tag && <div className="text-[9px] font-semibold mt-1 opacity-90">{s.tag}</div>}
            {status === 'available' && waitMins != null && (
                <div className="text-[9px] text-muted mt-1">~{waitMins}min wait</div>
            )}
        </button>
    );
}

/* ── Session block ───────────────────────────────────────────── */
function SessionBlock({ title, icon, slots, bookedSlots, selectedSlot, onSelect, waitBase }) {
    if (!slots.length) return null;
    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{icon}</span>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">{title}</span>
                <div className="flex-1 h-px bg-hborder" />
                <span className="text-[10px] text-muted font-semibold">
                    {slots.filter(s => !bookedSlots.includes(s) && getSlotStatus(s, bookedSlots) === 'available').length} free
                </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {slots.map((slot, i) => (
                    <SlotButton
                        key={slot}
                        time={slot}
                        status={getSlotStatus(slot, bookedSlots)}
                        isSelected={selectedSlot === slot}
                        onClick={onSelect}
                        waitMins={!bookedSlots.includes(slot) ? waitBase + i * 8 : null}
                    />
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN MODAL
═══════════════════════════════════════════════════════════════ */
export default function DoctorProfileModal({ doctor, onClose }) {
    const todayName = getTodayName();
    const [activeDay, setActiveDay] = useState(todayName);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [booked, setBooked] = useState(false);
    const [nowMins, setNowMins] = useState(getNowMins());
    const [patientName, setPatientName] = useState('');
    const [patientPhone, setPatientPhone] = useState('');

    // Tick every minute to keep live slot updated
    useEffect(() => {
        const t = setInterval(() => setNowMins(getNowMins()), 60000);
        return () => clearInterval(t);
    }, []);

    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const daySlots = doctor.slots[activeDay] || [];
    const { morning, afternoon, evening } = groupBySession(daySlots);

    const totalSlots = daySlots.length;
    const bookedCount = daySlots.filter(s => doctor.bookedSlots.includes(s)).length;
    const availableCount = daySlots.filter(s => !doctor.bookedSlots.includes(s) && getSlotStatus(s, doctor.bookedSlots) === 'available').length;
    const liveSlot = daySlots.find(s => getSlotStatus(s, doctor.bookedSlots) === 'live');
    const currentQueue = bookedCount;

    const handleBook = () => {
        if (!selectedSlot) return;
        setBooked(true);
    };

    const TABS = [
        { id: 'overview', label: 'Profile', icon: '👤' },
        { id: 'education', label: 'Education', icon: '🎓' },
        { id: 'slots', label: 'Book Slot', icon: '📅' },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-surface rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col animate-fade-up"
                style={{ maxHeight: '92vh' }}
            >
                {/* ── Scrollable content ── */}
                <div className="overflow-y-auto flex-1">

                    {/* ─── HEADER ──────────────────────────────────────── */}
                    <div className="relative p-7 pb-5"
                        style={{ background: `linear-gradient(135deg, ${doctor.color}18, ${doctor.color}06)` }}>
                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50
                         hover:text-red-500 flex items-center justify-center text-muted transition-all text-base font-bold"
                        >
                            ✕
                        </button>

                        <div className="flex items-start gap-5 mb-5">
                            {/* Avatar */}
                            <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center
                              text-2xl font-black text-white shadow-lg flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${doctor.color}, ${doctor.color}88)` }}>
                                {doctor.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <h2 className="text-xl font-black text-htext">{doctor.name}</h2>
                                    {availableCount > 0
                                        ? <span className="badge badge-success text-[10px]">● Available</span>
                                        : <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">● Full Today</span>}
                                </div>
                                <p className="text-sm text-muted font-semibold">{doctor.designation}</p>
                                <p className="text-xs text-subtle mt-0.5">{doctor.qualification}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <StarRating rating={doctor.rating} />
                                    <span className="text-sm font-bold text-htext">{doctor.rating}</span>
                                    <span className="text-xs text-muted">({doctor.reviews.toLocaleString()} reviews)</span>
                                </div>
                            </div>
                        </div>

                        {/* Stat chips */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: '⏱️', label: 'Experience', value: doctor.experience },
                                { icon: '💵', label: 'Consultation', value: `₹${doctor.consultationFee}` },
                                { icon: '🕑', label: 'Timing', value: `${doctor.availability.from}` },
                            ].map(s => (
                                <div key={s.label}
                                    className="bg-surface rounded-xl p-3 border border-hborder text-center shadow-card">
                                    <span className="text-xl block mb-1">{s.icon}</span>
                                    <div className="text-xs font-black text-htext leading-none">{s.value}</div>
                                    <div className="text-[10px] text-muted mt-0.5">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── TABS ──────────────────────────────────────────── */}
                    <div className="flex border-b border-hborder px-7 bg-surface sticky top-0 z-10">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold border-b-2
                            transition-all duration-200 -mb-px
                  ${activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted hover:text-htext'}`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                                {tab.id === 'slots' && availableCount > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
                                        {availableCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ─── TAB CONTENT ─────────────────────────────────────── */}
                    <div className="p-7 pt-6">

                        {/* ══ OVERVIEW ══ */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">About Doctor</h3>
                                    <p className="text-sm text-muted leading-relaxed">{doctor.about}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Specializations</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.specializations.map(s => (
                                            <span key={s}
                                                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-hborder
                                       text-muted hover:border-primary hover:text-primary transition-colors">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Languages</h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {doctor.languages.map(l => (
                                                <span key={l} className="badge badge-primary">{l}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Awards & Recognition</h3>
                                        <ul className="space-y-1.5">
                                            {doctor.awards.map(a => (
                                                <li key={a} className="text-xs text-muted flex items-start gap-1.5">
                                                    <span className="text-amber-400 mt-0.5">🏆</span> {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                {/* Weekly schedule overview */}
                                <div>
                                    <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Weekly Schedule</h3>
                                    <div className="grid grid-cols-7 gap-1">
                                        {DAYS.map(day => {
                                            const has = (doctor.slots[day] || []).length > 0;
                                            return (
                                                <div key={day}
                                                    className={`text-center rounded-lg py-2 text-[10px] font-bold
                               ${has ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                                    <div>{day.slice(0, 2)}</div>
                                                    <div className="mt-0.5">{has ? '✓' : '✕'}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══ EDUCATION ══ */}
                        {activeTab === 'education' && (
                            <div className="animate-fade-in">
                                <div className="relative">
                                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-hborder" />
                                    <div className="space-y-5">
                                        {doctor.education.map((edu, i) => (
                                            <div key={i} className="relative pl-11">
                                                <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full border-2 bg-surface"
                                                    style={{ borderColor: 'var(--color-primary)' }} />
                                                <div className="bg-surfaceAlt rounded-xl p-4 border border-hborder">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-bold text-sm text-htext">{edu.degree}</h4>
                                                        <span className="badge badge-primary">{edu.year}</span>
                                                    </div>
                                                    <p className="text-xs text-muted">{edu.institution}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══ SLOTS ══ */}
                        {activeTab === 'slots' && !booked && (
                            <div className="animate-fade-in">

                                {/* ── Live now banner ─────────────────────────── */}
                                {liveSlot && (
                                    <div className="flex items-center gap-3 p-3 rounded-2xl mb-5 border border-emerald-200"
                                        style={{ background: 'linear-gradient(135deg,#d1fae5,#ecfdf5)' }}>
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center
                                    text-white text-base animate-pulse flex-shrink-0">🟢</div>
                                        <div>
                                            <div className="text-xs font-black text-emerald-700">Doctor is Active Now</div>
                                            <div className="text-[11px] text-emerald-600 mt-0.5">
                                                Currently seeing patient in {formatTime12(liveSlot)} slot
                                            </div>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <div className="text-xs font-black text-emerald-700">{currentQueue} in queue</div>
                                            <div className="text-[10px] text-emerald-600">~{currentQueue * 15}min wait</div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Day selector ──────────────────────────── */}
                                <div className="mb-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Select Day</h3>
                                        <span className="text-[10px] text-muted">Today is {todayName}</span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1.5">
                                        {DAYS.map(day => {
                                            const slots = doctor.slots[day] || [];
                                            const avail = slots.filter(s => !doctor.bookedSlots.includes(s)).length;
                                            const hasSlots = slots.length > 0;
                                            const isToday = day === todayName;
                                            const isActive = day === activeDay;
                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => { if (hasSlots) { setActiveDay(day); setSelectedSlot(null); } }}
                                                    disabled={!hasSlots}
                                                    className={`text-center rounded-xl py-2 px-1 text-[10px] font-bold transition-all border
                            ${!hasSlots ? 'opacity-30 cursor-not-allowed bg-slate-50 border-hborder text-muted'
                                                            : isActive ? 'text-white border-transparent shadow-glow'
                                                                : 'border-hborder text-muted hover:border-primary hover:text-primary bg-surface'}`}
                                                    style={isActive && hasSlots ? { background: 'var(--color-gradient)' } : {}}
                                                >
                                                    <div>{day.slice(0, 3)}</div>
                                                    {isToday && <div className="text-[8px] mt-0.5 font-black">Today</div>}
                                                    {hasSlots && !isToday && <div className="text-[8px] mt-0.5">{avail} free</div>}
                                                    {!hasSlots && <div className="text-[8px] mt-0.5">Off</div>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Slot stats strip ─────────────────────── */}
                                {daySlots.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mb-5">
                                        {[
                                            { label: 'Total Slots', value: totalSlots, color: 'text-htext', bg: 'bg-surfaceAlt' },
                                            { label: 'Pre-Booked', value: bookedCount, color: 'text-red-500', bg: 'bg-red-50' },
                                            { label: 'Available', value: availableCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                        ].map(s => (
                                            <div key={s.label}
                                                className={`${s.bg} rounded-xl p-3 text-center border border-hborder`}>
                                                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                                                <div className="text-[10px] text-muted font-medium mt-0.5">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── Slot sections ────────────────────────── */}
                                {daySlots.length === 0 ? (
                                    <div className="text-center py-12 text-muted">
                                        <span className="text-5xl block mb-3">📵</span>
                                        <div className="text-sm font-semibold">No slots on {activeDay}</div>
                                        <div className="text-xs mt-1">Try another day</div>
                                    </div>
                                ) : (
                                    <>
                                        <SessionBlock title="Morning Session" icon="🌅" slots={morning} bookedSlots={doctor.bookedSlots} selectedSlot={selectedSlot} onSelect={s => setSelectedSlot(s === selectedSlot ? null : s)} waitBase={5} />
                                        <SessionBlock title="Afternoon Session" icon="☀️" slots={afternoon} bookedSlots={doctor.bookedSlots} selectedSlot={selectedSlot} onSelect={s => setSelectedSlot(s === selectedSlot ? null : s)} waitBase={10} />
                                        <SessionBlock title="Evening Session" icon="🌆" slots={evening} bookedSlots={doctor.bookedSlots} selectedSlot={selectedSlot} onSelect={s => setSelectedSlot(s === selectedSlot ? null : s)} waitBase={8} />
                                    </>
                                )}

                                {/* ── Slot legend ──────────────────────────── */}
                                <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted mb-5 pt-2 border-t border-hborder">
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" />Live Now</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border border-hborder inline-block" />Available</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-100 inline-block" />Booked</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-50 inline-block" />Past</span>
                                </div>

                                {/* ── Patient detail form (shows when slot selected) ── */}
                                {selectedSlot && (
                                    <div className="rounded-2xl border border-primary/30 p-5 mb-5 animate-fade-in"
                                        style={{ background: 'var(--color-primary-light)' }}>
                                        <h3 className="text-xs font-black text-primary uppercase tracking-wider mb-4">
                                            📋 Patient Details – {activeDay}, {formatTime12(selectedSlot)}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={patientName}
                                                    onChange={e => setPatientName(e.target.value)}
                                                    placeholder="Your full name"
                                                    className="w-full px-3 py-2.5 rounded-xl border border-hborder text-sm bg-surface
                                     focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                                     text-htext placeholder:text-subtle transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={patientPhone}
                                                    onChange={e => setPatientPhone(e.target.value)}
                                                    placeholder="+91 9XXXXXXXX"
                                                    className="w-full px-3 py-2.5 rounded-xl border border-hborder text-sm bg-surface
                                     focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                                     text-htext placeholder:text-subtle transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-2 text-xs text-primary font-medium">
                                            <span>ℹ️</span>
                                            Estimated wait: ~{doctor.bookedSlots.filter(s => toMins(s) < toMins(selectedSlot)).length * 15} min
                                            · Consultation fee: ₹{doctor.consultationFee}
                                        </div>
                                    </div>
                                )}

                                {/* ── Book CTA ─────────────────────────────── */}
                                <button
                                    onClick={handleBook}
                                    disabled={!selectedSlot || !patientName || !patientPhone}
                                    className={`w-full btn-primary justify-center text-sm py-3.5 rounded-xl
                    ${(!selectedSlot || !patientName || !patientPhone) ? 'opacity-40 cursor-not-allowed' : ''}`}
                                >
                                    {selectedSlot
                                        ? `📅 Confirm Appointment – ${activeDay}, ${formatTime12(selectedSlot)}`
                                        : 'Select an available time slot above'}
                                </button>
                            </div>
                        )}

                        {/* ══ BOOKING CONFIRMED ══ */}
                        {activeTab === 'slots' && booked && (
                            <div className="animate-fade-in text-center py-8">
                                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center
                                text-4xl mx-auto mb-5 shadow-md">
                                    ✅
                                </div>
                                <h3 className="text-xl font-black text-htext mb-2">Appointment Confirmed!</h3>
                                <p className="text-sm text-muted mb-6">
                                    Your appointment has been successfully booked with <strong>{doctor.name}</strong>.
                                </p>
                                <div className="bg-surfaceAlt rounded-2xl p-5 border border-hborder text-left space-y-3 mb-6">
                                    {[
                                        { icon: '👤', label: 'Patient', value: patientName },
                                        { icon: '📅', label: 'Date & Time', value: `${activeDay}, ${formatTime12(selectedSlot)}` },
                                        { icon: '👨‍⚕️', label: 'Doctor', value: doctor.name },
                                        { icon: '🏥', label: 'Department', value: doctor.department },
                                        { icon: '💵', label: 'Fee', value: `₹${doctor.consultationFee} (Pay at counter)` },
                                        { icon: '⏱️', label: 'Report Time', value: `${formatTime12(selectedSlot)} (10 min early)` },
                                    ].map(r => (
                                        <div key={r.label} className="flex items-center gap-3 text-sm">
                                            <span className="w-6 text-center text-base flex-shrink-0">{r.icon}</span>
                                            <span className="text-muted w-24 flex-shrink-0 text-xs font-semibold">{r.label}</span>
                                            <span className="font-bold text-htext text-xs">{r.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs text-muted mb-5">
                                    📱 Confirmation SMS sent to <strong>{patientPhone}</strong>
                                </div>
                                <button
                                    onClick={() => { setBooked(false); setSelectedSlot(null); setPatientName(''); setPatientPhone(''); }}
                                    className="btn-outline text-sm"
                                >
                                    Book Another Slot
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
