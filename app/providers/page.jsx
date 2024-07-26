'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../NavBar';
import Footer from '../Footer';
import AppointmentForm from './AppointmentForm';
// import initMap from './search';
// import Map from './map';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function Page() {
  const [profiles, setProfiles] = useState([]);
  const [isDentalFiltered, setIsDentalFiltered] = useState(false);
  const [isVisionFiltered, setIsVisionFiltered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [appointmentProfile, setAppointmentProfile] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, [isDentalFiltered, isVisionFiltered, searchTerm])

  const fetchProfiles = async () => {
    const { data } = await supabase.from("Profiles").select();
    var filteredByAddress;
    if (isDentalFiltered) {
      const filtered = data.filter(profile => profile.type === "Dental");
      filteredByAddress = filtered.filter(profile => profile.address.toLowerCase().includes(searchTerm.toLowerCase()));
    } else if (isVisionFiltered) {
      const filtered = data.filter(profile => profile.type === "Vision");
      filteredByAddress = filtered.filter(profile => profile.address.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    else {
      filteredByAddress = data.filter(profile => profile.address.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setProfiles(filteredByAddress);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleDentalFilterClick = () => {
    setIsDentalFiltered(!isDentalFiltered);
    setIsVisionFiltered(false);
  }

  const handleVisionFilterClick = () => {
    setIsVisionFiltered(!isVisionFiltered);
    setIsDentalFiltered(false);
  }

  const handleProfileClick = (profileId) => {
    setSelectedProfile(profileId);
  }

  const handleRequestAppointmentClick = (profile) => {
    setAppointmentProfile(profile);
    setIsFormVisible(true);
    document.body.style.overflow = 'hidden'; // Disable scrolling
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    document.body.style.overflow = 'auto'; // Enable scrolling
  }

  return (
    <div className="relative flex flex-col min-h-screen items-center bg-gray-100">
      <Navbar options={["App", "About", "Contact"]} />
      <main className={`flex flex-col gap-6 items-center w-full ${isFormVisible ? 'blur-sm' : ''}`}>
        <div className="flex flex-col gap-2 items-center p-6 pt-20 mt-[60px] text-center">
          <div className='flex flex-col gap-6 m-6 md:w-[50%] md:pb-24'>
            <h1 className="text-4xl font-bold">Connecting patients with quality providers</h1>
            <p>Experience reliable, professional service that you can trust with ClrDoc. Making it simple to find care you need.</p>
          </div>
          <div className='bg-gray-300 w-screen flex flex-col items-center py-8'>
            <div className="flex flex-row gap-6">
              <button
                className={
                  isDentalFiltered ? 'flex flex-col items-center w-[150px] rounded-md font-medium text-black my-6 py-3 bg-blue-500 hover:bg-blue-600 transition duration-300'
                    : 'flex flex-col items-center w-[150px] rounded-md font-medium text-black my-6 py-3 bg-white hover:bg-gray-400 transition duration-300'}
                onClick={handleDentalFilterClick}>
                <img src='Images/tooth.png' className='w-[40px]' />
                Dental Care</button>
              <button
                className={
                  isVisionFiltered ? 'flex flex-col items-center w-[150px] rounded-md font-medium text-black my-6 py-3 bg-blue-500 hover:bg-blue-600 transition duration-300'
                    : 'flex flex-col items-center w-[150px] rounded-md font-medium text-black my-6 py-3 bg-white hover:bg-gray-400 transition duration-300'}
                onClick={handleVisionFilterClick}>
                <img src='Images/eye.png' className='w-[40px]' />
                Vision Care</button>
            </div>
            <input
              className="input input-bordered w-full max-w-xs mb-6"
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Enter City or Zip Code"
            />
          </div>
        </div>
        <div className="overflow-x-auto flex flex-col gap-12 px-6">
          {profiles.map((profiles) => (
            <div key={profiles.id} className="flex flex-wrap md:flex-row justify-start pb-6 border-b">
              <div className="avatar md:w-[20%] pr-4">
                <div className="mask mask-squircle w-16 h-16 md:w-32 md:h-32">
                  {profiles.photo_url ?
                    <img src={`https://hvtkrqlqujwzyqpjjyyd.supabase.co/storage/v1/object/public/profile_pictures/${profiles.photo_url}`} />
                    : <p>_</p>
                  }
                </div>
              </div>
              <div className="flex flex-col gap-2 text-left text-xs md:text-base md:w-[60%]">
                <h2 className="font-bold">{profiles.name}</h2>
                <h2 className="font-bold opacity-50">{profiles.phone}</h2>
                <h2 className="font-bold opacity-50">{profiles.address}</h2>
              </div>
              <div className="flex flex-col gap-2 text-xs md:text-base md:w-[20%] pt-4 md:pt-0">
                {Object.entries(profiles.prices).map(([service, price]) => (
                  <div key={service}>
                    <strong>{service}:</strong> <strong>${price}</strong> <span className='text-sm'>(Starting price)</span>
                  </div>
                ))}
                <button
                  className="btn btn-secondary btn-sm flex items-center justify-center h-12"
                  onClick={() => handleRequestAppointmentClick(profiles)}>
                  Request Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      {isFormVisible && <AppointmentForm profile={appointmentProfile} onClose={handleCloseForm} />}
    </div>
  );
}