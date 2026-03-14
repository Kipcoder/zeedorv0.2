
'use client';

import React from 'react';
import Image from 'next/image';
import { Star, MapPin, Heart, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ListingCardProps {
  id: string;
  title: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  location: string;
}

export default function ListingCard({ id, title, category, price, rating, image, location }: ListingCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full bg-white rounded-[40px] border border-gray-100/50">
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          data-ai-hint="sports listing"
        />
        <div className="absolute top-5 left-5">
          <Badge className="bg-white/90 text-gray-900 border-none backdrop-blur-md shadow-sm font-bold px-4 py-1.5 rounded-2xl">
            {category}
          </Badge>
        </div>
        <button className="absolute top-5 right-5 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-2xl text-white transition-all transform hover:scale-110">
          <Heart size={20} />
        </button>
      </div>
      
      <CardContent className="p-8 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-lg text-sm">
            <Star size={14} fill="currentColor" className="mr-1" />
            {rating}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin size={14} className="text-primary/60" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        <Link href={`/listings/${id}`}>
          <h3 className="text-2xl font-headline font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer leading-tight">
            {title}
          </h3>
        </Link>
      </CardContent>
      
      <CardFooter className="px-8 pb-8 pt-0 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground font-medium">Price starting at</span>
          <span className="text-2xl font-bold text-primary">{price}</span>
        </div>
        <Link href={`/listings/${id}`}>
          <Button variant="outline" size="lg" className="rounded-2xl px-6 border-gray-100 hover:border-primary hover:bg-primary hover:text-white font-bold transition-all group/btn">
            Details
            <ArrowRight size={18} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
