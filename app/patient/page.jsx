'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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
    // const { data } = await supabase.from("Profiles").select("name, address, phone, price, photo_url");
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
    <main className="flex min-h-screen flex-col gap-6 items-center justify-center bg-gray-100 pt-24">
      <div className="flex flex-col gap-2 items-center">
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
          Eye Exams</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Address</th>
              <th>Prices</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profiles) => (
              <tr key={profiles.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        {profiles.photo_url ?
                          <img src={`https://hvtkrqlqujwzyqpjjyyd.supabase.co/storage/v1/object/public/profile_pictures/${profiles.photo_url}`} />
                          : <p>_</p>
                        }
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{profiles.name}</div>
                      <div className="text-sm opacity-50">{profiles.phone}</div>
                    </div>
                  </div>
                </td>
                <td>{profiles.address}</td>
                <td>
                  {Object.entries(profiles.prices).map(([service, price]) => (
                    <div key={service}>
                      {`${service}: $${price}`}
                    </div>
                  ))}
                </td>
                <td>
                  <button className="btn btn-primary btn-sm">Book</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}