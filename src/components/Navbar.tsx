
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Menu, User, MessageSquare, PlusCircle, LogOut, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();
  const auth = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Dumbbell className="text-white h-6 w-6" />
          </div>
          <span className={`text-2xl font-headline font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
            Zeedor
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/listings" className={`font-medium hover:text-primary transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>Explore</Link>
          <Link href="/articles" className={`font-medium hover:text-primary transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>Insights</Link>
          {user && (
            <>
              <Link href="/messages" className={`font-medium hover:text-primary transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>Messages</Link>
              <Link href="/dashboard" className={`font-medium hover:text-primary transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>Dashboard</Link>
              <Link href="/listings/new">
                <Button variant="ghost" className={`gap-2 ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>
                  <PlusCircle size={18} />
                  List Service
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className={isScrolled ? 'text-gray-600' : 'text-white/90'}>
                <LogOut size={18} />
              </Button>
            </>
          )}
          {!user && (
            <Link href="/login">
              <Button className="rounded-full px-6 bg-accent hover:bg-accent/90">
                <User size={18} className="mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isScrolled ? 'text-gray-900' : 'text-white'}>
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col p-8">
              <div className="flex items-center gap-2 mb-10">
                <Dumbbell className="text-primary h-8 w-8" />
                <span className="text-2xl font-headline font-bold">Zeedor</span>
              </div>
              <div className="flex flex-col gap-6 text-lg font-medium">
                <Link href="/listings" className="flex items-center gap-3 py-2"><Dumbbell size={20} /> Explore Marketplace</Link>
                <Link href="/articles" className="flex items-center gap-3 py-2"><BookOpen size={20} /> Insights</Link>
                {user ? (
                  <>
                    <Link href="/messages" className="flex items-center gap-3 py-2"><MessageSquare size={20} /> Messages</Link>
                    <Link href="/dashboard" className="flex items-center gap-3 py-2"><PlusCircle size={20} /> Dashboard</Link>
                    <button onClick={handleSignOut} className="flex items-center gap-3 py-2 text-destructive"><LogOut size={20} /> Sign Out</button>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center gap-3 py-2"><User size={20} /> Sign In</Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
