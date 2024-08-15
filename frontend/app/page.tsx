"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

async function getBookings() {
  const res = await fetch('http://localhost:5000/api/bookings', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return res.json();
}

const Home: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);

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

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error deleting booking:', errorData.error);
        return;
      }

      // reload bookings
      const updatedBookings = await getBookings();
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-blue-200 via-blue-100 to-white rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Bookings List</h1>
      <ul className="space-y-6">
        {bookings.map((booking) => (
          <li key={booking.id} className="p-6 border border-blue-300 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl flex justify-between items-center">
            <div className="flex flex-col items-start">
              <Link href={`/booking/${booking.id}`} className="text-blue-600 hover:underline mb-2">
                <p className="text-2xl font-semibold text-gray-800 cursor-pointer">Doctor: {booking.doctor_name}</p>
              </Link>
              <div className="flex items-center justify-between w-full">
                <span className="mr-3 text-lg text-gray-700">{new Date(booking.date).toLocaleDateString('en-GB')}</span>
                <span className="text-gray-700 text-lg">{new Date(`1970-01-01T${booking.start_time}`).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(booking.id)}
              className="bg-red-600 text-white py-2 px-5 rounded-md shadow-md hover:bg-red-700 transition-transform transform hover:scale-105"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <Link href="/create" className="bg-blue-600 text-white py-3 px-6 rounded-full shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700 ">
          Create New Booking
        </Link>
      </div>
    </div>
  );
};

export default Home;
