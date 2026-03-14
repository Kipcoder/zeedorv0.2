
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
}

export default function CategoryCard({ name, icon: Icon, color }: CategoryCardProps) {
  return (
    <Link href={`/listings?category=${encodeURIComponent(name)}`} className="group">
      <div className="flex flex-col items-center p-8 bg-white rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 border border-gray-100/50 h-full">
        <div className={cn(
          "w-20 h-20 rounded-[28px] flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-6 shadow-lg",
          color
        )}>
          <Icon size={36} />
        </div>
        <h3 className="font-headline font-bold text-center text-lg text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Browse All
        </p>
      </div>
    </Link>
  );
}
