import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './LawyerAvailableSlots.module.css';

const LawyerAvailableSlots = ({ lawyerId, onBook }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loadingSlotId, setLoadingSlotId] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('يجب تسجيل الدخول أولاً');
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `http://mohamek-legel.runasp.net/api/ClientDashBoard/available-slots?lawyerId=${lawyerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSlots(response.data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب المواعيد');
      } finally {
        setLoading(false);
      }
    };
    if (lawyerId) fetchSlots();
  }, [lawyerId]);

  useEffect(() => {
    // Removed direct redirect to paymentUrl. Now handled by button/link below.
  }, [paymentUrl]);

  function formatForAPI(date) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${year}-${month}-${day} ${String(hours12).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  const handleBook = async (slot) => {
    setBookingStatus('');
    setPaymentUrl('');
    setLoadingSlotId(slot.id);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setBookingStatus('يجب تسجيل الدخول أولاً');
        setLoadingSlotId(null);
        return;
      }
      const requestedTime = formatForAPI(slot.availableFrom);
      const response = await axios.post(
        'http://mohamek-legel.runasp.net/api/Consultation/book-consultation',
        {
          lawyerId: String(slot.lawyerId),
          requestedTime: requestedTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      );
      if (response.data?.paymentUrl) {
        setPaymentUrl(response.data.paymentUrl);
        setBookingStatus(response.data.message || 'تم الحجز بنجاح!');
        if (onBook) onBook();
      } else {
        setBookingStatus(response.data?.message || 'تم الحجز بنجاح!');
        if (onBook) onBook();
      }
      setSlots(prev => prev.filter(s => s.id !== slot.id));
    } catch (err) {
      if (err.response?.status === 401) {
        setBookingStatus('يجب تسجيل الدخول أولاً');
      } else if (err.response?.data?.message) {
        setBookingStatus(err.response.data.message);
      } else {
        setBookingStatus('حدث خطأ أثناء الحجز');
      }
    } finally {
      setLoadingSlotId(null);
    }
  };

  if (loading) return <div>جاري تحميل المواعيد...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>المواعيد المتاحة</h3>
      {bookingStatus && (
        <div className={styles.statusMsg} style={{ color: bookingStatus.includes('نجاح') ? 'green' : 'red' }}>{bookingStatus}</div>
      )}
      {slots.length === 0 ? (
        <div>لا يوجد مواعيد متاحة حالياً</div>
      ) : (
        <ul className={styles.slotsList}>
          {slots.map(slot => (
            <li key={slot.id} className={styles.slotItem}>
              <div className={styles.slotRow}>
                <span className={styles.slotLabel}>من:</span>
                <span className={styles.slotValue}>{slot.availableFromDateFormatted || slot.availableFrom}</span>
              </div>
              <div className={styles.slotRow}>
                <span className={styles.slotLabel}>إلى:</span>
                <span className={styles.slotValue}>{slot.availableToDateFormatted || slot.availableTo}</span>
              </div>
              <div className={styles.slotRow}>
                <span className={styles.slotLabel}>الحالة:</span>
                <span className={styles.slotValue}>{slot.isBooked ? 'محجوز' : 'متاح'}</span>
              </div>
              {!slot.isBooked && (
                <button
                  onClick={() => handleBook(slot)}
                  className={styles.bookBtn}
                  disabled={loadingSlotId === slot.id}
                >
                  {loadingSlotId === slot.id ? 'جاري الحجز...' : 'احجز الآن'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {paymentUrl && (
        <div style={{ margin: '1rem 0', textAlign: 'center' }}>
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bookBtn}
            style={{ background: '#27ae60', fontSize: '1.1rem' }}
          >
            إتمام الدفع الآن
          </a>
        </div>
      )}
    </div>
  );
};

export default LawyerAvailableSlots; 