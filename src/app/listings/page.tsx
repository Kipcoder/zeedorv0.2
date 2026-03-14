
'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Search, Filter, LayoutGrid, List, Loader2, X, ArrowUpDown, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import ListingCard from '@/components/ListingCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useSearchParams, useRouter } from 'next/navigation';

const CATEGORIES = [
  'Coaches', 'Venues', 'Equipment', 'Events', 'Teams', 
  'Training Programs', 'Fitness Trainers', 'Physiotherapists', 
  'Nutritionists', 'Sports Transport', 'Accommodation', 'Repairs'
];

const SPORTS = [
  'Football', 'Basketball', 'Tennis', 'Swimming', 'Yoga', 'Cricket', 
  'Golf', 'Volleyball', 'Running', 'Cycling', 'Martial Arts', 'Boxing'
];

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoryFilter = searchParams.get('category');
  const sportFilter = searchParams.get('sport');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const listingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    
    let q = query(
      collection(firestore, 'listings'),
      where('status', '==', 'active')
    );

    // Note: We avoid complex server-side filtering (where + where) without indexes.
    // We'll perform one basic filter on server and others in memory for robustness.
    if (categoryFilter) {
      q = query(q, where('category', '==', categoryFilter));
    } else if (sportFilter) {
      q = query(q, where('sport', '==', sportFilter));
    }

    return q;
  }, [firestore, categoryFilter, sportFilter]);

  const { data: rawListings, isLoading } = useCollection(listingsQuery);

  // Advanced Memory Filtering & Sorting
  const listings = (rawListings || [])
    .filter(l => {
      // 1. Search Term Filter
      const search = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        l.title.toLowerCase().includes(search) || 
        l.description?.toLowerCase().includes(search) ||
        l.location.toLowerCase().includes(search);

      // 2. Cross-filter (if category was used for server query, filter sport in memory and vice-versa)
      let matchesCategory = true;
      if (categoryFilter) matchesCategory = l.category === categoryFilter;
      
      let matchesSport = true;
      if (sportFilter) matchesSport = l.sport === sportFilter;

      // 3. Price Range Filter
      let matchesPrice = true;
      const price = parseFloat(l.price) || 0;
      if (priceRange === 'low') matchesPrice = price < 50;
      else if (priceRange === 'mid') matchesPrice = price >= 50 && price <= 150;
      else if (priceRange === 'high') matchesPrice = price > 150;

      return matchesSearch && matchesPrice && matchesCategory && matchesSport;
    })
    .sort((a, b) => {
      // 4. Sorting Logic
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      
      // Default: Newest
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });

  const clearFilters = () => {
    router.push('/listings');
    setSearchTerm('');
    setPriceRange('all');
    setSortBy('newest');
  };

  const handleCategoryToggle = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryFilter === cat) {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`/listings?${params.toString()}`);
  };

  const handleSportToggle = (sport: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sportFilter === sport) {
      params.delete('sport');
    } else {
      params.set('sport', sport);
    }
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/30 pt-24 pb-20">
      <Navbar />
      
      <div className="container px-4 mx-auto">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-headline font-bold mb-2">Sports Marketplace</h1>
              <p className="text-muted-foreground text-lg">Discover elite services, venues, and equipment.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryFilter && (
                <Badge variant="secondary" className="h-10 px-4 rounded-xl text-sm flex gap-2 items-center bg-primary/10 text-primary border-none">
                  {categoryFilter}
                  <button onClick={() => handleCategoryToggle(categoryFilter)} className="hover:bg-primary/20 rounded-full p-0.5">
                    <X size={14} />
                  </button>
                </Badge>
              )}
              {sportFilter && (
                <Badge variant="secondary" className="h-10 px-4 rounded-xl text-sm flex gap-2 items-center bg-emerald-100 text-emerald-700 border-none">
                  <Trophy size={14} className="mr-1" />
                  {sportFilter}
                  <button onClick={() => handleSportToggle(sportFilter)} className="hover:bg-emerald-200 rounded-full p-0.5 ml-1">
                    <X size={14} />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm sticky top-28 space-y-8 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter size={18} /> Filters
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary font-bold hover:bg-primary/5 p-0 h-auto" 
                  onClick={clearFilters}
                >
                  Reset
                </Button>
              </div>

              <div className="space-y-8">
                <div>
                  <Label className="text-xs font-bold text-gray-900 mb-4 block uppercase tracking-widest">By Sport</Label>
                  <div className="space-y-3">
                    {SPORTS.map(sport => (
                      <div 
                        key={sport} 
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => handleSportToggle(sport)}
                      >
                        <Checkbox 
                          id={`sport-${sport}`} 
                          checked={sportFilter === sport} 
                          className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label 
                          htmlFor={`sport-${sport}`} 
                          className={`text-sm font-medium leading-none cursor-pointer transition-colors ${sportFilter === sport ? 'text-primary font-bold' : 'text-muted-foreground group-hover:text-primary'}`}
                        >
                          {sport}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div>
                  <Label className="text-xs font-bold text-gray-900 mb-4 block uppercase tracking-widest">By Service</Label>
                  <div className="space-y-3">
                    {CATEGORIES.map(cat => (
                      <div 
                        key={cat} 
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => handleCategoryToggle(cat)}
                      >
                        <Checkbox 
                          id={`cat-${cat}`} 
                          checked={categoryFilter === cat} 
                          className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label 
                          htmlFor={`cat-${cat}`} 
                          className={`text-sm font-medium leading-none cursor-pointer transition-colors ${categoryFilter === cat ? 'text-primary font-bold' : 'text-muted-foreground group-hover:text-primary'}`}
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div>
                  <Label className="text-xs font-bold text-gray-900 mb-4 block uppercase tracking-widest">Price Range</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="rounded-xl h-12 border-gray-100 bg-gray-50/50">
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100">
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">Under $50</SelectItem>
                      <SelectItem value="mid">$50 - $150</SelectItem>
                      <SelectItem value="high">Over $150</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Sort Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Search by title, location, or keyword..." 
                  className="pl-12 h-14 rounded-2xl border-none bg-gray-50 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary/20 text-base" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex w-full md:w-auto items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[180px] h-14 rounded-2xl border-none bg-gray-50 gap-2">
                    <ArrowUpDown size={16} className="text-gray-400" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-100">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex bg-gray-100 p-1 rounded-2xl">
                  <Button 
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className={`h-12 w-12 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid size={20} />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className={`h-12 w-12 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between px-2">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{listings.length}</span> results
              </p>
            </div>

            {/* Listings Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-muted-foreground font-medium">Updating marketplace...</p>
              </div>
            ) : listings.length > 0 ? (
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {listings.map((listing) => (
                  <ListingCard 
                    key={listing.id} 
                    id={listing.id}
                    title={listing.title}
                    category={`${listing.sport} ${listing.category}`}
                    price={`${listing.currency} ${listing.price}`}
                    rating={4.8}
                    image={listing.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/600/400'}
                    location={listing.location}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200 shadow-sm">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-gray-900 mb-2">No matching listings</h3>
                <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Try adjusting your filters or searching for something else.</p>
                <Button 
                  onClick={clearFilters}
                  className="rounded-full px-10 h-12 font-bold shadow-lg shadow-primary/10"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
