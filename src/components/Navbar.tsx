'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Dumbbell, 
  Menu, 
  User, 
  MessageSquare, 
  PlusCircle, 
  LogOut, 
  BookOpen, 
  LayoutDashboard, 
  Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();
  const auth = useAuth();

  useEffect(() => {
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
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled 
        ? "bg-white/80 backdrop-blur-xl shadow-sm py-3 border-b border-gray-100" 
        : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            <Dumbbell className="text-white h-6 w-6" />
          </div>
          <span className={cn(
            "text-2xl font-headline font-bold tracking-tight transition-colors",
            isScrolled ? "text-gray-900" : "text-white"
          )}>
            Zeedor
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/listings">
            <Button variant="ghost" className={cn(
              "font-semibold rounded-full px-5 h-10 hover:bg-primary/10",
              isScrolled ? "text-gray-600 hover:text-primary" : "text-white/90 hover:text-white"
            )}>
              Explore
            </Button>
          </Link>
          <Link href="/articles">
            <Button variant="ghost" className={cn(
              "font-semibold rounded-full px-5 h-10 hover:bg-primary/10",
              isScrolled ? "text-gray-600 hover:text-primary" : "text-white/90 hover:text-white"
            )}>
              Insights
            </Button>
          </Link>
          
          <div className="w-px h-6 bg-gray-200/20 mx-2" />

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/messages">
                <Button variant="ghost" size="icon" className={cn(
                  "rounded-full h-10 w-10",
                  isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/90 hover:bg-white/10"
                )}>
                  <MessageSquare size={20} />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className={cn(
                  "rounded-full h-10 w-10",
                  isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/90 hover:bg-white/10"
                )}>
                  <LayoutDashboard size={20} />
                </Button>
              </Link>
              <Link href="/listings/new">
                <Button variant="default" className="rounded-full px-6 font-bold shadow-md shadow-primary/20 h-10">
                  <PlusCircle size={18} className="mr-2" />
                  List Service
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut} 
                className={cn(
                  "rounded-full h-10 w-10",
                  isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/90 hover:bg-white/10"
                )}
              >
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="rounded-full px-8 bg-accent hover:bg-accent/90 font-bold shadow-lg shadow-accent/20 h-11">
                <User size={18} className="mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn(
                "rounded-full w-12 h-12",
                isScrolled ? "text-gray-900" : "text-white"
              )}>
                <Menu size={28} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col p-8 rounded-l-[40px]">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Dumbbell className="text-white h-7 w-7" />
                </div>
                <span className="text-3xl font-headline font-bold text-gray-900">Zeedor</span>
              </div>
              <div className="flex flex-col gap-4 text-lg font-medium">
                <Link href="/listings" className="flex items-center gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Search size={20} /></div>
                  Explore Marketplace
                </Link>
                <Link href="/articles" className="flex items-center gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center"><BookOpen size={20} /></div>
                  Sports Insights
                </Link>
                {user ? (
                  <>
                    <Link href="/messages" className="flex items-center gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center"><MessageSquare size={20} /></div>
                      Messages
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center"><LayoutDashboard size={20} /></div>
                      My Dashboard
                    </Link>
                    <Separator className="my-4" />
                    <button 
                      onClick={handleSignOut} 
                      className="flex items-center gap-4 p-4 rounded-3xl hover:bg-red-50 text-red-600 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center"><LogOut size={20} /></div>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center gap-4 p-4 rounded-3xl bg-primary text-white mt-4 font-bold justify-center shadow-xl shadow-primary/20">
                    Sign In to Zeedor
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
