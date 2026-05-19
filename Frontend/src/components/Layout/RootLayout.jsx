import React from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;