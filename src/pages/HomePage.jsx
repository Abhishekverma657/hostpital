import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import DepartmentsSection from '../components/sections/DepartmentsSection';
import DoctorsSection from '../components/sections/DoctorsSection';
import FacilitiesSection from '../components/sections/FacilitiesSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';

export default function HomePage() {
    return (
        <div className="min-h-screen font-sans" style={{ background: 'var(--color-background)' }}>
            <Navbar />
            <main>
                <HeroSection />
                <AboutSection />
                <DepartmentsSection />
                <DoctorsSection />
                <FacilitiesSection />
                <TestimonialsSection />
            </main>
            <Footer />

            {/* Floating emergency button */}
            <a
                href="tel:+919810011111"
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full
                   text-sm font-bold text-white shadow-glow-lg hover:shadow-glow transition-all
                   hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}
            >
                🚑 Emergency
            </a>
        </div>
    );
}
