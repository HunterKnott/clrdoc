'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function WaitlistSignup({ onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supabase = createClient();

    const { data, error } = await supabase
      .from('Waitlist')
      .insert([{ email: email }]);

    if (error) {
      setMessage('Error adding to waitlist. Please try again.');
    } else {
      setMessage('Thank you for joining our waitlist!');
      setEmail('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <button
          onClick={onClose}
          className="float-right text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Join Our Waitlist</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Join Waitlist
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}