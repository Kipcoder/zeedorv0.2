
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
}

export default function CategoryCard({ name, icon: Icon, color }: CategoryCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", color)}>
          <Icon size={28} />
        </div>
        <h3 className="font-semibold text-center text-sm md:text-base text-gray-800 line-clamp-1">{name}</h3>
      </div>
    </div>
  );
}
