import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReviewComponent from '../reviews/ReviewComponent';
import styles from './LawyerList.module.css';

const LawyerList = () => {
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (!token) {
      navigate('/login');
      return;
    }

    setUserRole(role);
    
    // Get client ID if user is a client
    if (role === 'Client') {
      fetchClientProfile(token);
    }
    
    fetchLawyers(token);
  }, [navigate]);

  const fetchClientProfile = async (token) => {
    try {
      const response = await axios.get(
        'http://mohamek-legel.runasp.net/api/ClientDashBoard/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setClientId(response.data.id);
      }
    } catch (err) {
      console.error('Error fetching client profile:', err);
    }
  };

  const fetchLawyers = async (token) => {
    try {
      const response = await axios.get(
        'http://mohamek-legel.runasp.net/api/LayOut/get-all-lawyers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // تأكد من أن البيانات مصفوفة
        const lawyersData = Array.isArray(response.data) ? response.data : [];
        setLawyers(lawyersData);
        console.log('Lawyers data in LawyerList:', lawyersData);
      } else {
        setLawyers([]);
      }
    } catch (err) {
      console.error('Error fetching lawyers:', err);
      setError('حدث خطأ أثناء جلب قائمة المحامين');
      setLawyers([]); // تعيين مصفوفة فارغة في حالة الخطأ
    } finally {
      setLoading(false);
    }
  };

  const handleLawyerClick = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowReviews(true);
  };

  const handleBackToList = () => {
    setSelectedLawyer(null);
    setShowReviews(false);
  };

  const getRatingDisplay = (lawyer) => {
    if (!lawyer.averageRating) return 'لا توجد تقييمات';
    
    const rating = parseFloat(lawyer.averageRating);
    const stars = Array(5).fill().map((_, i) => (
      <span 
        key={i} 
        className={`${styles.star} ${i < Math.round(rating) ? styles.filled : ''}`}
      >
        ★
      </span>
    ));
    
    return (
      <div className={styles.ratingDisplay}>
        <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
        <div className={styles.stars}>{stars}</div>
        <span className={styles.reviewCount}>
          ({lawyer.reviewCount || 0} تقييم)
        </span>
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>جاري تحميل قائمة المحامين...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (showReviews && selectedLawyer) {
    return (
      <div className={styles.reviewsContainer}>
        <div className={styles.reviewsHeader}>
          <button 
            className={styles.backButton}
            onClick={handleBackToList}
          >
            ← العودة لقائمة المحامين
          </button>
          <h2>تقييمات المحامي: {selectedLawyer.fullName || selectedLawyer.name}</h2>
        </div>
        <ReviewComponent 
          lawyerId={selectedLawyer.id}
          userRole={userRole}
          clientId={clientId}
        />
      </div>
    );
  }

  return (
    <div className={styles.lawyerListContainer}>
      <div className={styles.header}>
        <h1>قائمة المحامين</h1>
        <p>اختر محامياً لعرض تفاصيله وإضافة تقييم</p>
      </div>

      <div className={styles.lawyersGrid}>
        {!Array.isArray(lawyers) || lawyers.length === 0 ? (
          <div className={styles.noLawyers}>
            لا توجد محامين متاحين حالياً
          </div>
        ) : (
          lawyers.map((lawyer) => (
            <div 
              key={lawyer.id} 
              className={styles.lawyerCard}
              onClick={() => handleLawyerClick(lawyer)}
            >
              <div className={styles.lawyerImage}>
                {lawyer.pictureUrl ? (
                  <img src={lawyer.pictureUrl} alt={lawyer.fullName || lawyer.name} />
                ) : (
                  <div className={styles.defaultAvatar}>
                    <i className="fas fa-user-circle"></i>
                  </div>
                )}
              </div>
              
              <div className={styles.lawyerInfo}>
                <h3 className={styles.lawyerName}>
                  {lawyer.fullName || lawyer.name}
                </h3>
                
                {lawyer.specializations && lawyer.specializations.length > 0 && (
                  <p className={styles.specialization}>
                    التخصص: {lawyer.specializations[0].name}
                  </p>
                )}
                
                {lawyer.priceOfAppointment && (
                  <p className={styles.price}>
                    سعر الاستشارة: {lawyer.priceOfAppointment} ج.م
                  </p>
                )}
                
                <div className={styles.rating}>
                  {getRatingDisplay(lawyer)}
                </div>
              </div>
              
              <div className={styles.cardActions}>
                <button className={styles.viewReviewsBtn}>
                  عرض التقييمات
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LawyerList; 