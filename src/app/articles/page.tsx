
'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2, BookOpen } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';

export default function ArticlesPage() {
  const firestore = useFirestore();

  const articlesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), orderBy('publishedAt', 'desc'));
  }, [firestore]);

  const { data: articles, isLoading } = useCollection(articlesQuery);

  // Mock articles for initial presentation if database is empty
  // Use static date strings to prevent hydration mismatch errors
  const mockArticles = [
    {
      id: 'art-1',
      title: 'Top 10 Recovery Tips for Marathon Runners',
      excerpt: 'Recovery is just as important as the run itself. Learn the best strategies to bounce back after your big race...',
      category: 'Training',
      authorName: 'Sarah Jenkins',
      publishedAt: '2024-05-20T10:00:00.000Z',
      imageUrl: 'https://picsum.photos/seed/train/600/400'
    },
    {
      id: 'art-2',
      title: 'The Ultimate Guide to Sports Nutrition',
      excerpt: 'Fueling your body correctly can be the difference between a podium finish and a DNF. We break down the macros...',
      category: 'Nutrition',
      authorName: 'Dr. Mike Ross',
      publishedAt: '2024-05-19T10:00:00.000Z',
      imageUrl: 'https://picsum.photos/seed/nutri/600/400'
    },
    {
      id: 'art-3',
      title: 'Mental Toughness: Winning the Game in Your Head',
      excerpt: 'Sports are 90% mental. Discover how elite athletes prepare their minds for high-pressure competition situations...',
      category: 'Mindset',
      authorName: 'Coach Carter',
      publishedAt: '2024-05-18T10:00:00.000Z',
      imageUrl: 'https://picsum.photos/seed/mind/600/400'
    }
  ];

  const displayArticles = (articles && articles.length > 0) ? articles : mockArticles;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <Navbar />
      
      <div className="container px-4 mx-auto">
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-6">
            <BookOpen size={32} />
          </div>
          <h1 className="text-5xl font-headline font-bold mb-4">Sports Insights</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Expert advice, training guides, and the latest news from the global sports community.
          </p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="text-muted-foreground font-medium">Loading articles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayArticles.map((article) => (
              <ArticleCard 
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                category={article.category}
                author={article.authorName}
                date={article.publishedAt}
                image={article.imageUrl || 'https://picsum.photos/seed/placeholder/600/400'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
