'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
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
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    // Defer date formatting until after hydration to avoid mismatches
    if (date) {
      setFormattedDate(new Date(date).toLocaleDateString());
    }
  }, [date]);

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full bg-white rounded-[40px] border border-gray-100/50">
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-5 left-5">
          <Badge className="bg-primary/90 text-white border-none font-bold px-4 py-1.5 rounded-2xl backdrop-blur-md">
            {category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-8 flex-1">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-primary/60" />
            <span>{formattedDate || '...'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary/60" />
            <span>6 min read</span>
          </div>
        </div>
        
        <Link href={`/articles/${id}`}>
          <h3 className="text-2xl font-headline font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer leading-tight">
            {title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-lg line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="px-8 pb-8 pt-0 mt-auto">
        <div className="w-full flex items-center justify-between border-t border-gray-50 pt-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
               {author.charAt(0)}
             </div>
             <span className="text-sm font-bold text-gray-700">{author}</span>
          </div>
          <Link href={`/articles/${id}`} className="text-primary font-bold text-sm flex items-center gap-2 group/link">
            Read More
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-all group-hover/link:bg-primary group-hover/link:text-white">
              <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
