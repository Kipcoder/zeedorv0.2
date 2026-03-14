
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
  ArrowRight,
  Trophy,
  Target,
  Activity,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
];

const sportHubs = [
  { 
    name: 'Football', 
    icon: Trophy, 
    color: 'bg-emerald-500', 
    image: 'https://picsum.photos/seed/football/600/400',
    links: ['Coaches', 'Venues', 'Teams']
  },
  { 
    name: 'Tennis', 
    icon: Activity, 
    color: 'bg-yellow-500', 
    image: 'https://picsum.photos/seed/tennis/600/400',
    links: ['Coaches', 'Venues', 'Training Programs']
  },
  { 
    name: 'Basketball', 
    icon: Target, 
    color: 'bg-orange-500', 
    image: 'https://picsum.photos/seed/basketball/600/400',
    links: ['Coaches', 'Venues', 'Equipment']
  },
];

const featuredListings = [
  {
    id: '1',
    title: 'Elite Tennis Coaching with Alex',
    category: 'Tennis Coaches',
    price: '$60/hr',
    rating: 4.9,
    image: 'https://picsum.photos/seed/21/600/400',
    location: 'Central Park Courts',
  },
  {
    id: '2',
    title: 'Modern Soccer Stadium Rental',
    category: 'Football Venues',
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
    category: 'Basketball Programs',
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
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/12/1200/600" 
            alt="Sports Hero" 
            fill 
            className="object-cover brightness-[0.4]"
            priority
            data-ai-hint="sports athlete"
          />
        </div>
        
        <div className="container relative z-10 px-4 mx-auto text-center text-white">
          <Badge className="mb-6 bg-accent/20 backdrop-blur-md text-white border-accent/30 px-4 py-1.5 text-sm">
            The World's Largest Sports Marketplace
          </Badge>
          <h1 className="mb-6 text-6xl md:text-8xl font-headline font-bold tracking-tight">
            Find Your <span className="text-accent italic">Perfect</span> Match
          </h1>
          <p className="max-w-2xl mx-auto mb-12 text-lg md:text-2xl text-blue-50/80 font-medium">
            Discover elite coaches, professional venues, and quality gear for over 50+ sports.
          </p>
          
          <div className="max-w-4xl mx-auto bg-white p-2 rounded-[32px] shadow-2xl flex flex-col md:flex-row gap-2 border border-white/20">
            <div className="flex-1 flex items-center px-6 gap-3 border-r border-gray-100">
              <Search className="text-primary h-5 w-5" />
              <Input 
                placeholder="Coaches, venues, gear..." 
                className="border-none shadow-none focus-visible:ring-0 text-gray-800 text-lg h-14 placeholder:text-gray-400"
              />
            </div>
            <div className="flex-1 flex items-center px-6 gap-3">
              <MapPin className="text-primary h-5 w-5" />
              <Input 
                placeholder="Anywhere" 
                className="border-none shadow-none focus-visible:ring-0 text-gray-800 text-lg h-14 placeholder:text-gray-400"
              />
            </div>
            <Link href="/listings">
              <Button size="lg" className="rounded-[24px] px-10 h-16 text-lg font-bold w-full md:w-auto shadow-xl shadow-primary/20">
                Explore
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sports Hubs Section - Categories by Sport */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold mb-3 uppercase tracking-widest text-sm">
                <Trophy size={18} />
                <span>Featured Hubs</span>
              </div>
              <h2 className="text-4xl font-headline font-bold">Categories by Sport</h2>
              <p className="text-muted-foreground text-lg">Explore everything you need for your specific discipline</p>
            </div>
            <Link href="/listings">
              <Button variant="outline" className="rounded-full font-bold group">
                All Sports <ChevronRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sportHubs.map((hub) => (
              <div key={hub.name} className="group relative bg-gray-900 rounded-[40px] overflow-hidden shadow-xl aspect-[4/5] md:aspect-auto md:h-[500px]">
                <Image 
                  src={hub.image} 
                  alt={hub.name} 
                  fill 
                  className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <div className={`w-14 h-14 ${hub.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <hub.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-4xl font-headline font-bold text-white mb-6">{hub.name}</h3>
                  
                  <div className="flex flex-col gap-3">
                    {hub.links.map(cat => (
                      <Link 
                        key={cat} 
                        href={`/listings?sport=${hub.name}&category=${cat}`}
                        className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white hover:text-black transition-all group/link"
                      >
                        <span className="font-bold">{cat}</span>
                        <ChevronRight size={16} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <RecommendationSection />

      {/* Service Categories Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container px-4 mx-auto">
          <div className="mb-12">
             <div className="flex items-center gap-2 text-accent font-bold mb-3 uppercase tracking-widest text-sm">
                <Activity size={18} />
                <span>Browse All Services</span>
              </div>
            <h2 className="text-4xl font-headline font-bold mb-3">Professional Services</h2>
            <p className="text-muted-foreground text-lg">Expert help across every sporting category</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.name} name={cat.name} icon={cat.icon} color={cat.color} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-headline font-bold mb-3">Top-Rated Providers</h2>
              <p className="text-muted-foreground text-lg">The most popular services currently on the marketplace</p>
            </div>
            <Link href="/listings">
              <Button className="rounded-full px-8 h-12 font-bold">Explore All</Button>
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
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-accent opacity-20 rounded-full blur-[100px]"></div>
        <div className="container px-4 mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-8">
            Built by Athletes, <br className="hidden md:block" /> For Athletes.
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed opacity-80">
            Whether you're a weekend warrior or a professional, Zeedor connects you with the elite services you need to succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/listings/new">
              <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 text-xl font-bold shadow-2xl">
                Join as a Provider
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-xl font-bold bg-transparent text-white border-white hover:bg-white/10">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-gray-900 text-gray-400">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Dumbbell className="text-white h-7 w-7" />
                </div>
                <span className="text-3xl font-headline font-bold text-white tracking-tight">Zeedor</span>
              </div>
              <p className="mb-8 leading-relaxed text-lg">
                Empowering athletes and providers through a unified sports marketplace ecosystem.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-8 text-lg">Marketplace</h4>
              <ul className="space-y-4">
                <li><Link href="/listings" className="hover:text-primary transition-colors">Find a Coach</Link></li>
                <li><Link href="/listings" className="hover:text-primary transition-colors">Book a Venue</Link></li>
                <li><Link href="/listings" className="hover:text-primary transition-colors">Join a Team</Link></li>
                <li><Link href="/listings" className="hover:text-primary transition-colors">Sports Equipment</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-8 text-lg">Top Sports</h4>
              <ul className="space-y-4">
                <li><Link href="/listings?sport=Football" className="hover:text-primary transition-colors">Football</Link></li>
                <li><Link href="/listings?sport=Basketball" className="hover:text-primary transition-colors">Basketball</Link></li>
                <li><Link href="/listings?sport=Tennis" className="hover:text-primary transition-colors">Tennis</Link></li>
                <li><Link href="/listings?sport=Swimming" className="hover:text-primary transition-colors">Swimming</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-8 text-lg">Support</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Safety Hub</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-800 text-center">
            <p className="text-sm">© 2024 Zeedor Marketplace. Engineered for Excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
