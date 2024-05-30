'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
// import initMap from './search';
import Map from './map';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function Page() {
  const [profiles, setProfiles] = useState([]);
  const [isDentalFiltered, setIsDentalFiltered] = useState(false);
  const [isOpticFiltered, setIsOpticFiltered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, [isDentalFiltered, isOpticFiltered, searchTerm])

  const fetchProfiles = async () => {
    const { data } = await supabase.from("Profiles").select();
    var filteredByAddress;
    if (isDentalFiltered) {
      const filtered = data.filter(profile => profile.type === "Dental");
      filteredByAddress = filtered.filter(profile => profile.address.toLowerCase().includes(searchTerm.toLowerCase()));
    } else if (isOpticFiltered) {
      const filtered = data.filter(profile => profile.type === "Optometrist");
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
    setIsOpticFiltered(false);
  }

  const handleOpticFilterClick = () => {
    setIsOpticFiltered(!isOpticFiltered);
    setIsDentalFiltered(false);
  }

  const handleProfileClick = (profileId) => {
    setSelectedProfile(profileId);
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 items-center justify-center bg-gray-100 py-24">
      <div className="flex flex-col gap-2 items-center px-6 text-center">
        <h1 className="text-4xl font-bold">ClrDoc</h1>
        <p>Connecting cash pay patients with quality providers</p>
        <input
          className="input input-bordered w-full max-w-xs mb-6"
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Enter City or Zip Code"
        />
        <div className="flex flex-row gap-6">
          <button
            className={isDentalFiltered ? "btn btn-primary btn-lg" : "btn btn-neutral btn-lg"}
            onClick={handleDentalFilterClick}>
          Dental</button>
          <button
            className={isOpticFiltered ? "btn btn-primary btn-lg" : "btn btn-neutral btn-lg"}
            onClick={handleOpticFilterClick}>
          Vision</button>
        </div>
      </div>
      <div className="overflow-x-auto flex flex-col gap-12 px-6">
        {profiles.map((profiles) => (
          <div key={profiles.id} className="flex flex-wrap md:flex-row justify-start pb-6 border-b">
            <div className="avatar md:w-[20%] pr-4">
              <div className="mask mask-squircle w-16 h-16 md:w-24 md:h-24">
                {profiles.photo_url ?
                  <img src={`https://hvtkrqlqujwzyqpjjyyd.supabase.co/storage/v1/object/public/profile_pictures/${profiles.photo_url}`} />
                  : <p>_</p>
                }
              </div>
            </div>
            <div className="flex flex-col gap-2 text-left text-xs md:w-[60%]">
              <h2 className="font-bold">{profiles.name}</h2>
              <h2 className="font-bold opacity-50">{profiles.phone}</h2>
              <h2 className="font-bold opacity-50">{profiles.address}</h2>
            </div>
            <div className="flex flex-col gap-2 md:w-[20%] pt-4 md:pt-0">
              {Object.entries(profiles.prices).map(([service, price]) => (
                <div key={service}>
                  {`${service}: $${price}`}
                </div>
              ))}
              <button className="btn btn-primary btn-sm">Book</button>
            </div>
          </div>
        ))}
      </div>
      <Map
        latlong={{ coordinates: [40.297159, -111.695038]}} // Center of Orem city
      />
    </main>
  )
}