import React, { useState, useEffect } from 'react';

const NAV_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Departments', href: '#departments' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState('#home');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const nav = (href) => {
        setActive(href);
        setMenuOpen(false);
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
        ${scrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-glow border-b border-hborder py-2'
                    : 'py-4'}`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center gap-8">

                {/* Logo */}
                <button onClick={() => nav('#home')} className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center
                          font-black text-2xl text-white shadow-glow">
                        +
                    </div>
                    <div className="text-left">
                        <span className="block text-lg font-extrabold text-primary leading-none">MediCare</span>
                        <span className={`block text-[10px] font-medium uppercase tracking-widest leading-none mt-0.5
              ${scrolled ? 'text-muted' : 'text-white/60'}`}>Advanced Hospital</span>
                    </div>
                </button>

                {/* Desktop links */}
                <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                    {NAV_LINKS.map(link => (
                        <button
                            key={link.href}
                            onClick={() => nav(link.href)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${active === link.href
                                    ? 'bg-primary/10 text-primary'
                                    : scrolled ? 'text-muted hover:text-primary hover:bg-primary/10'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* CTA – desktop */}
                <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                    <a href="tel:+919810000000"
                        className={`flex items-center gap-2 text-xs font-bold transition-colors
               ${scrolled ? 'text-danger' : 'text-white/90'}`}>
                        <span className="w-2 h-2 rounded-full bg-danger animate-pulse_glow flex-shrink-0" />
                        +91 98100 00000
                    </a>
                    <button onClick={() => nav('#doctors')} className="btn-primary text-sm px-5 py-2.5">
                        Book Appointment
                    </button>
                </div>

                {/* Hamburger */}
                <button
                    className="lg:hidden ml-auto flex flex-col gap-[5px] p-1.5 bg-transparent border-0 cursor-pointer"
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Toggle menu"
                >
                    {[0, 1, 2].map(i => (
                        <span
                            key={i}
                            className={`block h-0.5 bg-current rounded transition-all duration-300 origin-center
                ${scrolled ? 'text-htext' : 'text-white'}
                ${menuOpen && i === 0 ? 'w-6 translate-y-[7px] rotate-45' : ''}
                ${menuOpen && i === 1 ? 'w-0 opacity-0' : 'w-6'}
                ${menuOpen && i === 2 ? 'w-6 -translate-y-[7px] -rotate-45' : ''}`}
                        />
                    ))}
                </button>
            </div>

            {/* Mobile drawer */}
            <div className={`lg:hidden overflow-hidden transition-all duration-400 bg-white/98 backdrop-blur-xl
                       border-t border-hborder px-6
                       ${menuOpen ? 'max-h-[500px] py-4' : 'max-h-0 py-0'}`}>
                <div className="flex flex-col gap-1">
                    {NAV_LINKS.map(link => (
                        <button
                            key={link.href}
                            onClick={() => nav(link.href)}
                            className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${active === link.href ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary hover:bg-primary/10'}`}
                        >
                            {link.label}
                        </button>
                    ))}
                    <button onClick={() => nav('#doctors')} className="btn-primary mt-2 justify-center">
                        Book Appointment
                    </button>
                </div>
            </div>
        </header>
    );
}
