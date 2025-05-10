import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Lawyer.css';

const MOCK_PROFILE = {
  name: "محمود نعمان",
  specialty: "محامي جنائي",
  email: "mahmoudnouman926@gmail.com",
  bio: "محامي ذو خبرة متخصص في القضايا الجنائية",
  phone: "+201234567890",
  imageUrl: "/pics/PicsArt_02-27-01.25.04.jpg",
  experienceYears: 5,
  consultationFee: 300,
  languages: ["العربية", "الإنجليزية"],
  education: [
    { degree: "ليسانس حقوق", institution: "جامعة القاهرة", year: "2015" }
  ],
  availableTimes: [
    "الإثنين 10:00 ص - 12:00 م",
    "الثلاثاء 2:00 م - 4:00 م",
    "الأربعاء 11:00 ص - 1:00 م",
    "الخميس 3:00 م - 5:00 م"
  ]
};

const LawyerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      console.log('Current Token:', token);

      if (!token) {
        setProfile(MOCK_PROFILE);
        setLoading(false);
        return;
      }

      try {
        const url = `http://mohamek-legel.runasp.net/api/LawyerDashBoard/profile?t=${Date.now()}`;
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('API Response:', response.data);
        
        if (response.data) {
          setProfile(response.data);
        } else {
          setError('Profile data is empty');
        }
      } catch (err) {
        console.error('Error details:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });

        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('token');
        } else {
          setError(err.response?.data?.message || 'Connection error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleBookingClick = () => {
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    // هنا يمكنك إضافة منطق تأكيد الحجز
    alert(`تم حجز موعدك في ${selectedTime}`);
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>جاري تحميل الملف الشخصي...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h3>خطأ</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>حاول مرة أخرى</button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-empty">
        <h3>لم يتم العثور على ملف شخصي</h3>
        <p>يرجى إكمال معلومات ملفك الشخصي</p>
      </div>
    );
  }

  return (
    <>
      <div className={`lawyer-profile-container ${showBookingModal ? 'blurred' : ''}`}>
        <div className="profile-header">
          <div className="avatar-container">
            <img 
              src={profile.imageUrl || '/default-avatar.jpg'} 
              alt={profile.name}
              className="profile-avatar"
            />
            {profile.isVerified && <span className="verified-badge">✓</span>}
          </div>
          
          <h1 className="lawyer-name">{profile.name}</h1>
          <p className="lawyer-title">{profile.specialty}</p>
          
          <div className="rating-section">
            <span className="rating">{profile.rating || '5.0'}</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < (profile.rating || 5) ? 'filled' : ''}`}>★</span>
              ))}
            </div>
            <span className="reviews">({profile.reviewCount || 0} reviews)</span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-section">
            <h3>نبذة عني</h3>
            <p className="bio">{profile.bio || 'لم يتم تقديم نبذة'}</p>
          </div>

          <div className="detail-section">
            <h3>معلومات الاتصال</h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="icon">📧</span>
                <span>{profile.email}</span>
              </div>
              <div className="contact-item">
                <span className="icon">📱</span>
                <span>{profile.phone || 'غير متوفر'}</span>
              </div>
              {profile.address && (
                <div className="contact-item">
                  <span className="icon">📍</span>
                  <span>{profile.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>المعلومات المهنية</h3>
            <div className="professional-info">
              <div className="info-item">
                <span className="label">الخبرة:</span>
                <span>{profile.experienceYears || 0} سنوات</span>
              </div>
              <div className="info-item">
                <span className="label">رسوم الاستشارة:</span>
                <span>${profile.consultationFee || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">اللغات:</span>
                <span>{profile.languages?.join('، ') || 'غير محدد'}</span>
              </div>
            </div>
          </div>

          {profile.education && profile.education.length > 0 && (
            <div className="detail-section">
              <h3>التعليم</h3>
              <div className="education-list">
                {profile.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h4>{edu.degree}</h4>
                    <p>{edu.institution} ({edu.year})</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="btn-primary" onClick={handleBookingClick}>حجز استشارة</button>
          <button className="btn-secondary">إرسال رسالة</button>
        </div>
      </div>

      {showBookingModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <div className="modal-header">
              <h2>حجز استشارة مع {profile.name}</h2>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              <h3>اختر وقتًا متاحًا:</h3>
              
              <div className="time-slots">
                {profile.availableTimes?.length > 0 ? (
                  profile.availableTimes.map((time, index) => (
                    <div 
                      key={index} 
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </div>
                  ))
                ) : (
                  <p>لا توجد أوقات متاحة حالياً</p>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="confirm-button" 
                onClick={handleConfirmBooking}
                disabled={!selectedTime}
              >
                تأكيد الحجز
              </button>
              <button className="cancel-button" onClick={handleCloseModal}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LawyerProfile;