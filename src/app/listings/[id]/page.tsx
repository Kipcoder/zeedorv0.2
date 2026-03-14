'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  MapPin, 
  Star, 
  Calendar, 
  ArrowLeft, 
  Loader2, 
  Share2, 
  Heart,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Send,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  useFirestore, 
  useDoc, 
  useMemoFirebase, 
  useUser, 
  addDocumentNonBlocking 
} from '@/firebase';
import { doc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function ListingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const id = params.id as string;

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const docRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'listings', id);
  }, [firestore, id]);

  const { data: listing, isLoading, error } = useDoc(docRef);

  const handleBookingRequest = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book this service.",
        variant: "destructive"
      });
      router.push('/login');
      return;
    }

    if (!firestore || !listing) return;

    if (user.uid === listing.providerId) {
      toast({
        title: "Action restricted",
        description: "You cannot book your own service.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const bookingData = {
      requesterId: user.uid,
      providerId: listing.providerId,
      listingId: id,
      requestedDateTime: new Date(Date.now() + 86400000).toISOString(), // Default to tomorrow
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    addDocumentNonBlocking(collection(firestore, 'bookingRequests'), bookingData)
      .then(() => {
        toast({
          title: "Booking Requested!",
          description: "The provider has been notified of your request.",
        });
        setIsSubmitting(false);
      })
      .catch(() => setIsSubmitting(false));
  };

  const handleSendMessage = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to contact the provider.",
        variant: "destructive"
      });
      router.push('/login');
      return;
    }

    if (!messageText.trim() || !firestore || !listing) return;

    if (user.uid === listing.providerId) {
      toast({
        title: "Action restricted",
        description: "You cannot message yourself.",
        variant: "destructive"
      });
      setIsContactModalOpen(false);
      return;
    }

    setIsSubmitting(true);

    const messageData = {
      senderId: user.uid,
      receiverId: listing.providerId,
      listingId: id,
      content: messageText,
      sentAt: serverTimestamp(),
      isRead: false,
    };

    addDocumentNonBlocking(collection(firestore, 'messages'), messageData)
      .then(() => {
        toast({
          title: "Message Sent!",
          description: "Your inquiry has been delivered.",
        });
        setMessageText('');
        setIsContactModalOpen(false);
        setIsSubmitting(false);
      })
      .catch(() => setIsSubmitting(false));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Listing Not Found</h2>
        <p className="text-muted-foreground mb-6">The service you are looking for might have been removed or is no longer active.</p>
        <Link href="/listings">
          <Button className="rounded-xl px-8 h-12 font-bold">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const isOwner = user?.uid === listing.providerId;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <Navbar />
      
      <div className="container px-4 mx-auto max-w-6xl">
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg bg-white">
              <Image 
                src={listing.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/1200/800'} 
                alt={listing.title} 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute top-6 right-6 flex gap-2">
                <Button variant="secondary" size="icon" className="rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white">
                  <Heart size={20} className="text-gray-600" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white">
                  <Share2 size={20} className="text-gray-600" />
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-sm font-bold px-4 py-1">
                  {listing.category}
                </Badge>
                <div className="flex items-center text-amber-500 font-bold">
                  < Star size={18} fill="currentColor" className="mr-1" /> 4.8 (24 Reviews)
                </div>
              </div>

              <h1 className="text-4xl font-headline font-bold mb-4">{listing.title}</h1>
              
              <div className="flex items-center text-muted-foreground mb-8">
                <MapPin size={18} className="mr-2 text-primary" />
                <span className="text-lg">{listing.location}</span>
              </div>

              <Separator className="mb-8" />

              <div className="space-y-6">
                <h3 className="text-2xl font-headline font-bold">About this service</h3>
                <div className="prose prose-blue max-w-none text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </div>
              </div>

              {listing.tags && listing.tags.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-bold mb-4">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="rounded-full px-4 py-1.5 border-gray-200 text-gray-700 bg-gray-50/50">
                        <CheckCircle2 size={14} className="mr-2 text-green-500" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Action */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-primary">{listing.currency} {listing.price}</span>
                    <span className="text-muted-foreground ml-2">per session</span>
                  </div>

                  {isOwner ? (
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-4 text-center">
                      <Sparkles className="mx-auto text-primary mb-3" size={32} />
                      <p className="text-blue-900 font-bold mb-1">This is your listing</p>
                      <p className="text-blue-700 text-sm mb-4">Manage your services and view requests from your dashboard.</p>
                      <Link href="/dashboard">
                        <Button variant="outline" className="w-full rounded-xl border-primary text-primary hover:bg-primary/5 font-bold">
                          Go to Dashboard
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                          <Calendar className="text-primary" size={20} />
                          <div>
                            <p className="text-sm font-bold text-gray-900">Next Available</p>
                            <p className="text-xs text-muted-foreground">Tomorrow at 10:00 AM</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                          <ShieldCheck className="text-green-600" size={20} />
                          <div>
                            <p className="text-sm font-bold text-gray-900">Zeedor Protected</p>
                            <p className="text-xs text-muted-foreground">Secure payments & verified pros</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Button 
                          className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
                          onClick={handleBookingRequest}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                          Request Booking
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full h-14 rounded-2xl text-lg font-bold gap-2"
                          onClick={() => setIsContactModalOpen(true)}
                        >
                          <MessageCircle size={20} />
                          Contact Provider
                        </Button>
                      </div>
                      
                      <p className="text-center text-xs text-muted-foreground mt-6">
                        No charge until the provider accepts your request.
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-sm bg-gray-900 text-white p-8">
                <h4 className="font-headline font-bold mb-4">Why choose this?</h4>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    Expert instruction for all skill levels
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    High-quality equipment and facilities
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    Flexible rescheduling options
                  </li>
                </ul>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Contact Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold">Contact Provider</DialogTitle>
            <DialogDescription>
              Send a message to inquire about "{listing.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Hi! I'm interested in your service. Can you tell me more about..."
              className="min-h-[150px] rounded-2xl"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setIsContactModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isSubmitting}
              className="rounded-xl gap-2 font-bold"
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send size={18} />}
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
