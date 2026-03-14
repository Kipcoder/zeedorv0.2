
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Dumbbell, 
  TrendingUp, 
  HeartPulse, 
  Stethoscope, 
  Apple, 
  Bus, 
  Bed, 
  Wrench, 
  UserCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import ListingCard from '@/components/ListingCard';
import RecommendationSection from '@/components/RecommendationSection';

const categories = [
  { name: 'Coaches', icon: UserCircle, color: 'bg-blue-100 text-blue-600' },
  { name: 'Venues', icon: MapPin, color: 'bg-green-100 text-green-600' },
  { name: 'Equipment', icon: Dumbbell, color: 'bg-orange-100 text-orange-600' },
  { name: 'Events', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
  { name: 'Teams', icon: Users, color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Training Programs', icon: TrendingUp, color: 'bg-pink-100 text-pink-600' },
  { name: 'Fitness Trainers', icon: HeartPulse, color: 'bg-red-100 text-red-600' },
  { name: 'Physiotherapists', icon: Stethoscope, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Nutritionists', icon: Apple, color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Sports Transport', icon: Bus, color: 'bg-amber-100 text-amber-600' },
  { name: 'Accommodation', icon: Bed, color: 'bg-slate-100 text-slate-600' },
  { name: 'Repairs', icon: Wrench, color: 'bg-gray-100 text-gray-600' },
];

const featuredListings = [
  {
    id: '1',
    title: 'Elite Tennis Coaching with Alex',
    category: 'Coaches',
    price: '$60/hr',
    rating: 4.9,
    image: 'https://picsum.photos/seed/21/600/400',
    location: 'Central Park Courts',
  },
  {
    id: '2',
    title: 'Modern Soccer Stadium Rental',
    category: 'Venues',
    price: '$120/session',
    rating: 4.8,
    image: 'https://picsum.photos/seed/32/600/400',
    location: 'Westside Sports Complex',
  },
  {
    id: '3',
    title: 'Professional Recovery Massage',
    category: 'Physiotherapists',
    price: '$85/hr',
    rating: 5.0,
    image: 'https://picsum.photos/seed/76/600/400',
    location: 'Wellness Center',
  },
  {
    id: '4',
    title: 'Premium Basketball Training',
    category: 'Training Programs',
    price: '$45/hr',
    rating: 4.7,
    image: 'https://picsum.photos/seed/65/600/400',
    location: 'Downtown Gym',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/12/1200/600" 
            alt="Sports Hero" 
            fill 
            className="object-cover brightness-50"
            priority
            data-ai-hint="sports athlete"
          />
        </div>
        
        <div className="container relative z-10 px-4 mx-auto text-center text-white">
          <h1 className="mb-6 text-5xl md:text-7xl font-headline font-bold tracking-tight">
            Elevate Your <span className="text-accent">Game</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl text-blue-50 font-medium">
            Discover the ultimate sports marketplace. Connect with expert coaches, find premium venues, join elite teams, and access top-tier sports services.
          </p>
          
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 gap-2 border-r border-gray-100">
              <Search className="text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search for coaches, venues, equipment..." 
                className="border-none shadow-none focus-visible:ring-0 text-gray-800"
              />
            </div>
            <div className="flex-1 flex items-center px-4 gap-2">
              <MapPin className="text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Where?" 
                className="border-none shadow-none focus-visible:ring-0 text-gray-800"
              />
            </div>
            <Button size="lg" className="rounded-xl px-8 font-semibold text-base">
              Explore Now
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Browse by Category</h2>
              <p className="text-muted-foreground">Everything you need for your sporting journey</p>
            </div>
            <Button variant="ghost" className="hidden md:flex gap-2">
              View all categories <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.name} name={cat.name} icon={cat.icon} color={cat.color} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <RecommendationSection />

      {/* Featured Listings */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">Top-rated services and products selected for you</p>
            </div>
            <Link href="/listings">
              <Button variant="outline" className="rounded-full px-6">Explore All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-accent opacity-20 rounded-full blur-3xl"></div>
        <div className="container px-4 mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-white mb-6">
            Are you a sports service provider?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of coaches, venue owners, and specialists who grow their business with SportSphere.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-lg font-bold">
              List Your Service
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg font-bold bg-transparent text-white border-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Dumbbell className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-headline font-bold text-white tracking-tight">SportSphere</span>
            </div>
            <p className="mb-6 leading-relaxed">
              Empowering athletes and providers through a unified sports marketplace ecosystem.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Marketplace</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-primary transition-colors">Find a Coach</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Book a Venue</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Join a Team</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Sports Equipment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Partnerships</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Safety Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="container px-4 mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
          <p>© 2024 SportSphere Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
