'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../NavBar';
import Footer from '../Footer';
import emailjs from '@emailjs/browser';

export default function Page() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const [showThankYou, setShowThankYou] = useState(false);
    const form = useRef();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        
        emailjs
        .sendForm('service_1cbln5k', 'template_n4wwyyh', form.current, {
          publicKey: 'oPteMBi316qbCtvom',
        })
        .then(
          () => {
            console.log('SUCCESS!');
          },
          (error) => {
            console.log('FAILED...', error.text);
          }
        );
        
        e.target.reset();

        setFormData({
            name: '',
            phone: '',
            email: '',
            message: ''
        });

        setShowThankYou(true);
        setTimeout(() => {
            setShowThankYou(false);
        }, 10000);
    };

    return (
        <main className="flex min-h-screen flex-col gap-6 items-center bg-gray-100">
            <Navbar options={["App", "About", "Providers"]}/>
            <div className="flex flex-col items-center bg-white p-8 rounded shadow-md w-full max-w-lg md:mt-[96px]">
                <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
                <form ref={form} className="w-full flex flex-col gap-4" onSubmit={handleSubmitClick}>
                    <label className="flex flex-col">
                        Name:
                        <input
                            type="text"
                            id="name"
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded"
                            placeholder="Your Name"
                        />
                    </label>
                    <label className="flex flex-col">
                        Phone Number:
                        <input
                            type="tel"
                            id="phone"
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded"
                            placeholder="Your Phone Number"
                        />
                    </label>
                    <label className="flex flex-col">
                        Email Address:
                        <input
                            type="email"
                            id="email"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded"
                            placeholder="Your Email Address"
                        />
                    </label>
                    <label className="flex flex-col">
                        Message:
                        <textarea
                            id="message"
                            name='message'
                            value={formData.message}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded"
                            placeholder="Your Message">
                        </textarea>
                    </label>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
                        Submit
                    </button>
                </form>
                {showThankYou && (
                    <div className="mt-4 p-2 text-green-700 border border-green-700 rounded">
                        Thank you for your message. We have been notified and will be getting back to you soon.
                    </div>
                )}
            </div>
            <Footer />
        </main>
    )
}