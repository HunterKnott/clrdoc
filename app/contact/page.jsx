'use client';

import React, { useState } from 'react';
import Navbar from '../NavBar';
import Footer from '../Footer';

export default function Page() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();

        const { name, phone, email, message } = formData;
        const subject = `ClrDoc site message from ${name}`;
        const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=clrdoc.com@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');

        setFormData({
            name: '',
            phone: '',
            email: '',
            message: ''
        });
    };

    return (
        <main className="flex min-h-screen flex-col gap-6 items-center bg-gray-100">
            <Navbar options={["Home", "About", "Providers"]}/>
            <div className="flex flex-col items-center bg-white p-8 rounded shadow-md w-full max-w-lg md:mt-[96px]">
                <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmitClick}>
                    <label className="flex flex-col">
                        Name:
                        <input
                            type="text"
                            id="name"
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
            </div>
            <Footer />
        </main>
    )
}