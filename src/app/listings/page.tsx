'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Search, Filter, MapPin, LayoutGrid, List, Loader2, X } from 'lucide-react';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useSearchParams, useRouter } from 'next/navigation';

const CATEGORIES = [
  'Coaches', 'Venues', 'Equipment', 'Events', 'Teams', 
  'Training Programs', 'Fitness Trainers', 'Physiotherapists', 
  'Nutritionists', 'Sports Transport', 'Accommodation', 'Repairs'
];

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoryFilter = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');

  const listingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    
    let q = query(
      collection(firestore, 'listings'),
      where('status', '==', 'active')
    );

    if (categoryFilter) {
      q = query(q, where('category', '==', categoryFilter));
    }

    // Note: In a real app, complex queries with multiple wheres and orders 
    // might require composite indexes. For MVP, we'll sort in memory if needed
    // or keep simple queries to avoid index errors.
    return q;
  }, [firestore, categoryFilter]);

  const { data: rawListings, isLoading } = useCollection(listingsQuery);

  // Filter and Sort in memory to avoid complex Firestore index requirements
  const listings = (rawListings || [])
    .filter(l => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return l.title.toLowerCase().includes(search) || 
             l.description?.toLowerCase().includes(search) ||
             l.location.toLowerCase().includes(search);
    })
    .sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });

  const clearFilters = () => {
    router.push('/listings');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Navbar />
      
      <div className="container px-4 mx-auto">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-headline font-bold mb-2">Explore Marketplace</h1>
              <p className="text-muted-foreground text-lg">Find everything you need for your sporting lifestyle.</p>
            </div>
            {categoryFilter && (
              <Badge variant="secondary" className="h-10 px-4 rounded-full text-sm flex gap-2 items-center bg-primary/10 text-primary border-none">
                Category: {categoryFilter}
                <button onClick={clearFilters} className="hover:bg-primary/20 rounded-full p-0.5">
                  <X size={14} />
                </button>
              </Badge>
            )}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter size={18} /> Filters
                </h3>
                <Button variant="link" size="sm" className="text-primary p-0 h-auto" onClick={clearFilters}>Clear All</Button>
              </div>

              <div className="space-y-8">
                <div>
                  <Label className="text-sm font-bold text-gray-900 mb-4 block">Categories</Label>
                  <div className="space-y-3">
                    {CATEGORIES.slice(0, 6).map(cat => (
                      <div 
                        key={cat} 
                        className="flex items-center space-x-2 cursor-pointer group"
                        onClick={() => router.push(`/listings?category=${encodeURIComponent(cat)}`)}
                      >
                        <Checkbox id={cat} checked={categoryFilter === cat} />
                        <label 
                          htmlFor={cat} 
                          className={`text-sm font-medium leading-none cursor-pointer transition-colors ${categoryFilter === cat ? 'text-primary font-bold' : 'text-muted-foreground group-hover:text-primary'}`}
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-bold text-gray-900 mb-4 block">Price Range</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select Price" />
                    </SelectTrigger>
                    <SelectContent>
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
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Search keywords..." 
                  className="pl-12 h-12 rounded-2xl border-gray-100 bg-gray-50 focus-visible:bg-white" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <Button 
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className={`h-10 w-10 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid size={18} />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className={`h-10 w-10 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                <p className="text-muted-foreground">Loading listings...</p>
              </div>
            ) : listings && listings.length > 0 ? (
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {listings.map((listing) => (
                  <ListingCard 
                    key={listing.id} 
                    id={listing.id}
                    title={listing.title}
                    category={listing.category}
                    price={`${listing.currency} ${listing.price}`}
                    rating={4.8}
                    image={listing.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/600/400'}
                    location={listing.location}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-xl font-bold text-gray-400 mb-2">No listings found</p>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
                <Button variant="outline" onClick={clearFilters}>Reset Filters</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
