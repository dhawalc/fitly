import React from 'react';
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Health & Fitness App</title>
        <meta name="description" content="Track your health and fitness journey" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-white">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Health & Fitness App</p>
      </footer>
    </>
  );
}
