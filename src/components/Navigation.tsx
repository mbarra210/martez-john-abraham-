'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import ConsultationModal from './ConsultationModal';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/#home' },
    { label: 'About', href: '/#about' },
    { label: 'Practice Areas', href: '/#practice' },
    { label: 'Contact', href: '/#contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#001f3f]">
              M. John Abraham 
              <span className="block text-sm font-normal text-[#d4af37]">Attorney at Law</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <a key={item.label} href={item.href} className="text-[#001f3f] hover:text-[#d4af37] transition-colors duration-300 font-medium">
                {item.label}
              </a>
            ))}
            <ConsultationModal>
              <Button variant="professional" size="sm">
                Free Consultation
              </Button>
            </ConsultationModal>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navItems.map(item => (
                <a key={item.label} href={item.href} className="text-[#001f3f] hover:text-[#d4af37] transition-colors duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              ))}

              <ConsultationModal>
                <Button variant="professional" size="sm" className="self-start">
                  Free Consultation
                </Button>
              </ConsultationModal>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
