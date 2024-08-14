"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateBooking: React.FC = () => {
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    doctor_name: '',
    service: '',
    end_time: '',
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isValidTimeFormat = (time: string) => /^\d{2}:\d{2}$/.test(time);

      if (!isValidTimeFormat(formData.start_time) || !isValidTimeFormat(formData.end_time)) {
        setError('Invalid time format. Please use HH:mm format.');
        return;
      }

      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to create booking');
        return;
      }

      router.push('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to create booking');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gradient-to-br from-blue-300 via-blue-200 to-white rounded-2xl shadow-xl">
      <div className="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Booking</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {['date', 'doctor_name', 'service', 'start_time', 'end_time'].map((field) => (
            <div key={field} className="relative p-3 border border-blue-300 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
              <label htmlFor={field} className="block text-base font-medium text-gray-700 mb-1 capitalize">
                {field.replace('_', ' ')}
              </label>
              <input
                type={field === 'date' ? 'date' : field.includes('time') ? 'time' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent py-2 px-3 text-base"
                required
              />
            </div>
          ))}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-2 px-5 rounded-full shadow-md transform transition-transform duration-300 hover:scale-105"
            >
              Create Booking
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white py-2 px-5 rounded-full shadow-md transform transition-transform duration-300 hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBooking;
