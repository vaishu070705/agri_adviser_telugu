import React from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
          {children}
        </main>
        <Footer />
      </div>
      <ChatBot />
    </div>
  );
}
