import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Client.css';

const MOCK_PROFILE = {
  name: "أحمد حسن",
  email: "ahmed@example.com",
  phone: "+201234567890",
  address: "123 شارع الرئيسي، المدينة",
  imageUrl: "/pics/PicsArt_02-27-01.25.04.jpg",
  cases: [
    { id: 1, title: "قضية طلاق", status: "نشطة", date: "2024-03-15" }
  ],
  preferredLanguages: ["العربية", "الإنجليزية"],
  preferredSpecialties: ["قانون الأسرة", "القانون الجنائي"],
  consultationHistory: [
    { lawyerName: "محمود نعمان", date: "2024-03-10", status: "مكتملة" }
  ]
};

const ClientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      console.log('Current Token:', token);

      if (!token) {
        // Use mock data when no token is present
        setProfile(MOCK_PROFILE);
        setLoading(false);
        return;
      }

      try {
        const url = `http://mohamek-legel.runasp.net/api/ClientDashBoard/profile?t=${Date.now()}`;
        
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
    <div className="client-profile-container">
      <div className="profile-header">
        <div className="avatar-container">
          <img 
            src={profile.imageUrl || '/default-avatar.jpg'} 
            alt={profile.name}
            className="profile-avatar"
          />
        </div>
        
        <h1 className="client-name">{profile.name}</h1>
        <p className="client-type">Client</p>
      </div>

      <div className="profile-details">
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
          <h3>القضايا النشطة</h3>
          <div className="cases-list">
            {profile.cases && profile.cases.length > 0 ? (
              profile.cases.map((case_, index) => (
                <div key={index} className="case-item">
                  <h4>{case_.title}</h4>
                  <p>الحالة: {case_.status}</p>
                  <p>التاريخ: {case_.date}</p>
                </div>
              ))
            ) : (
              <p>لا توجد قضايا نشطة</p>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h3>التفضيلات</h3>
          <div className="preferences-info">
            <div className="info-item">
              <span className="label">اللغات المفضلة:</span>
              <span>{profile.preferredLanguages?.join('، ') || 'غير محدد'}</span>
            </div>
            <div className="info-item">
              <span className="label">التخصصات المفضلة:</span>
              <span>{profile.preferredSpecialties?.join('، ') || 'غير محدد'}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>سجل الاستشارات</h3>
          <div className="consultation-history">
            {profile.consultationHistory && profile.consultationHistory.length > 0 ? (
              profile.consultationHistory.map((consultation, index) => (
                <div key={index} className="consultation-item">
                  <h4>المحامي: {consultation.lawyerName}</h4>
                  <p>التاريخ: {consultation.date}</p>
                  <p>الحالة: {consultation.status}</p>
                </div>
              ))
            ) : (
              <p>لا يوجد سجل استشارات</p>
            )}
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn-primary">البحث عن محامي</button>
        <button className="btn-secondary">تحديث الملف الشخصي</button>
      </div>
    </div>
  );
};

export default ClientProfile; 