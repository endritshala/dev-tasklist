"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

async function getBookings() {
  const res = await fetch('http://localhost:5000/api/bookings', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return res.json();
}

const Navbar: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Adjust delay as needed
    setDropdownTimeout(timeout);
  };
//bg-gradient-to-r from-blue-400 via-green-300 to-white
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-white text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Pabau Task
        </Link>
        <Link href="/create" className="bg-blue-600 text-white py-3 px-8 rounded-full shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700">
          Create New Booking
        </Link>
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={dropdownRef}
        >
          <button
            onClick={handleDropdownToggle}
            className="bg-blue-600 text-white py-3 px-8 rounded-full shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700"
          >
            Bookings
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded-lg shadow-lg">
              <ul className="list-none p-2 m-0">
                {bookings.map((booking) => (
                  <li key={booking.id}>
                    <Link
                      href={`/booking/${booking.id}`}
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Doctor: {booking.doctor_name} on {new Date(booking.date).toLocaleDateString('en-GB')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
