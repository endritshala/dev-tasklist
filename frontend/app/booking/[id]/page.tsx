"use client";

import { useEffect, useState } from 'react';
import styles from './BookingPage.module.css';
import Link from 'next/link';

async function getBooking(id: string) {
  const res = await fetch(`http://localhost:5000/api/bookings/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch booking');
  }
  return res.json();
}

const BookingPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBooking(params.id);
        setBooking(data);
      } catch (error) {
        setError('Error fetching booking data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.id]);

  const formatTime = (time: string) => {
    if (!time) return 'Invalid time';
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const formatDate = (date: string) => {
    if (!date) return 'Invalid date';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-content">
      <div className={styles.bookingPage}>
        <h1 className={styles.title}>Booking Details</h1>
        <div className={styles.bookingInfo}>        
          <p><strong>Doctor:</strong> {booking.doctor_name}</p>
          <p><strong>Service:</strong> {booking.service}</p>
          <p><strong>Start Time:</strong> {formatTime(booking.start_time)}</p>
          <p><strong>End Time:</strong> {formatTime(booking.end_time)}</p>
          <p><strong>Date:</strong> {formatDate(booking.date)}</p>
        </div>
        <div>
          <Link href="/" className={styles.backLink}>
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
