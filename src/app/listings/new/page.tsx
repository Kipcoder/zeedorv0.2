'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Sparkles, 
  ArrowLeft, 
  Loader2, 
  Plus, 
  X, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { generateListingDescription } from '@/ai/flows/listing-description-assistant-flow';

const categories = [
  'Coaches', 'Venues', 'Equipment', 'Events', 'Teams', 
  'Training Programs', 'Fitness Trainers', 'Physiotherapists', 
  'Nutritionists', 'Sports Transport', 'Accommodation', 'Repairs'
];

export default function NewListingPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    currency: 'USD',
    location: '',
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleAiEnhance = async () => {
    if (!formData.title || !formData.category) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please provide a title and category first so the AI knows what to write about.',
      });
      return;
    }

    setAiEnhancing(true);
    try {
      const result = await generateListingDescription({
        title: formData.title,
        category: formData.category,
        keyFeatures: formData.tags.join(', ') || 'Professional sports service',
        targetAudience: 'Athletes and sports enthusiasts',
        existingDescription: formData.description,
        location: formData.location,
      });
      
      setFormData({ ...formData, description: result.description });
      toast({
        title: 'Description Enhanced!',
        description: 'AI has successfully refined your listing details.',
      });
    } catch (error) {
      console.error('AI Error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Enhancement Failed',
        description: 'We couldn\'t generate a description right now. Please try again.',
      });
    } finally {
      setAiEnhancing(false);
    }
  };

  const handleSubmit = async (status: 'active' | 'draft') => {
    if (!user || !firestore) return;
    
    if (!formData.title || !formData.category || !formData.price || !formData.location) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all required fields marked with *',
      });
      return;
    }

    setLoading(true);

    try {
      const listingsRef = collection(firestore, 'listings');
      const listingData = {
        providerId: user.uid,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        location: formData.location,
        tags: formData.tags,
        status: status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        imageUrls: [`https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/600/400`], // Placeholder
      };

      addDocumentNonBlocking(listingsRef, listingData);
      
      toast({
        title: status === 'active' ? 'Listing Published!' : 'Draft Saved!',
        description: 'Your service is now being processed.',
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Submit Error:', error);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full p-8 text-center rounded-3xl border-none shadow-xl">
           <Info className="mx-auto h-12 w-12 text-primary mb-4" />
           <h2 className="text-2xl font-headline font-bold mb-2">Sign In Required</h2>
           <p className="text-muted-foreground mb-6">You need to be logged in to create a listing on Zeedor.</p>
           <Link href="/login">
             <Button className="w-full h-12 rounded-xl font-bold">Sign In Now</Button>
           </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <Navbar />
      
      <div className="container px-4 mx-auto max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <header>
              <h1 className="text-4xl font-headline font-bold mb-2">Create New Service</h1>
              <p className="text-muted-foreground">Fill in the details below to list your sports service on the Zeedor marketplace.</p>
            </header>

            <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100 p-8">
                <CardTitle className="text-xl font-headline font-bold">General Information</CardTitle>
                <CardDescription>Basic details about what you are offering.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="font-bold">Listing Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Pro Tennis Coaching for Beginners" 
                    className="h-12 rounded-xl"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category" className="font-bold">Category *</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description" className="font-bold">Description</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-accent hover:text-accent font-bold gap-1 h-8 rounded-lg"
                      onClick={handleAiEnhance}
                      disabled={aiEnhancing}
                    >
                      {aiEnhancing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      AI Assist
                    </Button>
                  </div>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your service in detail..." 
                    className="min-h-[200px] rounded-xl"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100 p-8">
                <CardTitle className="text-xl font-headline font-bold">Pricing & Location</CardTitle>
                <CardDescription>How much and where is this service available?</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="price" className="font-bold">Price *</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                      <Input 
                        id="price" 
                        type="number" 
                        placeholder="0.00" 
                        className="pl-8 h-12 rounded-xl"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location" className="font-bold">Location *</Label>
                    <Input 
                      id="location" 
                      placeholder="e.g. Downtown Stadium, NY" 
                      className="h-12 rounded-xl"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="font-bold">Tags & Highlights</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a tag (e.g. Indoor, Weekend)" 
                      className="h-12 rounded-xl"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button type="button" variant="outline" className="h-12 px-6 rounded-xl" onClick={handleAddTag}>
                      <Plus size={20} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} className="pl-3 pr-1 py-1 rounded-full bg-primary/10 text-primary border-none text-sm group">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-2 p-1 hover:bg-primary/20 rounded-full">
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => handleSubmit('active')} 
                disabled={loading}
                className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                Publish Listing
              </Button>
              <Button 
                onClick={() => handleSubmit('draft')} 
                disabled={loading}
                variant="outline" 
                className="flex-1 h-14 rounded-2xl text-lg font-bold"
              >
                Save as Draft
              </Button>
            </div>
          </div>

          {/* Sidebar / Tips */}
          <aside className="w-full md:w-80 space-y-6">
            <Card className="rounded-3xl border-none shadow-sm bg-primary text-white p-8">
              <Sparkles className="mb-4 h-8 w-8 text-blue-200" />
              <h3 className="text-xl font-headline font-bold mb-4">Pro Provider Tips</h3>
              <ul className="space-y-4 text-sm text-blue-50">
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-400/30 flex items-center justify-center flex-shrink-0">1</div>
                  <p>Use high-quality photos to increase bookings by up to 40%.</p>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-400/30 flex items-center justify-center flex-shrink-0">2</div>
                  <p>Be specific about your availability and any equipment provided.</p>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-400/30 flex items-center justify-center flex-shrink-0">3</div>
                  <p>Use our <b>AI Assist</b> tool to generate professional, SEO-friendly descriptions.</p>
                </li>
              </ul>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm p-8 bg-white">
              <h3 className="font-headline font-bold mb-4">Preview Card</h3>
              <div className="border rounded-2xl overflow-hidden grayscale opacity-50 pointer-events-none">
                 <div className="h-32 bg-gray-100 flex items-center justify-center">
                   <Plus size={24} className="text-gray-300" />
                 </div>
                 <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                 </div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-4 italic">
                This is a draft preview of how your listing might appear to customers.
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
