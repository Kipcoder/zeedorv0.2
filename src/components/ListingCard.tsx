import React from 'react';
import Image from 'next/image';
import { Star, MapPin, Heart } from 'lucide-react';
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
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          data-ai-hint="sports listing"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-gray-900 border-none backdrop-blur-sm shadow-sm font-semibold">
            {category}
          </Badge>
        </div>
        <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors">
          <Heart size={20} />
        </button>
      </div>
      
      <CardContent className="p-5 flex-1">
        <div className="flex items-center gap-1 text-amber-500 mb-2">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-bold text-gray-700">{rating}</span>
        </div>
        <Link href={`/listings/${id}`}>
          <h3 className="text-lg font-headline font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <MapPin size={14} />
          <span className="line-clamp-1">{location}</span>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between mt-auto">
        <div>
          <span className="text-xl font-bold text-primary">{price}</span>
        </div>
        <Link href={`/listings/${id}`}>
          <Button variant="outline" size="sm" className="rounded-full px-4 border-primary text-primary hover:bg-primary hover:text-white font-semibold">
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
