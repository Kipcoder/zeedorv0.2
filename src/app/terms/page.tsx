'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { Shield, ArrowLeft, Scale, ShieldCheck, Info, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <Navbar />
      
      <div className="container px-4 mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <header className="mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-6">
            <Scale size={32} />
          </div>
          <h1 className="text-5xl font-headline font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">Last updated: May 20, 2024</p>
        </header>

        <div className="prose prose-blue max-w-none space-y-12">
          <section>
            <h2 className="text-3xl font-headline font-bold mb-4 flex items-center gap-3">
              <span className="text-primary">1.</span> Acceptance of Terms
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              By accessing or using the Zeedor platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. Zeedor is a marketplace connecting sports service providers (coaches, venues, etc.) with consumers.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-headline font-bold mb-4 flex items-center gap-3">
              <span className="text-primary">2.</span> Marketplace Role
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Zeedor acts solely as a platform. We do not provide the sports services listed. Any contract for the provision of services is between the Provider and the Requester. Zeedor is not a party to those transactions and is not responsible for the performance or safety of any listed activity.
            </p>
          </section>

          <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 shadow-sm my-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-primary" /> Provider Responsibilities
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                Ensure all listing descriptions are accurate and not misleading.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                Maintain all necessary licenses, certifications, and insurance.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                Honoring bookings once they have been accepted through the platform.
              </li>
            </ul>
          </div>

          <section>
            <h2 className="text-3xl font-headline font-bold mb-4 flex items-center gap-3">
              <span className="text-primary">3.</span> User Conduct
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Users must not use the platform to harass others, post fraudulent listings, or attempt to bypass Zeedor's communication systems for the purpose of avoiding platform protocols. We reserve the right to suspend accounts that violate these guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-headline font-bold mb-4 flex items-center gap-3">
              <span className="text-primary">4.</span> Payments and Fees
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Zeedor may charge service fees for successful bookings. These fees are non-refundable unless otherwise stated in specific transaction policies. Providers are responsible for all taxes associated with their earnings on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-headline font-bold mb-4 flex items-center gap-3">
              <span className="text-primary">5.</span> Limitation of Liability
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, Zeedor shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
          </section>

          <Separator className="my-12" />

          <section className="text-center pb-12">
            <h2 className="text-2xl font-headline font-bold mb-4">Have questions?</h2>
            <p className="text-muted-foreground mb-8">If you have any questions regarding these terms, please reach out to our support team.</p>
            <Link href="/login">
              <Button className="rounded-full px-10 h-14 font-bold">Contact Support</Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
