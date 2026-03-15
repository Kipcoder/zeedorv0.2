'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Calendar, User, Share2, Bookmark, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const id = params.id as string;
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  const docRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'articles', id);
  }, [firestore, id]);

  const { data: article, isLoading } = useDoc(docRef);

  // Mock data for initial presentation if not in DB
  const mockArticles: Record<string, any> = {
    'art-1': {
      title: 'Top 10 Recovery Tips for Marathon Runners',
      content: 'Recovery is the often-overlooked secret weapon of elite runners. After a grueling 26.2 miles, your body is in a state of high stress. Inflammation is peaking, glycogen stores are depleted, and micro-tears in muscle fiber need urgent repair.\n\nFirst, prioritize hydration with electrolytes. Water alone is not enough to replace what you lost. Second, focus on high-quality protein within the first 60 minutes to kickstart muscle repair. Third, dont underestimate the power of sleep—this is when your growth hormones peak.\n\nLastly, gentle movement like walking or swimming in the days following the race can actually speed up recovery by increasing flow without the impact of running.',
      category: 'Training',
      authorName: 'Sarah Jenkins',
      publishedAt: '2024-05-20T10:00:00.000Z',
      imageUrl: 'https://picsum.photos/seed/train/1200/600'
    },
    'art-2': {
      title: 'The Ultimate Guide to Sports Nutrition',
      content: 'Nutrition is more than just counting calories. For athletes, it is about timing and quality. Complex carbohydrates provide the sustained energy needed for long sessions, while fats are essential for hormone production and long-term energy stores.\n\nPre-workout meals should be easily digestible and rich in carbs. During exercise longer than 90 minutes, supplemental glucose can prevent "bonking." Post-workout, a 3:1 ratio of carbs to protein is ideal for restoring energy and repairing tissue.',
      category: 'Nutrition',
      authorName: 'Dr. Mike Ross',
      publishedAt: '2024-05-19T10:00:00.000Z',
      imageUrl: 'https://picsum.photos/seed/nutri/1200/600'
    }
  };

  const activeArticle = article || mockArticles[id];

  useEffect(() => {
    if (activeArticle?.publishedAt) {
      setFormattedDate(new Date(activeArticle.publishedAt).toLocaleDateString());
    }
  }, [activeArticle]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  if (!activeArticle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <Link href="/articles"><Button className="rounded-xl">Back to Insights</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <Navbar />
      
      <div className="container px-4 mx-auto max-w-4xl">
        <button onClick={() => router.back()} className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Insights
        </button>

        <header className="mb-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-none px-4 py-1.5 font-bold uppercase tracking-widest text-xs">
            {activeArticle.category}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-bold leading-tight mb-8">
            {activeArticle.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 border-y border-gray-100 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold">
                {activeArticle.authorName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{activeArticle.authorName}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {formattedDate || '...'}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> 6 min read</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full"><Share2 size={18} /></Button>
              <Button variant="outline" size="icon" className="rounded-full"><Bookmark size={18} /></Button>
            </div>
          </div>
        </header>

        <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl mb-12">
          <Image 
            src={activeArticle.imageUrl || 'https://picsum.photos/seed/placeholder/1200/600'} 
            alt={activeArticle.title} 
            fill 
            className="object-cover"
          />
        </div>
