
'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { personalizeListingRecommendations, type PersonalizedListingRecommendationsOutput } from '@/ai/flows/personalized-listing-recommendations-flow';
import { Badge } from '@/components/ui/badge';

export default function RecommendationSection() {
  const [recommendations, setRecommendations] = useState<PersonalizedListingRecommendationsOutput['recommendations']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecs() {
      try {
        const result = await personalizeListingRecommendations({
          userProfile: {
            sportsInterests: ['Tennis', 'Basketball'],
            location: 'New York, NY',
            skillLevel: 'Intermediate',
          },
          searchHistory: ['Tennis courts near me', 'Basketball coaching'],
        });
        setRecommendations(result.recommendations);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecs();
  }, []);

  return (
    <section className="py-20 bg-blue-50/50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent font-bold mb-2 uppercase tracking-wider text-sm">
              <Sparkles size={18} />
              <span>AI Powered</span>
            </div>
            <h2 className="text-3xl font-headline font-bold">Personalized For You</h2>
            <p className="text-muted-foreground">Tailored recommendations based on your activity</p>
          </div>
          <Button variant="outline" className="rounded-full self-start">Update Interests</Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-blue-100 shadow-sm">
            <Loader2 className="animate-spin text-primary mb-4" size={32} />
            <p className="text-gray-500 font-medium">Curating your sports journey...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-blue-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Sparkles size={120} />
                </div>
                
                <Badge className="mb-4 bg-primary/10 text-primary border-none text-xs px-3 py-1 font-bold">
                  {rec.category}
                </Badge>
                <h3 className="text-xl font-headline font-bold mb-3 group-hover:text-primary transition-colors">{rec.name}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed">
                  {rec.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                   <div className="flex items-center gap-1">
                      <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-accent" style={{ width: `${rec.relevanceScore * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-accent">{(rec.relevanceScore * 100).toFixed(0)}% Match</span>
                   </div>
                   <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                      View <ChevronRight size={14} className="ml-1" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
