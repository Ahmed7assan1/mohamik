import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReviewComponent from '../reviews/ReviewComponent';
import ClientReviewsComponent from '../reviews/ClientReviewsComponent';
import DelegationUpload from '../delegation/DelegationUpload';
import LawyerAvailableSlots from '../lawyers/LawyerAvailableSlots';
import LawyerDelegations from '../lawyers/LawyerDelegations';
import styles from './ClientProfile.module.css';
import LogoSpinner from '../common/LogoSpinner';

const ClientProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [allConsultations, setAllConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consultationsLoading, setConsultationsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('consultations');
  const [delegation, setDelegation] = useState(null);
  const [delegationLoading, setDelegationLoading] = useState(false);
  const [delegationError, setDelegationError] = useState("");
  const [selectedLawyerId, setSelectedLawyerId] = useState('');
  const [showSlots, setShowSlots] = useState(false);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [cancelStatusMsg, setCancelStatusMsg] = useState("");
  const [lastPaymentUrl, setLastPaymentUrl] = useState("");
  const [hasBooked, setHasBooked] = useState(false);

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

  // تنسيق تاريخ الميلاد
  const formatBirthDate = (date) => {
    if (!date) return 'غير محدد';
    
    try {
      const birthDate = new Date(date);
      return birthDate.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return date; // إرجاع التاريخ كما هو إذا فشل التنسيق
    }
  };

  // جلب الحجوزات الخاصة بالعميل
  const fetchConsultations = async () => {
    setConsultationsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // جلب جميع الحجوزات (المكتملة وغير المكتملة)
      const response = await axios.get('http://mohamek-legel.runasp.net/api/ClientDashBoard/client-consultations?includeCompleted=true', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setAllConsultations(response.data);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      if (err.response?.status === 401) {
        setError('انتهت الجلسة. الرجاء تسجيل الدخول مجددًا.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setConsultationsLoading(false);
    }
  };

  // جلب تفويض العميل
  const fetchDelegation = async () => {
    setDelegationLoading(true);
    setDelegationError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      // 1. جلب قائمة التفويضات
      const listResponse = await fetch(
        "http://mohamek-legel.runasp.net/api/ClientDashBoard/client-all-delegations?includeRevokedAt=false",
        {
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!listResponse.ok) {
        const errorText = await listResponse.text();
        throw new Error(errorText || "فشل في جلب قائمة التفويضات");
      }
      const list = await listResponse.json();
      if (!Array.isArray(list) || list.length === 0) {
        setDelegation(null);
        setDelegationLoading(false);
        return;
      }
      const delegationId = list[0].id;
      // 2. جلب تفاصيل التفويض
      const detailsResponse = await fetch(
        `http://mohamek-legel.runasp.net/api/ClientDashBoard/client-detalis-delegation?delegationId=${delegationId}`,
        {
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!detailsResponse.ok) {
        const errorText = await detailsResponse.text();
        throw new Error(errorText || "فشل في جلب بيانات التفويض");
      }
      const data = await detailsResponse.json();
      setDelegation(data);
    } catch (err) {
      setDelegationError(err.message || "حدث خطأ");
    } finally {
      setDelegationLoading(false);
    }
  };

  // تحديث الحجوزات
  const handleRefreshConsultations = () => {
    fetchConsultations();
  };

  // تغيير نوع الحجوزات المعروضة
  const handleToggleCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  // تصفية الحجوزات حسب الحالة
  const getFilteredConsultations = () => {
    if (showCompleted) {
      // عرض الحجوزات المكتملة فقط
      return allConsultations.filter(consultation => 
        consultation.status === 'Completed' || 
        consultation.status === 'completed' ||
        consultation.status === 'مكتمل'
      );
    } else {
      // عرض الحجوزات غير المكتملة
      return allConsultations.filter(consultation => 
        consultation.status !== 'Completed' && 
        consultation.status !== 'completed' &&
        consultation.status !== 'مكتمل'
      );
    }
  };

  // الحصول على النص العربي للحالة
  const getStatusText = (status) => {
    if (!status) return 'غير محدد';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'booked' || statusLower === 'محجوز') {
      return 'محجوز';
    } else if (statusLower === 'completed' || statusLower === 'مكتمل') {
      return 'مكتمل';
    } else if (statusLower === 'cancelled' || statusLower === 'ملغي') {
      return 'ملغي';
    } else if (statusLower === 'pending' || statusLower === 'قيد الانتظار') {
      return 'قيد الانتظار';
    } else {
      return status; // إرجاع النص كما هو إذا كان بالعربية
    }
  };

  // الحصول على الكلاس CSS للحالة
  const getStatusClass = (status) => {
    if (!status) return 'unknown';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'booked' || statusLower === 'محجوز') {
      return 'booked';
    } else if (statusLower === 'completed' || statusLower === 'مكتمل') {
      return 'completed';
    } else if (statusLower === 'cancelled' || statusLower === 'ملغي') {
      return 'cancelled';
    } else if (statusLower === 'pending' || statusLower === 'قيد الانتظار') {
      return 'pending';
    } else {
      return 'unknown';
    }
  };

  // دالة مساعدة للحصول على القيمة أو القيمة الافتراضية
  const getValue = (obj, keys, defaultValue = 'غير محدد') => {
    if (!obj) return defaultValue;
    
    for (const key of keys) {
      // التحقق من الحقول المباشرة
      if (obj[key] && obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        return obj[key];
      }
      
      // التحقق من الحقول المتداخلة (مثل user.name)
      const nestedKeys = key.split('.');
      let nestedValue = obj;
      let found = true;
      
      for (const nestedKey of nestedKeys) {
        if (nestedValue && nestedValue[nestedKey] !== null && nestedValue[nestedKey] !== undefined) {
          nestedValue = nestedValue[nestedKey];
        } else {
          found = false;
          break;
        }
      }
      
      if (found && nestedValue && nestedValue !== '') {
        return nestedValue;
      }
    }
    return defaultValue;
  };

  const handleRevokeDelegation = async () => {
    if (!delegation || !delegation.id) return;
    if (!window.confirm("هل أنت متأكد أنك تريد إلغاء التفويض؟")) return;
    setDelegationLoading(true);
    setDelegationError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://mohamek-legel.runasp.net/api/ClientDashBoard/revoke-delgation?delegationId=${delegation.id}`,
        {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "فشل في إلغاء التفويض");
      }
      // بعد الإلغاء، حدث البيانات
      setDelegation(null);
      alert("تم إلغاء التفويض بنجاح.");
    } catch (err) {
      setDelegationError(err.message || "حدث خطأ أثناء الإلغاء");
    } finally {
      setDelegationLoading(false);
    }
  };

  // زر إلغاء الاستشارة
  const handleCancelConsultation = async (consultation) => {
    setCancelStatusMsg("");
    setCancelLoadingId(consultation.id);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCancelStatusMsg('يجب تسجيل الدخول أولاً');
        setCancelLoadingId(null);
        return;
      }
      await axios.put(
        `http://mohamek-legel.runasp.net/api/ClientDashBoard/consultation-cancel?consultationId=${consultation.consultationId || consultation.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*'
          }
        }
      );
      setCancelStatusMsg('تم إلغاء الحجز بنجاح!');
      // تحديث القائمة بعد الإلغاء
      setAllConsultations(prev => prev.map(c => c.id === consultation.id ? { ...c, status: 'Cancelled' } : c));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setCancelStatusMsg('خطأ: ' + err.response.data.message);
      } else {
        setCancelStatusMsg('حدث خطأ أثناء إلغاء الحجز');
      }
    } finally {
      setCancelLoadingId(null);
    }
  };

  function formatForAPI(date) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'AM' : 'PM'; // حسب الـ API
    const hours12 = hours % 12 || 12;
    return `${year}-${month}-${day} ${String(hours12).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  const handleGetPaymentUrl = async (consultation) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.post(
        'http://mohamek-legel.runasp.net/api/Consultation/book-consultation',
        {
          lawyerId: consultation.lawyerId,
          requestedTime: formatForAPI(consultation.consultationDate)
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
        setLastPaymentUrl(response.data.paymentUrl);
        setCancelStatusMsg(response.data.message || 'تم الحجز بنجاح!');
      } else if (response.data?.message) {
        setCancelStatusMsg(response.data.message);
      } else {
        setCancelStatusMsg('تم الحجز بنجاح!');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else if (err.response?.data?.message) {
        setCancelStatusMsg('خطأ: ' + err.response.data.message);
      } else {
        setCancelStatusMsg('حدث خطأ أثناء جلب رابط الدفع');
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://mohamek-legel.runasp.net/api/ClientDashBoard/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          setProfile(response.data);
        } else {
          setError('لم يتم العثور على بيانات الملف الشخصي.');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('انتهت الجلسة. الرجاء تسجيل الدخول مجددًا.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'حدث خطأ أثناء تحميل الملف الشخصي.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchConsultations();
    fetchDelegation();
  }, [navigate]);

  // الحصول على الحجوزات المفلترة
  const filteredConsultations = getFilteredConsultations();

  if (loading) return <LogoSpinner size={80} />;
  if (error) return <div className={styles["profile-error"]}>{error}</div>;

  return (
    <div className={styles["client-profile-container"]}>
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
          
          <h2 className={styles["client-name"]}>
            {getValue(profile, ['name', 'fullName', 'userName', 'firstName', 'user.name', 'user.fullName'], 'اسم العميل')}
          </h2>
          
          <div className={styles["contact-info"]}>
            <p>
              <strong>البريد الإلكتروني:</strong> 
              <span dir="ltr">{getValue(profile, ['email', 'userEmail', 'user.email'])}</span>
            </p>
            <p>
              <strong>رقم الهاتف:</strong> 
              <span dir="ltr">{getValue(profile, ['phone', 'phoneNumber', 'mobile', 'user.phone', 'user.phoneNumber'])}</span>
            </p>
            <p>
              <strong>تاريخ الميلاد:</strong> 
              <span dir="ltr">{formatBirthDate(getValue(profile, ['dateOfBirth', 'birthDate', 'user.dateOfBirth']))}</span>
            </p>
          </div>
          
          <button className={styles["action-btn"]} onClick={() => navigate('/services')}>
            <i className="fas fa-calendar-plus"></i> حجز استشارة جديدة
          </button>
        </aside>

        {/* Main Content */}
        <div className={styles["main-content"]}>
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
              حجوزاتي
            </button>
            <button 
              className={`${styles["tab-button"]} ${activeTab === 'delegation' ? styles.active : ''}`}
              onClick={() => setActiveTab('delegation')}
            >
              تفويضي
            </button>
            <button 
              className={`${styles["tab-button"]} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              تقييماتي
            </button>
          </div>

          {/* محتوى التبويبات */}
          <div className={styles["tab-content"]}>
            {activeTab === 'profile' && (
              <div>
                <h3>المعلومات الشخصية</h3>
                <div className={styles["contact-info"]}>
                  <p><strong>الاسم:</strong> {getValue(profile, ['name', 'fullName', 'userName', 'firstName', 'user.name', 'user.fullName'])}</p>
                  <p><strong>البريد الإلكتروني:</strong> {getValue(profile, ['email', 'userEmail', 'user.email'])}</p>
                  <p><strong>رقم الهاتف:</strong> {getValue(profile, ['phone', 'phoneNumber', 'mobile', 'user.phone', 'user.phoneNumber'])}</p>
                  <p><strong>تاريخ الميلاد:</strong> {formatBirthDate(getValue(profile, ['dateOfBirth', 'birthDate', 'user.dateOfBirth']))}</p>
                </div>
              </div>
            )}

            {activeTab === 'consultations' && (
              <div className={styles["consultations-section"]}>
                <div style={{marginBottom: '2rem', background: '#f8f8f8', padding: '1rem', borderRadius: 8}}>
                  <h4>احجز موعد مع محامي</h4>
                  <input
                    type="text"
                    placeholder="ادخل رقم المحامي (ID)"
                    value={selectedLawyerId}
                    onChange={e => setSelectedLawyerId(e.target.value)}
                    className={styles["lawyer-id-input"]}
                    disabled={hasBooked}
                  />
                  <button
                    className={styles["show-slots-btn"]}
                    onClick={() => setShowSlots(true)}
                    disabled={!selectedLawyerId || hasBooked}
                  >
                    عرض المواعيد المتاحة
                  </button>
                  {showSlots && selectedLawyerId && (
                    <LawyerAvailableSlots lawyerId={selectedLawyerId} onBook={() => setHasBooked(true)} />
                  )}
                </div>
                <div className={styles["section-header"]}>
                  <h3 className={styles["section-title"]}>
                    حجوزاتي 
                    <span className={styles["consultations-count"]}>
                      ({filteredConsultations.length})
                    </span>
                    <span className={styles["total-count"]}>
                      من أصل {allConsultations.length} حجز
                    </span>
                  </h3>
                  <div className={styles["section-controls"]}>
                    <button 
                      className={styles["toggle-button"]}
                      onClick={handleToggleCompleted}
                    >
                      <i className={`fas ${showCompleted ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      {showCompleted ? ' إخفاء المكتملة' : ' عرض المكتملة'}
                    </button>
                    <button 
                      className={styles["refresh-button"]}
                      onClick={handleRefreshConsultations}
                      disabled={consultationsLoading}
                    >
                      <i className={`fas ${consultationsLoading ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`}></i>
                      {consultationsLoading ? ' جاري التحديث...' : ' تحديث'}
                    </button>
                  </div>
                </div>
                
                {consultationsLoading ? (
                  <div className={styles["loading"]}>جاري تحميل الحجوزات...</div>
                ) : filteredConsultations.length === 0 ? (
                  <div className={styles["no-consultations"]}>
                    <p>لا توجد حجوزات {showCompleted ? 'مكتملة' : 'حالية'}</p>
                  </div>
                ) : (
                  <div className={styles["consultations-list"]}>
                    {filteredConsultations.map((consultation) => {
                      // تحقق من الشروط المطلوبة
                      const isSaul = consultation.lawyerName === 'Saul Goodman';
                      const isAvailable = consultation.status === 'Available';
                      const isCancellable = consultation.status === 'Scheduled';
                      // التواريخ المطلوبة
                      const targetDates = [
                        'الأربعاء، ٢ يوليو ٢٠٢٥ في ٠٨:٣٦ م',
                        'السبت، ٢٨ يونيو ٢٠٢٥ في ٠٤:٠٥ م'
                      ];
                      const isTargetDate = targetDates.includes(formatDate(consultation.consultationDate));
                      return (
                        <div key={consultation.id} className={styles["consultation-item"]}>
                          <div className={styles["consultation-info"]}>
                            <h4 className={styles["lawyer-name"]}>
                              المحامي: {consultation.lawyerName || 'غير محدد'}
                            </h4>
                            <p className={styles["consultation-date"]}>
                              التاريخ: {formatDate(consultation.consultationDate)}
                            </p>
                            <p className={styles["consultation-status"]}>
                              الحالة: 
                              <span className={`${styles["status-badge"]} ${styles[getStatusClass(consultation.status)]}`}>
                                {getStatusText(consultation.status)}
                              </span>
                            </p>
                            {consultation.notes && (
                              <p className={styles["consultation-notes"]}>
                                ملاحظات: {consultation.notes}
                              </p>
                            )}
                            {/* زر الإلغاء للشروط المطلوبة */}
                            {isSaul && isCancellable && (
                              <button
                                className={styles["refresh-button"]}
                                style={{ background: '#e74c3c', color: '#fff', marginTop: 8 }}
                                onClick={() => handleCancelConsultation(consultation)}
                                disabled={cancelLoadingId === consultation.id}
                              >
                                {cancelLoadingId === consultation.id ? 'جاري الإلغاء...' : 'إلغاء الاستشارة'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {cancelStatusMsg && (
                  <div style={{ color: cancelStatusMsg.includes('نجاح') ? 'green' : 'red', margin: '1rem 0', textAlign: 'center' }}>
                    {cancelStatusMsg}
                    {lastPaymentUrl && (
                      <button
                        style={{ margin: '1rem auto', display: 'block', background: '#27ae60', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer', border: 'none' }}
                        onClick={() => window.open(lastPaymentUrl, '_blank', 'noopener,noreferrer')}
                      >
                        اتمام الدفع
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'delegation' && (
              <div className={styles["consultations-section"]}>
                <h3 className={styles["section-title"]}>تفويض العميل</h3>
                {delegationLoading ? (
                  <div className={styles["loading"]}>جاري تحميل بيانات التفويض...</div>
                ) : delegationError ? (
                  <div className={styles["profile-error"]}>{delegationError}</div>
                ) : delegation ? (
                  <>
                    <table className={styles.table} style={{width: '100%', background: '#fafbfc', borderRadius: 8}}>
                      <thead>
                        <tr>
                          <th>اسم العميل</th>
                          <th>اسم المحامي</th>
                          <th>تاريخ الإلغاء</th>
                          <th>رابط الوثيقة</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{delegation.clientName}</td>
                          <td>{delegation.lawyerName}</td>
                          <td>{delegation.revokedAtDateFormatted || 'غير متوفر'}</td>
                          <td>
                            {delegation.delegationDocumentPath ? (
                              <a href={delegation.delegationDocumentPath} target="_blank" rel="noopener noreferrer">
                                تحميل الوثيقة
                              </a>
                            ) : 'لا يوجد'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button
                      className={styles["action-btn"]}
                      style={{marginTop: 16, background: '#c0392b'}}
                      onClick={handleRevokeDelegation}
                      disabled={delegationLoading}
                    >
                      إلغاء التفويض
                    </button>
                  </>
                ) : (
                  <DelegationUpload />
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles["reviews-section"]}>
                <h3>تقييماتي للمحامين</h3>
                <p className={styles["reviews-description"]}>
                  يمكنك هنا إضافة تقييمات جديدة للمحامين الذين استشرتهم، أو تعديل وحذف التقييمات الموجودة.
                </p>
                <ClientReviewsComponent 
                  clientId={profile?.id}
                  clientName={getValue(profile, ['name', 'fullName', 'userName', 'firstName', 'user.name', 'user.fullName'])}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
