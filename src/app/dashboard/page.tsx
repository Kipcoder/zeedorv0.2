'use client';

import React, { useState, useRef } from 'react';
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
  ExternalLink,
  Trash2,
  Edit3,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  IdCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    profilePicture: ''
  });

  // Queries for Listings
  const activeListingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'listings'),
      where('providerId', '==', user.uid)
    );
  }, [firestore, user]);

  const privateListingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'userProfiles', user.uid, 'providerListings')
    );
  }, [firestore, user]);

  // Queries for Bookings
  const receivedBookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'bookingRequests'),
      where('providerId', '==', user.uid)
    );
  }, [firestore, user]);

  const sentBookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'bookingRequests'),
      where('requesterId', '==', user.uid)
    );
  }, [firestore, user]);

  // Messages Query for stats
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'messages'),
      where('receiverId', '==', user.uid),
      where('isRead', '==', false)
    );
  }, [firestore, user]);

  const { data: activeListings, isLoading: loadingActive } = useCollection(activeListingsQuery);
  const { data: privateListings, isLoading: loadingPrivate } = useCollection(privateListingsQuery);
  const { data: receivedBookings, isLoading: loadingReceived } = useCollection(receivedBookingsQuery);
  const { data: sentBookings, isLoading: loadingSent } = useCollection(sentBookingsQuery);
  const { data: unreadMessages } = useCollection(messagesQuery);

  const allListings = [
    ...(activeListings || []).map(l => ({ ...l, _collectionPath: 'listings' })),
    ...(privateListings || []).map(l => ({ ...l, _collectionPath: `userProfiles/${user?.uid}/providerListings` }))
  ].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  const handleDeleteListing = (id: string, path: string) => {
    if (!firestore || !id) return;
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const docRef = doc(firestore, path, id);
      deleteDocumentNonBlocking(docRef);
      toast({ title: "Listing Deleted" });
    }
  };

  const handleBookingStatus = (bookingId: string, status: 'accepted' | 'rejected') => {
    if (!firestore) return;
    const bookingRef = doc(firestore, 'bookingRequests', bookingId);
    updateDocumentNonBlocking(bookingRef, { status, updatedAt: new Date().toISOString() });
    toast({ title: `Booking ${status}` });
  };

  const handleSaveProfile = () => {
    if (!user || !firestore) return;
    const userRef = doc(firestore, 'userProfiles', user.uid);
    updateDocumentNonBlocking(userRef, {
      firstName: profileData.displayName,
      bio: profileData.bio,
      profilePictureUrl: profileData.profilePicture || null,
      updatedAt: new Date().toISOString()
    });
    toast({ title: "Profile Updated" });
  };

  const stats = [
    { label: 'Total Listings', value: allListings.length.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Received Requests', value: (receivedBookings?.length || 0).toString(), icon: CalendarIcon, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'My Bookings', value: (sentBookings?.length || 0).toString(), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Unread Messages', value: (unreadMessages?.length || 0).toString(), icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center p-4"><Card className="max-w-md w-full p-8 text-center rounded-3xl"><h2 className="text-2xl font-bold mb-4">Please Sign In</h2><Link href="/login"><Button className="w-full h-12 rounded-xl">Sign In</Button></Link></Card></div>;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <Navbar />
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your services and track your bookings.</p>
          </div>
          <Link href="/listings/new">
            <Button className="rounded-full px-8 h-14 text-base font-bold shadow-lg shadow-primary/20">
              <Plus size={20} className="mr-2" /> Create New Listing
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}><stat.icon size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="listings" className="space-y-8">
          <TabsList className="bg-white border p-1 rounded-2xl h-14 gap-2 flex-wrap sm:flex-nowrap">
            <TabsTrigger value="listings" className="flex-1 rounded-xl px-4 sm:px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">Listings</TabsTrigger>
            <TabsTrigger value="bookings" className="flex-1 rounded-xl px-4 sm:px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">Bookings</TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 rounded-xl px-4 sm:px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            {allListings.length > 0 ? allListings.map((listing) => (
              <Card key={listing.id} className="border-none shadow-sm overflow-hidden rounded-3xl bg-white">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                  <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                    <Image src={listing.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/600/400'} alt={listing.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-center md:text-left min-w-0">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                      <h3 className="text-xl font-headline font-bold truncate">{listing.title}</h3>
                      <Badge variant={listing.status === 'active' ? 'default' : 'secondary'} className="rounded-full">{listing.status}</Badge>
                    </div>
                    <p className="text-primary font-bold">{listing.currency} {listing.price}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/listings/edit/${listing.id}?path=${listing._collectionPath}`}><Button variant="outline" className="rounded-xl"><Edit3 size={16} className="mr-1" /> Edit</Button></Link>
                    <Button variant="ghost" className="rounded-xl text-destructive" onClick={() => handleDeleteListing(listing.id, listing._collectionPath)}><Trash2 size={16} /></Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-muted-foreground">You haven't created any listings yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-12">
            {/* Received Requests */}
            <section>
              <h3 className="text-2xl font-headline font-bold mb-6">Received Requests</h3>
              <div className="grid gap-4">
                {(receivedBookings || []).length > 0 ? receivedBookings?.map((booking) => (
                  <Card key={booking.id} className="border-none shadow-sm rounded-3xl bg-white">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shrink-0"><CalendarIcon size={24} /></div>
                        <div className="min-w-0">
                          <p className="font-bold flex items-center gap-2">
                            From: User {booking.requesterId.slice(0, 8)}
                            <IdCard size={14} className="text-gray-400" />
                          </p>
                          <p className="text-sm text-muted-foreground truncate">Listing ID: {booking.listingId.slice(0, 8)}</p>
                          <p className="text-xs text-gray-400">{new Date(booking.requestedDateTime).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {booking.status === 'pending' ? (
                          <>
                            <Button variant="outline" className="rounded-xl text-green-600 border-green-200 flex-1 sm:flex-none" onClick={() => handleBookingStatus(booking.id, 'accepted')}><CheckCircle size={16} className="mr-2" /> Accept</Button>
                            <Button variant="ghost" className="rounded-xl text-destructive" onClick={() => handleBookingStatus(booking.id, 'rejected')}><XCircle size={16} /></Button>
                          </>
                        ) : (
                          <Badge className="rounded-full capitalize px-4 py-1">{booking.status}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-muted-foreground text-sm">No requests received yet.</p>
                  </div>
                )}
              </div>
            </section>

            {/* My Bookings */}
            <section>
              <h3 className="text-2xl font-headline font-bold mb-6">My Bookings</h3>
              <div className="grid gap-4">
                {(sentBookings || []).length > 0 ? sentBookings?.map((booking) => (
                  <Card key={booking.id} className="border-none shadow-sm rounded-3xl bg-white">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-50 p-3 rounded-2xl text-purple-600 shrink-0"><Clock size={24} /></div>
                        <div>
                          <p className="font-bold">Service with Provider {booking.providerId.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">Requested: {new Date(booking.requestedDateTime).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge className="rounded-full capitalize">{booking.status}</Badge>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-muted-foreground text-sm">You haven't made any bookings yet.</p>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="profile" className="grid md:grid-cols-3 gap-8">
            <Card className="col-span-1 rounded-3xl border-none shadow-sm bg-white overflow-hidden">
              <div className="h-32 bg-primary relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profileData.profilePicture || user?.photoURL ? (
                    <Image src={profileData.profilePicture || user?.photoURL!} alt="Profile" fill className="object-cover" />
                  ) : <User size={40} className="text-gray-400" />}
                </div>
              </div>
              <CardContent className="pt-16 pb-8 text-center">
                <h4 className="font-headline font-bold text-xl">{user?.displayName || 'Sports Provider'}</h4>
                <Button variant="outline" className="w-full rounded-xl mt-4" onClick={() => fileInputRef.current?.click()}><Camera size={16} className="mr-2" /> Update Photo</Button>
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const r = new FileReader();
                    r.onload = () => setProfileData(p => ({ ...p, profilePicture: r.result as string }));
                    r.readAsDataURL(file);
                  }
                }} className="hidden" accept="image/*" />
              </CardContent>
            </Card>
            <Card className="col-span-2 rounded-3xl border-none shadow-sm bg-white p-8">
              <div className="grid gap-6">
                <div className="grid gap-2"><Label>Display Name</Label><Input value={profileData.displayName} onChange={e => setProfileData(p => ({...p, displayName: e.target.value}))} placeholder={user?.displayName || 'Your Name'} className="rounded-xl h-12" /></div>
                <div className="grid gap-2"><Label>Bio</Label><textarea className="w-full rounded-xl border p-3 min-h-[120px]" value={profileData.bio} onChange={e => setProfileData(p => ({...p, bio: e.target.value}))} placeholder="Tell us about yourself..." /></div>
                <Button className="rounded-xl h-12 font-bold" onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
