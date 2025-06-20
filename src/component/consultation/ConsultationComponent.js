import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ConsultationComponent.module.css';

const ConsultationComponent = ({ userType, userId, lawyerId }) => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]); // المواعيد المتاحة
  const [lawyerConsultations, setLawyerConsultations] = useState([]); // كل الاستشارات
  const [loading, setLoading] = useState(false);
  const [lawyerConsultationsLoading, setLawyerConsultationsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lawyerConsultationsError, setLawyerConsultationsError] = useState('');
  const [startTime, setStartTime] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState('available');
  const baseUrl = 'http://mohamek-legel.runasp.net';
  const consultationDurationHours = 8; // مدة ثابتة 8 ساعات

  // تحويل التاريخ إلى تنسيق API المطلوب "YYYY-MM-DD HH:MM AM/PM"
  const formatForAPI = (date) => {
    if (!date) return null;
    
    const d = new Date(date);
    
    // التحقق من صحة التاريخ
    if (isNaN(d.getTime())) {
      throw new Error('تاريخ غير صحيح');
    }
    
    // التأكد من أن التاريخ في المستقبل
    if (d <= new Date()) {
      throw new Error('يجب أن يكون التاريخ في المستقبل');
    }
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    const formattedDate = `${year}-${month}-${day} ${String(hours12).padStart(2, '0')}:${minutes} ${ampm}`;
    console.log('Formatted date:', formattedDate);
    
    return formattedDate;
  };

  // حساب وقت النهاية تلقائياً
  const calculateEndTime = (start) => {
    if (!start) return null;
    const startDate = new Date(start);
    return new Date(startDate.getTime() + consultationDurationHours * 60 * 60 * 1000);
  };

  // تنسيق التاريخ للعرض
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) : 'غير محدد';
  };

  // إضافة موعد جديد
  const handleAddConsultation = async () => {
    setFormError('');
    setError('');
    
    if (!startTime) {
      setFormError('يجب تحديد وقت البداية');
      return;
    }

    const startDate = new Date(startTime);
    const endDate = calculateEndTime(startTime);

    if (startDate < new Date()) {
      setFormError('لا يمكن تحديد موعد في الماضي');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // التحقق من صحة التواريخ قبل الإرسال
      let availableFrom, availableTo;
      try {
        availableFrom = formatForAPI(startDate);
        availableTo = formatForAPI(endDate);
      } catch (dateError) {
        setFormError(dateError.message);
        setLoading(false);
        return;
      }
      
      if (!availableFrom || !availableTo) {
        throw new Error('خطأ في تنسيق التاريخ');
      }
      
      const data = {
        availableFrom: availableFrom,
        availableTo: availableTo
      };
      
      console.log('Sending data:', data);
      console.log('Token:', token.substring(0, 50) + '...');
      console.log('Start date object:', startDate);
      console.log('End date object:', endDate);
      console.log('Available from:', availableFrom);
      console.log('Available to:', availableTo);
      
      const response = await axios.post(
        `${baseUrl}/api/LawyerDashBoard/add-availability-con`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Response:', response);
      
      if (response.status === 200) {
        setStartTime('');
        fetchConsultations();
        setError(''); // مسح أي أخطاء سابقة
        setSuccessMessage('تم إضافة الموعد بنجاح');
        
        // مسح رسالة النجاح بعد 3 ثواني
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }

    } catch (err) {
      console.error('Error details:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      
      if (err.response?.status === 401) {
        setError('انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول');
        navigate('/login');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'بيانات غير صحيحة، يرجى التحقق من التواريخ');
      } else {
        setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة الموعد');
      }
    } finally {
      setLoading(false);
    }
  };

  // جلب المواعيد
  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let endpoint;
      if (userType === 'lawyer') {
        endpoint = `${baseUrl}/api/LawyerDashBoard/available-slots`;
      } else {
        endpoint = `${baseUrl}/api/ClientDashBoard/client-consultations?includeCompleted=false`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Fetched consultations:', response.data);
      setConsultations(response.data);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  // حذف موعد
  const handleDeleteConsultation = async (consultationId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      return;
    }

    setDeletingId(consultationId);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Deleting consultation with ID:', consultationId);

      const response = await axios.delete(
        `${baseUrl}/api/LawyerDashBoard/lawyer-delete-availability?availabilityId=${consultationId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setSuccessMessage('تم حذف الموعد بنجاح');
        fetchConsultations(); // تحديث القائمة
        
        // مسح رسالة النجاح بعد 3 ثواني
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error deleting consultation:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      setError(err.response?.data?.message || 'حدث خطأ أثناء حذف الموعد');
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  // جلب الاستشارات (الحجوزات) للمحامي
  const fetchLawyerConsultations = async () => {
    if (userType !== 'lawyer') return;
    setLawyerConsultationsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const endpoint = `${baseUrl}/api/LawyerDashBoard/lawyer-consultations?includeCompleted=true`;
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setLawyerConsultations(response.data);
    } catch (err) {
      setLawyerConsultationsError(err.response?.data?.message || 'حدث خطأ أثناء جلب الاستشارات');
    } finally {
      setLawyerConsultationsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
    if (userType === 'lawyer') fetchLawyerConsultations();
  }, [userType]);

  // تقسيم الاستشارات إلى نشطة ومنتهية
  const now = new Date();
  const activeConsultations = lawyerConsultations.filter(c => {
    // إذا كان status موجودًا
    if (c.status) {
      return c.status !== 'Completed' && c.status !== 'Cancelled';
    }
    // أو حسب الوقت
    return new Date(c.consultationDate) > now;
  });
  const endedConsultations = lawyerConsultations.filter(c => {
    if (c.status) {
      return c.status === 'Completed' || c.status === 'Cancelled';
    }
    return new Date(c.consultationDate) <= now;
  });

  return (
    <div className={styles["consultation-container"]}>
      <h2>{userType === 'lawyer' ? 'إدارة مواعيد الاستشارات' : 'حجوزات الاستشارات'}</h2>

      {/* Tabs for lawyer only */}
      {userType === 'lawyer' && (
        <div className={styles["profile-tabs"]} style={{ marginBottom: '1.5rem' }}>
          <button
            className={`${styles["tab-button"]} ${activeTab === 'available' ? styles.active : ''}`}
            onClick={() => setActiveTab('available')}
          >
            المواعيد المتاحة
          </button>
          <button
            className={`${styles["tab-button"]} ${activeTab === 'consultations' ? styles.active : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            الاستشارات
          </button>
        </div>
      )}

      {/* محتوى التبويبات */}
      {userType === 'lawyer' ? (
        <>
          {activeTab === 'available' && (
            <>
              <div className={styles["add-availability-form"]}>
                <h3>إضافة موعد جديد</h3>
                <div className={styles["form-group"]}>
                  <label>وقت بداية الاستشارة:</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className={styles["time-info"]}>
                  <p>وقت نهاية الاستشارة: {startTime ? formatDate(calculateEndTime(startTime)) : '--'}</p>
                  <p>مدة الاستشارة: {consultationDurationHours} ساعات</p>
                </div>
                {formError && <div className={styles["error-message"]}>{formError}</div>}
                {error && <div className={styles["error-message"]}>{error}</div>}
                {successMessage && <div className={styles["success-message"]}>{successMessage}</div>}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddConsultation();
                  }}
                  disabled={!startTime || loading}
                  className={styles["add-availability-button"]}
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ الموعد'}
                </button>
              </div>
              <div className={styles["consultation-list"]}>
                <h3>مواعيدك المتاحة</h3>
                {loading ? (
                  <p className={styles["loading"]}>جاري تحميل البيانات...</p>
                ) : consultations.length === 0 ? (
                  <p className={styles["no-consultations"]}>لا توجد مواعيد متاحة</p>
                ) : (
                  <ul>
                    {consultations.map((consultation) => (
                      <li key={consultation.id} className={`${styles["consultation-item"]} ${consultation.isBooked ? styles.booked : styles.available}`}>
                        <div className={styles["consultation-info"]}>
                          <p className={styles["date-arabic"]}>{`${consultation.availableFromDateFormatted} - ${consultation.availableToDateFormatted}`}</p>
                          <p className={styles["time-range"]}>المدة: {consultationDurationHours} ساعات</p>
                          <span className={`${styles["status-badge"]} ${consultation.isBooked ? styles.booked : styles.available}`}>{consultation.isBooked ? 'محجوز' : 'متاح'}</span>
                          {consultation.clientName && (
                            <div className={styles["profile-info"]}>
                              <p>العميل: {consultation.clientName}</p>
                            </div>
                          )}
                        </div>
                        <div className={styles["consultation-actions"]}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteConsultation(consultation.id);
                            }}
                            className={`${styles["delete-button"]} ${deletingId === consultation.id ? styles.success : ''}`}
                            disabled={loading}
                          >
                            <span>حذف</span>
                            <div className={styles.icon}>
                              <i className={`fa ${deletingId === consultation.id ? 'fa-check' : 'fa-remove'}`}></i>
                            </div>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
          {activeTab === 'consultations' && (
            <div className={styles["consultation-list"]}>
              <h3>الاستشارات</h3>
              {lawyerConsultationsLoading ? (
                <p className={styles["loading"]}>جاري تحميل الاستشارات...</p>
              ) : lawyerConsultations.length === 0 ? (
                <p className={styles["no-consultations"]}>لا توجد استشارات</p>
              ) : (
                <>
                  <h4>الاستشارات النشطة</h4>
                  {activeConsultations.length === 0 ? <p>لا يوجد استشارات نشطة</p> : (
                    <ul>
                      {activeConsultations.map((consultation) => (
                        <li key={consultation.id} className={styles["consultation-item"]}>
                          <div className={styles["consultation-info"]}>
                            <p className={styles["date-arabic"]}>{consultation.consultationDateFormatted}</p>
                            <p className={styles["time-range"]}>المدة: {consultation.duration || consultationDurationHours + ' ساعات'}</p>
                            <span className={styles["status-badge"]}>{consultation.status === 'Booked' ? 'محجوز' : consultation.status}</span>
                            {consultation.clientName && (
                              <div className={styles["profile-info"]}>
                                <p>العميل: {consultation.clientName}</p>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <h4>الاستشارات المنتهية</h4>
                  {endedConsultations.length === 0 ? <p>لا يوجد استشارات منتهية</p> : (
                    <ul>
                      {endedConsultations.map((consultation) => (
                        <li key={consultation.id} className={styles["consultation-item"]}>
                          <div className={styles["consultation-info"]}>
                            <p className={styles["date-arabic"]}>{consultation.consultationDateFormatted}</p>
                            <p className={styles["time-range"]}>المدة: {consultation.duration || consultationDurationHours + ' ساعات'}</p>
                            <span className={styles["status-badge"]}>{consultation.status === 'Completed' ? 'منتهية' : consultation.status}</span>
                            {consultation.clientName && (
                              <div className={styles["profile-info"]}>
                                <p>العميل: {consultation.clientName}</p>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
              {lawyerConsultationsError && <div className={styles["error-message"]}>{lawyerConsultationsError}</div>}
            </div>
          )}
        </>
      ) : (
        // للعميل أو غير المحامي
        <div className={styles["consultation-list"]}>
          <h3>حجوزاتك</h3>
          {loading ? (
            <p className={styles["loading"]}>جاري تحميل البيانات...</p>
          ) : consultations.length === 0 ? (
            <p className={styles["no-consultations"]}>لا توجد مواعيد متاحة</p>
          ) : (
            <ul>
              {consultations.map((consultation) => (
                <li key={consultation.id} className={`${styles["consultation-item"]} ${consultation.isBooked ? styles.booked : styles.available}`}>
                  <div className={styles["consultation-info"]}>
                    <p className={styles["date-arabic"]}>{formatDate(consultation.consultationDate)}</p>
                    <p className={styles["time-range"]}>المدة: {consultationDurationHours} ساعات</p>
                    <span className={`${styles["status-badge"]} ${consultation.isBooked ? styles.booked : styles.available}`}>
                      {consultation.status === 'Booked' ? 'محجوز' : 'متاح'}
                    </span>
                    {consultation.clientName && (
                      <div className={styles["profile-info"]}>
                        <p>العميل: {consultation.clientName}</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationComponent;