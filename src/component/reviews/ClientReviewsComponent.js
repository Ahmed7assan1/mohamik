import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ReviewComponent.module.css';

const ClientReviewsComponent = ({ clientId, clientName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 1,
    comment: '',
    lawyerId: ''
  });
  const [averageRating, setAverageRating] = useState(0);
  const [lawyerName, setLawyerName] = useState('');
  const [lawyersMap, setLawyersMap] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchClientReviews(token);
    }
  }, [clientId]);

  useEffect(() => {
    const fetchLawyersNames = async () => {
      const token = localStorage.getItem('token');
      const uniqueLawyerIds = [...new Set(reviews.map(r => r.lawyerId))];
      const newLawyersMap = { ...lawyersMap };
      for (const lawyerId of uniqueLawyerIds) {
        if (!lawyerId || newLawyersMap[lawyerId]) continue;
        try {
          const response = await axios.get(
            `http://mohamek-legel.runasp.net/api/LayOut/get-lawyer-by-id?id=${lawyerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          newLawyersMap[lawyerId] = response.data?.fullName || response.data?.name || 'محامي غير موجود';
        } catch {
          newLawyersMap[lawyerId] = 'محامي غير موجود';
        }
      }
      setLawyersMap(newLawyersMap);
    };
    if (reviews.length > 0) fetchLawyersNames();
    // eslint-disable-next-line
  }, [reviews]);

  const fetchClientReviews = async (token) => {
    try {
      console.log('Fetching client reviews...');
      console.log('Current clientId:', clientId);
      console.log('Current clientName:', clientName);
      
      // محاولة الحصول على clientId من localStorage
      const storedClientId = localStorage.getItem('clientId');
      const storedClientName = localStorage.getItem('clientName');
      console.log('Stored clientId:', storedClientId);
      console.log('Stored clientName:', storedClientName);
      
      // استخدام الـ endpoint الصحيح لجلب تقييمات العميل
      const response = await axios.get(
        `http://mohamek-legel.runasp.net/api/ClientDashBoard/all-reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Raw API response:', response.data);
      
      if (response.data) {
        // تأكد من أن البيانات مصفوفة
        const reviewsData = Array.isArray(response.data) ? response.data : [];
        console.log('Client reviews from API:', reviewsData);
        
        setReviews(reviewsData);
        calculateAverageRating(reviewsData);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error('Error fetching client reviews:', err);
      setError('حدث خطأ أثناء جلب التقييمات');
      setReviews([]); // تعيين مصفوفة فارغة في حالة الخطأ
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // التحقق من صحة البيانات
    if (!formData.lawyerId.trim()) {
      setError('يرجى إدخال معرف المحامي');
      return;
    }

    if (!formData.comment.trim()) {
      setError('يرجى إدخال تعليق');
      return;
    }

    if (lawyerName === 'محامي غير موجود') {
      setError('المحامي غير موجود، يرجى التحقق من المعرف');
      return;
    }

    // التحقق من أن التقييم في النطاق الصحيح (من 1 إلى 5 في الفورم)
    if (formData.rating < 1 || formData.rating > 5) {
      setError('التقييم يجب أن يكون من 1 إلى 5 نجوم');
      return;
    }

    // تجهيز البيانات للإرسال (البيانات الأساسية فقط)
    const apiData = {
      rating: parseInt(formData.rating, 10) - 1, // UI 1-5 => backend 0-4
      comment: formData.comment.trim(),
      lawyerId: formData.lawyerId.trim().replace(/\s/g, '')
    };

    // إزالة الحقول الفارغة أو undefined
    Object.keys(apiData).forEach(key => {
      if (apiData[key] === undefined || apiData[key] === null || apiData[key] === '') {
        delete apiData[key];
      }
    });

    // التحقق النهائي من البيانات قبل الإرسال (من 0 إلى 4 للـ API)
    if (apiData.rating < 0 || apiData.rating > 4) {
      setError('خطأ في التقييم، يرجى المحاولة مرة أخرى');
      return;
    }

    if (!apiData.comment || apiData.comment.trim().length === 0) {
      setError('التعليق مطلوب');
      return;
    }

    if (!apiData.lawyerId || apiData.lawyerId.trim().length === 0) {
      setError('معرف المحامي مطلوب');
      return;
    }

    // التحقق من صحة UUID
    if (!isValidUUID(apiData.lawyerId)) {
      setError('معرف المحامي غير صحيح (يجب أن يكون UUID صحيح)');
      return;
    }

    // التأكد من أن التقييم رقم صحيح
    if (!Number.isInteger(apiData.rating) || isNaN(apiData.rating)) {
      setError('التقييم يجب أن يكون رقم صحيح');
      return;
    }

    console.log('=== DEBUG INFO ===');
    console.log('Original formData:', formData);
    console.log('Rating to send:', formData.rating);
    console.log('Rating type:', typeof formData.rating);
    console.log('Comment:', formData.comment);
    console.log('LawyerId:', formData.lawyerId);
    console.log('Processed apiData:', apiData);
    console.log('API Data JSON:', JSON.stringify(apiData, null, 2));
    console.log('Token exists:', !!token);
    console.log('Lawyer name:', lawyerName);
    console.log('==================');

    try {
      if (editingReview) {
        // تعديل تقييم
        console.log('Updating review...');
        const response = await axios.put(
          'http://mohamek-legel.runasp.net/api/Review/edit-review',
          apiData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Update response:', response.data);
      } else {
        // إضافة تقييم جديد
        console.log('Creating new review...');
        const response = await axios.post(
          'http://mohamek-legel.runasp.net/api/Review/create-review',
          apiData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        console.log('Create response:', response.data);
      }

      // إعادة جلب التقييمات
      await fetchClientReviews(token);
      resetForm();
      setError(null);
      
      // إظهار رسالة نجاح
      if (editingReview) {
        alert('تم تحديث التقييم بنجاح! ✅');
      } else {
        alert('تم إضافة التقييم بنجاح! ✅');
      }
    } catch (err) {
      console.error('=== API ERROR DETAILS ===');
      console.error('Error message:', err.message);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      console.error('Errors array:', err.response?.data?.erros);
      console.error('Request data sent:', apiData);
      console.error('Request URL:', 'http://mohamek-legel.runasp.net/api/Review/create-review');
      console.error('Request method:', 'POST');
      console.error('========================');
      
      if (err.response?.status === 400) {
        let errorMessage = 'يرجى التحقق من البيانات المدخلة';
        
        // التحقق من وجود errors array
        if (err.response.data?.erros && Array.isArray(err.response.data.erros)) {
          errorMessage = err.response.data.erros.join(', ');
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
        
        setError(`خطأ في البيانات: ${errorMessage}`);
      } else if (err.response?.status === 401) {
        setError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      } else {
        setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ التقييم');
      }
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://mohamek-legel.runasp.net/api/Review/delete-review?Id=${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      await fetchClientReviews(token);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء حذف التقييم');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      rating: convertRatingToNumber(review.rating),
      comment: review.comment,
      lawyerId: review.lawyerId
    });
    setShowForm(true);
    checkLawyerExists(review.lawyerId);
  };

  const getRatingText = (uiRating) => {
    switch (uiRating) {
      case 1: return "نجمة واحدة";
      case 2: return "نجمتان";
      case 3: return "3 نجوم";
      case 4: return "4 نجوم";
      case 5: return "5 نجوم";
      default: return "";
    }
  };

  const resetForm = () => {
    setFormData({
      rating: 1,
      comment: '',
      lawyerId: ''
    });
    setShowForm(false);
    setEditingReview(null);
    setLawyerName('');
  };

  const getLawyerName = (lawyerId) => {
    if (lawyerId && lawyersMap[lawyerId]) {
      return lawyersMap[lawyerId];
    }
    return 'محامي غير موجود';
  };

  const calculateAverageRating = (reviewsData) => {
    if (!Array.isArray(reviewsData) || reviewsData.length === 0) {
      setAverageRating(0);
      return;
    }
    
    const totalRating = reviewsData.reduce((sum, review) => {
      const ratingValue = convertRatingToNumber(review.rating);
      return sum + ratingValue;
    }, 0);
    
    const avg = (totalRating / reviewsData.length).toFixed(1);
    setAverageRating(avg);
  };

  // دالة للتحقق من وجود المحامي عند إدخال الـ ID
  const checkLawyerExists = async (lawyerId) => {
    if (!lawyerId.trim()) {
      setLawyerName('');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://mohamek-legel.runasp.net/api/LayOut/get-lawyer-by-id?id=${lawyerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        const name = response.data.fullName || response.data.name || 'محامي غير محدد';
        setLawyerName(name);
        console.log('Lawyer found:', name);
      } else {
        setLawyerName('محامي غير موجود');
      }
    } catch (err) {
      console.error('Error checking lawyer:', err);
      setLawyerName('محامي غير موجود');
    }
  };

  // دالة للتعامل مع تغيير ID المحامي
  const handleLawyerIdChange = (e) => {
    const newLawyerId = e.target.value;
    setFormData({...formData, lawyerId: newLawyerId});
    checkLawyerExists(newLawyerId);
  };

  // دالة لتحويل التقييم من نص إلى رقم
  const convertRatingToNumber = (rating) => {
    if (typeof rating === 'number') {
      if (rating >= 0 && rating <= 4) return rating + 1;
      if (rating === 5) return 5;
      return 1;
    }
    if (typeof rating === 'string') {
      switch (rating) {
        case "FiveStars": return 5;
        case "FourStars": return 4;
        case "ThreeStars": return 3;
        case "TwoStars": return 2;
        case "OneStar": return 1;
        case "ZeroStars": return 1;
        default: return 1;
      }
    }
    return 1;
  };

  // دالة للتحقق من صحة UUID
  const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  if (loading) {
    return <div className={styles.loading}>جاري تحميل التقييمات...</div>;
  }

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.reviewHeader}>
        <h3>تقييماتي للمحامين</h3>
        <div className={styles.reviewCount}>
          {reviews.length} تقييم
        </div>
      </div>

      {/* نموذج إضافة/تعديل التقييم */}
      <div className={styles.formSection}>
        {!showForm ? (
          <button 
            className={styles.addReviewBtn}
            onClick={() => setShowForm(true)}
          >
            إضافة تقييم جديد
          </button>
        ) : (
          <form onSubmit={handleSubmit} className={styles.reviewForm}>
            <h4>{editingReview ? 'تعديل التقييم' : 'إضافة تقييم جديد'}</h4>
            
            <div className={styles.lawyerSelect}>
              <label>اختر المحامي:</label>
              <input
                type="text"
                value={formData.lawyerId}
                onChange={handleLawyerIdChange}
                placeholder="أدخل معرف المحامي (UUID)"
                required
              />
            </div>

            <div className={styles.lawyerName}>
              <label>اسم المحامي:</label>
              <span>{lawyerName}</span>
            </div>

            <div className={styles.ratingInput}>
              <label>التقييم:</label>
              <div className={styles.starSelector}>
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.starBtn} ${star <= formData.rating ? styles.selected : ''}`}
                    onClick={() => setFormData({...formData, rating: star})}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className={styles.ratingText}>
                {getRatingText(formData.rating)}
              </span>
            </div>

            <div className={styles.commentInput}>
              <label>التعليق:</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                placeholder="اكتب تعليقك هنا..."
                required
                rows="4"
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>
                {editingReview ? 'تحديث التقييم' : 'إضافة التقييم'}
              </button>
              <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={resetForm}
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>

      {/* قائمة التقييمات */}
      <div className={styles.reviewsList}>
        {!Array.isArray(reviews) || reviews.length === 0 ? (
          <div className={styles.noReviews}>
            لا توجد تقييمات بعد. ابدأ بإضافة تقييم جديد!
          </div>
        ) : (
          reviews.map((review) => {
            const uiRating = convertRatingToNumber(review.rating);
            console.log('Raw rating from backend:', review.rating);
            console.log('UI rating after convert:', uiRating);
            return (
              <div key={review.id} className={styles.reviewItem} style={{marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem'}}>
                <div className={styles.reviewHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                  <div className={styles.reviewerInfo} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem'}}>
                    <span className={styles.reviewerName} style={{fontWeight: 'bold', color: '#03142D', fontSize: '1.1rem'}}>
                      المحامي: {getLawyerName(review.lawyerId)}
                    </span>
                    <div className={styles.reviewRating} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      {[1,2,3,4,5].map((star) => (
                        <span
                          key={star}
                          className={`${styles.star} ${star <= uiRating ? styles.filled : ''}`}
                          style={{fontSize: '1.2rem'}}
                        >
                          ★
                        </span>
                      ))}
                      <span className={styles.ratingText} style={{color: '#827133', fontWeight: 'bold'}}>
                        {getRatingText(uiRating)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.reviewActions}>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEdit(review)}
                    >
                      تعديل
                    </button>
                    <button 
                      className={styles.deleteBtnAnimated}
                      onClick={() => handleDelete(review.id)}
                    >
                      <span>حذف</span>
                      <div className={styles.icon}>
                        <i className="fa fa-remove"></i>
                      </div>
                    </button>
                  </div>
                </div>
                <div className={styles.reviewComment} style={{marginTop: '0.7rem', color: '#495057', fontSize: '1rem', background: '#f8f9fa', borderRadius: '6px', padding: '0.8rem 1rem'}}>
                  {review.comment}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClientReviewsComponent; 