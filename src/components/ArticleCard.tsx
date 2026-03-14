
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
}

export default function ArticleCard({ id, title, excerpt, category, author, date, image }: ArticleCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white rounded-[32px]">
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-primary text-white border-none font-bold">
            {category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 flex-1">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={12} />
            <span>{author}</span>
          </div>
        </div>
        
        <Link href={`/articles/${id}`}>
          <h3 className="text-xl font-headline font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0 mt-auto">
        <Link href={`/articles/${id}`} className="text-primary font-bold text-sm flex items-center gap-2 group/link">
          Read More
          <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
