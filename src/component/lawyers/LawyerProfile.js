import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LawyerDescription from './LawyerDescription';
import ConsultationComponent from '../consultation/ConsultationComponent';
import ReviewComponent from '../reviews/ReviewComponent';
import LawyerDelegations from './LawyerDelegations';
import styles from './LawyerProfile.module.css';

const LawyerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const lawyerId = localStorage.getItem('lawyerId');
      
      if (!token || !lawyerId) {
        navigate('/login');
        return;
      }

      try {
        // جلب البيانات الأساسية من endpoint البروفايل
        const profileResponse = await axios.get(
          'http://mohamek-legel.runasp.net/api/LawyerDashBoard/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // جلب البيانات الإضافية من endpoint المحامي
        const lawyerResponse = await axios.get(
          `http://mohamek-legel.runasp.net/api/LayOut/get-lawyer-by-id?id=${lawyerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (profileResponse.data && lawyerResponse.data) {
          // دمج البيانات من الـ endpointين
          const mergedProfile = {
            ...profileResponse.data,
            ...lawyerResponse.data,
            ssn: profileResponse.data.ssn, // التأكد من وجود رقم الهوية
            email: profileResponse.data.email // التأكد من وجود البريد الإلكتروني
          };
          
          setProfile(mergedProfile);
          console.log('بيانات المحامي المدمجة:', mergedProfile);
          
          // إذا كان هناك reviews في mergedProfile
          if (mergedProfile.reviews && mergedProfile.reviews.length > 0) {
            setReviews(mergedProfile.reviews);
            // حساب المتوسط
            const totalRating = mergedProfile.reviews.reduce((sum, review) => {
              let ratingValue = 0;
              if (review.rating === "FiveStars") ratingValue = 5;
              else if (review.rating === "FourStars") ratingValue = 4;
              else if (review.rating === "ThreeStars") ratingValue = 3;
              else if (review.rating === "TwoStars") ratingValue = 2;
              else if (review.rating === "OneStar") ratingValue = 1;
              return sum + ratingValue;
            }, 0);
            const avg = mergedProfile.reviews.length > 0 ? (totalRating / mergedProfile.reviews.length).toFixed(1) : 0;
            setAverageRating(avg);
          } else {
            // جرب جلبهم من endpoint آخر إذا لم يوجد
            fetchReviews(lawyerId, token);
          }
        } else {
          setError('لم يتم العثور على بيانات الملف الشخصي');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
          localStorage.removeItem('token');
          localStorage.removeItem('lawyerId');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'حدث خطأ أثناء جلب البيانات');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async (lawyerId, token) => {
      try {
        console.log('lawyerId المستخدم:', lawyerId);
        const response = await axios.get(
          `http://mohamek-legel.runasp.net/api/Review/get-all-reviewforlawyer?lawyerId=${lawyerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('الريفيوهات المسترجعة:', response.data);
        if (response.data) {
          setReviews(response.data);
          // حساب متوسط التقييم
          const totalRating = response.data.reduce((sum, review) => {
            let ratingValue = 0;
            if (review.rating === "FiveStars") ratingValue = 5;
            else if (review.rating === "FourStars") ratingValue = 4;
            else if (review.rating === "ThreeStars") ratingValue = 3;
            else if (review.rating === "TwoStars") ratingValue = 2;
            else if (review.rating === "OneStar") ratingValue = 1;
            return sum + ratingValue;
          }, 0);
          const avg = response.data.length > 0 ? (totalRating / response.data.length).toFixed(1) : 0;
          setAverageRating(avg);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className={styles.loading}>جاري تحميل البيانات...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!profile) return <div className={styles.notFound}>لا يوجد بيانات للمحامي</div>;

  return (
    <div className={styles["profile-main-layout"]}>
      {/* Sidebar Card */}
      <aside className={styles["profile-sidebar"]}>
        <div className={styles["profile-picture"]}>
          {profile.pictureUrl ? (
            <img src={profile.pictureUrl} alt="صورة الملف الشخصي" />
          ) : (
            <div className={styles["default-avatar"]}>
              <i className="fas fa-user-circle"></i>
            </div>
          )}
        </div>
        <h2>{profile.fullName}</h2>
        <div className={styles["rating"]}>
          <span style={{ color: '#E8C95C', fontWeight: 'bold', fontSize: '1.2rem' }}>
            {averageRating} {Array(Math.round(averageRating)).fill('★').join('')}
          </span>
          <div style={{ fontSize: '0.9rem', color: '#888' }}>
            {reviews.length} تقييمات
          </div>
        </div>
        
        {/* عرض التخصص الأول وسعر الاستشارة */}
        {profile.specializations && profile.specializations.length > 0 ? (
          <div className={styles["specialization-info"]}>
            <div style={{ color: '#03142D', margin: '0.5rem 0', fontWeight: 'bold' }}>
              التخصص: {profile.specializations[0].name}
            </div>
            <div style={{ color: '#03142D', margin: '0.5rem 0' }}>
              اتعاب القضية: {profile.specializations[0].fixedFee} ج.م
            </div>
          </div>
        ) : (
          <div style={{ color: '#03142D', margin: '0.5rem 0' }}>
            لا يوجد تخصصات متاحة
          </div>
        )}
        
        {/* عرض سعر الموعد */}
        <div className={styles["price"]}>
          سعر الاستشارة: {profile.priceOfAppointment ? `${profile.priceOfAppointment} ج.م` : 'غير محدد'}
        </div>
        
        <button className={styles["action-btn"]}>إجراء مكالمة الآن</button>
        <button className={styles["action-btn"]}>رفع التوكيل الخاص بك</button>
        
        <div className={styles["contact-info"]}>
          <div>رقم الهاتف: <span dir="ltr">{profile.phoneNumber}</span></div>
          {profile.email && <div>البريد الإلكتروني: <span dir="ltr">{profile.email}</span></div>}
          {profile.ssn && <div>رقم الهوية: <span dir="ltr">{profile.ssn}</span></div>}
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <div className={styles["profile-header"]}>
          {/* الصورة والاسم انتقلوا للبطاقة الجانبية */}
        </div>
        
        {/* تبويبات التنقل */}
        <div className={styles["profile-tabs"]}>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            الملف الشخصي
          </button>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'consultations' ? styles.active : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            إدارة الحجوزات
          </button>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'delegations' ? styles.active : ''}`}
            onClick={() => setActiveTab('delegations')}
          >
            إدارة التفويضات
          </button>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'description' ? styles.active : ''}`}
            onClick={() => setActiveTab('description')}
          >
            الوصف المهني
          </button>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'reviews' ? styles.active : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            التقييمات والمراجعات
          </button>
        </div>
        
        {/* محتوى التبويبات */}
        <div className={styles["tab-content"]}>
          {activeTab === 'profile' && (
            <div className={styles["profile-details"]}>
              {profile.email && <p><strong>البريد الإلكتروني:</strong> {profile.email}</p>}
              <p><strong>رقم الهاتف:</strong> {profile.phoneNumber}</p>
              {profile.dateOfBirth && profile.dateOfBirth !== "0001-01-01" && (
                <p><strong>تاريخ الميلاد:</strong> {profile.dateOfBirth}</p>
              )}
              {profile.ssn && <p><strong>رقم الهوية:</strong> {profile.ssn}</p>}
            </div>
          )}
          {activeTab === 'delegations' && (
            <div className={styles["delegations-section"]}>
              <LawyerDelegations />
            </div>
          )}
          {activeTab === 'description' && (
            <div className={styles["description-section"]}>
              <LawyerDescription lawyerId={profile.id} />
            </div>
          )}
          {activeTab === 'consultations' && (
            <div className={styles["consultations-section"]}>
              <ConsultationComponent 
                userType="lawyer" 
                userId={profile.id} 
                lawyerId={profile.id} 
              />
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className={styles["reviews-section"]}>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: '#E8C95C', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  متوسط التقييم: {averageRating} {Array(Math.round(averageRating)).fill('★').join('')}
                </span>
                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                  {reviews.length} تقييمات
                </div>
              </div>
              {reviews.length === 0 ? (
                <div>لا يوجد تقييمات بعد.</div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {reviews.map((review, idx) => (
                    <li key={idx} className={styles.reviewBox}>
                      <div className={styles.reviewStars}>
                        {(() => {
                          let stars = 0;
                          if (review.rating === "FiveStars") stars = 5;
                          else if (review.rating === "FourStars") stars = 4;
                          else if (review.rating === "ThreeStars") stars = 3;
                          else if (review.rating === "TwoStars") stars = 2;
                          else if (review.rating === "OneStar") stars = 1;
                          return Array(stars).fill('★').join('');
                        })()}
                      </div>
                      <div className={styles.reviewComment}>
                        {review.comment || "لا يوجد تعليق"}
                      </div>
                      {review.clientName && (
                        <span className={styles.reviewClientName}>
                          بواسطة: {review.clientName}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerProfile;