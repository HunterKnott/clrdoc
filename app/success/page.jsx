'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    setSessionId(searchParams.get('session_id'));
  }, [searchParams]);

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <NavBar options={["App", "About", "Contact"]} />
      <div className="flex-grow container mx-auto px-4 py-8 mt-[76px]">
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Thank You for Your Purchase!</h1>
          <p className="mb-4 text-gray-600">
            Your order has been successfully processed. Your session ID is: {sessionId}
          </p>
          <p className="mb-4 text-gray-600">
            Your glasses will be ready for pickup at your optometrist's office. They will contact you when your glasses are ready.
          </p>
          <p className="mb-6 text-gray-600">
            If you have any questions about your order or the pickup process, please contact your optometrist directly.
          </p>
          <div className="mb-6 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
            <p className="font-bold">Reminder:</p>
            <p>Don't forget to bring your ID when you pick up your glasses.</p>
          </div>
          <Link href="/" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
            Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}