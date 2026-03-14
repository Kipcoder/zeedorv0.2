'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { 
  BarChart3, 
  ShoppingBag, 
  Settings, 
  Bell, 
  Plus, 
  Calendar as CalendarIcon, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  User,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';

const stats = [
  { label: 'Active Listings', value: '4', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Upcoming Bookings', value: '12', icon: CalendarIcon, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Total Earnings', value: '$2,450', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Unread Messages', value: '3', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-100' },
];

const myListings = [
  { id: '1', title: 'Elite Tennis Coaching', price: '$60/hr', status: 'Active', views: 245, bookings: 12, image: 'https://picsum.photos/seed/21/600/400' },
  { id: '2', title: 'Private Gym Rental', price: '$45/hr', status: 'Paused', views: 89, bookings: 5, image: 'https://picsum.photos/seed/65/600/400' },
];

export default function DashboardPage() {
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
            <div className="grid gap-6">
              {myListings.map((listing) => (
                <Card key={listing.id} className="border-none shadow-sm overflow-hidden rounded-3xl bg-white">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                      <Image src={listing.image} alt={listing.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h3 className="text-xl font-headline font-bold">{listing.title}</h3>
                        <Badge variant={listing.status === 'Active' ? 'default' : 'secondary'} className="rounded-full">
                          {listing.status}
                        </Badge>
                      </div>
                      <p className="text-primary font-bold mb-4">{listing.price}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><BarChart3 size={14} /> {listing.views} Views</span>
                        <span className="flex items-center gap-1"><CalendarIcon size={14} /> {listing.bookings} Bookings</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-xl">Edit</Button>
                      <Button variant="ghost" className="rounded-xl text-destructive hover:bg-destructive/5">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="outline-none">
             <div className="grid md:grid-cols-3 gap-8">
                <Card className="col-span-1 rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                   <div className="h-32 bg-primary relative">
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                         <User size={40} className="m-auto mt-4 text-gray-400" />
                      </div>
                   </div>
                   <CardContent className="pt-16 pb-8 text-center">
                      <h4 className="font-headline font-bold text-xl">Alex Johnson</h4>
                      <p className="text-muted-foreground mb-6">Pro Tennis Coach</p>
                      <Button variant="outline" className="w-full rounded-xl">Update Photo</Button>
                   </CardContent>
                </Card>
                
                <Card className="col-span-2 rounded-3xl border-none shadow-sm bg-white p-8">
                   <h3 className="text-2xl font-headline font-bold mb-8">Account Details</h3>
                   <div className="grid gap-6">
                      <div className="grid gap-2">
                         <Label className="font-bold">Display Name</Label>
                         <Input defaultValue="Alex Johnson" className="rounded-xl h-12" />
                      </div>
                      <div className="grid gap-2">
                         <Label className="font-bold">Email Address</Label>
                         <Input defaultValue="alex.coach@example.com" disabled className="rounded-xl h-12" />
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