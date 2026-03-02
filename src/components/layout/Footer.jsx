import React from 'react';

export default function Footer() {
    const year = new Date().getFullYear();

    const cols = [
        {
            title: 'Quick Links',
            links: ['Home', 'About Us', 'Departments', 'Doctors', 'Facilities', 'Careers', 'Contact'],
        },
        {
            title: 'Departments',
            links: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Gynecology', 'Nephrology', 'ENT'],
        },
    ];

    return (
        <footer id="contact" className="bg-gradient-to-b from-slate-900 to-slate-950 text-white/80">
            {/* Main grid */}
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center
                              font-black text-2xl text-white shadow-glow flex-shrink-0">+</div>
                            <div>
                                <span className="block text-lg font-extrabold text-primary leading-none">MediCare</span>
                                <span className="block text-[10px] font-medium uppercase tracking-widest text-white/40 mt-0.5">Advanced Hospital</span>
                            </div>
                        </div>
                        <p className="text-sm text-white/55 leading-7 mb-5">
                            Excellence in Healthcare, Compassion in Service. Trusted by 1.5 lakh+ patients
                            across 25+ years of medical excellence.
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="badge badge-success">NABH Accredited</span>
                            <span className="badge badge-primary">JCI Certified</span>
                        </div>
                    </div>

                    {/* Link columns */}
                    {cols.map(col => (
                        <div key={col.title}>
                            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-5">
                                {col.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map(l => (
                                    <li key={l}>
                                        <a href="#home"
                                            className="text-sm text-white/55 hover:text-primary hover:pl-1 transition-all duration-200">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-5">Contact Us</h4>
                        <div className="space-y-3.5">
                            {[
                                { icon: '📍', text: '42, Health Boulevard, Sector 18, Gurugram, Haryana – 122001' },
                                { icon: '📞', text: '+91 98100 00000', href: 'tel:+919810000000' },
                                { icon: '✉️', text: 'care@medicare-hospital.in', href: 'mailto:care@medicare-hospital.in' },
                                { icon: '🕐', text: 'OPD: Mon–Sat  8:00 AM – 8:00 PM' },
                            ].map(item => (
                                <div key={item.text} className="flex items-start gap-2.5 text-sm text-white/60">
                                    <span className="text-base mt-0.5 flex-shrink-0">{item.icon}</span>
                                    {item.href
                                        ? <a href={item.href} className="hover:text-primary transition-colors">{item.text}</a>
                                        : <span>{item.text}</span>}
                                </div>
                            ))}
                            {/* Emergency */}
                            <div className="flex items-start gap-2.5 text-sm">
                                <span className="text-base mt-0.5 flex-shrink-0">🚑</span>
                                <div>
                                    <span className="block text-[11px] text-red-400 font-semibold mb-0.5">24/7 Emergency</span>
                                    <a href="tel:+919810011111"
                                        className="text-red-300 font-bold text-base hover:text-red-200 transition-colors">
                                        +91 98100 11111
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/8 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-white/35">
                        © {year} MediCare Advanced Hospital. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                            <a key={l} href="#"
                                className="text-xs text-white/35 hover:text-primary transition-colors">{l}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
