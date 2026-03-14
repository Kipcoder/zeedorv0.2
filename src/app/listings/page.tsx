
'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Search, Filter, SlidersHorizontal, MapPin, Calendar, LayoutGrid, List } from 'lucide-react';
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

const dummyListings = [
  { id: '1', title: 'Elite Tennis Coaching', category: 'Coaches', price: '$60/hr', rating: 4.9, image: 'https://picsum.photos/seed/21/600/400', location: 'New York, NY' },
  { id: '2', title: 'Soccer Field Rental', category: 'Venues', price: '$120/hr', rating: 4.8, image: 'https://picsum.photos/seed/32/600/400', location: 'Brooklyn, NY' },
  { id: '3', title: 'Basketball Pro Gear', category: 'Equipment', price: '$45/day', rating: 4.7, image: 'https://picsum.photos/seed/43/600/400', location: 'Queens, NY' },
  { id: '4', title: 'Triathlon Training', category: 'Training Programs', price: '$150/mo', rating: 5.0, image: 'https://picsum.photos/seed/65/600/400', location: 'Jersey City, NJ' },
  { id: '5', title: 'Sports Physical Therapy', category: 'Physiotherapists', price: '$90/session', rating: 4.9, image: 'https://picsum.photos/seed/76/600/400', location: 'Manhattan, NY' },
  { id: '6', title: 'Running Club Event', category: 'Events', price: 'Free', rating: 4.6, image: 'https://picsum.photos/seed/54/600/400', location: 'Central Park, NY' },
];

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Navbar />
      
      <div className="container px-4 mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-headline font-bold mb-4">Explore Marketplace</h1>
          <p className="text-muted-foreground text-lg">Find everything you need for your sporting lifestyle.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter size={18} /> Filters
                </h3>
                <Button variant="link" size="sm" className="text-primary p-0 h-auto">Clear All</Button>
              </div>

              <div className="space-y-8">
                <div>
                  <Label className="text-sm font-bold text-gray-900 mb-4 block">Categories</Label>
                  <div className="space-y-3">
                    {['Coaches', 'Venues', 'Equipment', 'Events', 'Training'].map(cat => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox id={cat} />
                        <label htmlFor={cat} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                      <SelectItem value="low">Under $50</SelectItem>
                      <SelectItem value="mid">$50 - $150</SelectItem>
                      <SelectItem value="high">Over $150</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-bold text-gray-900 mb-4 block">Rating</Label>
                  <div className="space-y-3">
                    {[5, 4, 3].map(star => (
                      <div key={star} className="flex items-center space-x-2">
                        <Checkbox id={`star-${star}`} />
                        <label htmlFor={`star-${star}`} className="text-sm font-medium leading-none">
                          {star} Stars & Up
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-10 rounded-xl h-12 text-base font-bold">Apply Filters</Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Sort Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Search keywords..." className="pl-12 h-12 rounded-2xl border-gray-100 bg-gray-50 focus-visible:bg-white" />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <Button 
                    variant={viewMode === 'grid' ? 'white' : 'ghost'} 
                    size="icon" 
                    className={`h-10 w-10 rounded-lg ${viewMode === 'grid' ? 'shadow-sm' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid size={18} />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'white' : 'ghost'} 
                    size="icon" 
                    className={`h-10 w-10 rounded-lg ${viewMode === 'list' ? 'shadow-sm' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={18} />
                  </Button>
                </div>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[160px] h-12 rounded-2xl">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Listings Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {dummyListings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center items-center gap-4">
              <Button variant="outline" disabled className="rounded-xl px-6 h-12 font-bold">Previous</Button>
              <div className="flex gap-2">
                <Button variant="secondary" className="rounded-xl w-12 h-12 font-bold">1</Button>
                <Button variant="ghost" className="rounded-xl w-12 h-12 font-bold">2</Button>
                <Button variant="ghost" className="rounded-xl w-12 h-12 font-bold">3</Button>
              </div>
              <Button variant="outline" className="rounded-xl px-6 h-12 font-bold border-primary text-primary">Next</Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
