import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function AppointmentForm({ profile, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    provider: profile.name,
    address: profile.address
  });
  const [showMessage, setShowMessage] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_1cbln5k', 
      'template_hwybw2f', 
      e.target, 
      'oPteMBi316qbCtvom'
    ).then(
      () => {
        // Show success message
        setShowMessage(true);
        // Hide message and close form after 5 seconds
        setTimeout(() => {
          setShowMessage(false);
          onClose();
        }, 5000); // 5000 milliseconds = 5 seconds
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
      provider: profile.name,
      address: profile.address
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-96">
        {showMessage ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white border-2 border-dark-green text-green p-4 rounded-md shadow-lg">
              <p>Thank you for submitting an appointment request. The provider will be reaching out to you soon.</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Requesting appointment for {profile.name} at {profile.address}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <input type="hidden" name="provider" value={formData.provider} />
              <input type="hidden" name="address" value={formData.address} />
              <div className="flex justify-end gap-4">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
