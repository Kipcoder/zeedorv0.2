'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { 
  BarChart3, 
  ShoppingBag, 
  Plus, 
  Calendar as CalendarIcon, 
  MessageSquare,
  TrendingUp,
  User,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Query for user's active listings in the public collection
  const activeListingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'listings'),
      where('providerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  // Query for user's private/draft listings
  const privateListingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'userProfiles', user.uid, 'providerListings'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: activeListings, isLoading: loadingActive } = useCollection(activeListingsQuery);
  const { data: privateListings, isLoading: loadingPrivate } = useCollection(privateListingsQuery);

  const allListings = [...(activeListings || []), ...(privateListings || [])].sort((a, b) => {
    const dateA = a.createdAt?.seconds || 0;
    const dateB = b.createdAt?.seconds || 0;
    return dateB - dateA;
  });

  const stats = [
    { label: 'Total Listings', value: allListings.length.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Upcoming Bookings', value: '0', icon: CalendarIcon, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Earnings', value: '$0', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Unread Messages', value: '0', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your dashboard.</p>
          <Link href="/login">
            <Button className="w-full h-12 rounded-xl">Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <Navbar />
      
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your services, track bookings, and update your profile.</p>
          </div>
          <div className="flex gap-4">
             <Link href="/listings/new">
                <Button className="rounded-full px-8 h-14 text-base font-bold shadow-lg shadow-primary/20">
                  <Plus size={20} className="mr-2" /> Create New Listing
                </Button>
             </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="listings" className="space-y-8">
          <TabsList className="bg-white border p-1 rounded-2xl h-14 gap-2">
            <TabsTrigger value="listings" className="rounded-xl px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">My Listings</TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-xl px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">Bookings</TabsTrigger>
            <TabsTrigger value="earnings" className="rounded-xl px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">Earnings</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-xl px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">Profile Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6 outline-none">
            {loadingActive || loadingPrivate ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : allListings.length > 0 ? (
              <div className="grid gap-6">
                {allListings.map((listing) => (
                  <Card key={listing.id} className="border-none shadow-sm overflow-hidden rounded-3xl bg-white">
                    <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                      <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                        <Image 
                          src={listing.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/600/400'} 
                          alt={listing.title} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                          <h3 className="text-xl font-headline font-bold">{listing.title}</h3>
                          <Badge variant={listing.status === 'active' ? 'default' : 'secondary'} className="rounded-full">
                            {listing.status}
                          </Badge>
                        </div>
                        <p className="text-primary font-bold mb-4">{listing.currency} {listing.price}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><BarChart3 size={14} /> 0 Views</span>
                          <span className="flex items-center gap-1"><CalendarIcon size={14} /> 0 Bookings</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {listing.status === 'active' && (
                          <Link href={`/listings`}>
                            <Button variant="outline" size="icon" className="rounded-xl">
                              <ExternalLink size={18} />
                            </Button>
                          </Link>
                        )}
                        <Button variant="outline" className="rounded-xl">Edit</Button>
                        <Button variant="ghost" className="rounded-xl text-destructive hover:bg-destructive/5">Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-xl font-bold text-gray-400 mb-2">No listings yet</p>
                <p className="text-muted-foreground mb-8">Ready to start your sports business?</p>
                <Link href="/listings/new">
                  <Button className="rounded-xl font-bold px-8">Create Your First Listing</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="outline-none">
             <div className="grid md:grid-cols-3 gap-8">
                <Card className="col-span-1 rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                   <div className="h-32 bg-primary relative">
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200 flex items-center justify-center">
                         <User size={40} className="text-gray-400" />
                      </div>
                   </div>
                   <CardContent className="pt-16 pb-8 text-center">
                      <h4 className="font-headline font-bold text-xl">{user?.displayName || 'Sports Provider'}</h4>
                      <p className="text-muted-foreground mb-6">{user?.email}</p>
                      <Button variant="outline" className="w-full rounded-xl">Update Photo</Button>
                   </CardContent>
                </Card>
                
                <Card className="col-span-2 rounded-3xl border-none shadow-sm bg-white p-8">
                   <h3 className="text-2xl font-headline font-bold mb-8">Account Details</h3>
                   <div className="grid gap-6">
                      <div className="grid gap-2">
                         <Label className="font-bold">Display Name</Label>
                         <Input defaultValue={user?.displayName || ''} className="rounded-xl h-12" />
                      </div>
                      <div className="grid gap-2">
                         <Label className="font-bold">Email Address</Label>
                         <Input defaultValue={user?.email || ''} disabled className="rounded-xl h-12" />
                      </div>
                      <div className="grid gap-2">
                         <Label className="font-bold">Bio</Label>
                         <textarea className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Tell the community about yourself..."></textarea>
                      </div>
                      <div className="flex justify-end gap-4 mt-4">
                         <Button variant="ghost" className="rounded-xl px-8 h-12 font-bold">Discard</Button>
                         <Button className="rounded-xl px-8 h-12 font-bold">Save Changes</Button>
                      </div>
                   </div>
                </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
