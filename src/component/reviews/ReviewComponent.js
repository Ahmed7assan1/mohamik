import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ReviewComponent.module.css';

// دوال التحويل
const uiToBackendRating = (uiRating) => Math.min(4, Math.max(0, uiRating - 1));
const backendToUiRating = (backendRating) => {
  if (typeof backendRating === 'string') {
    const ratingMap = {
      'FiveStars': 5, 'FourStars': 4, 'ThreeStars': 3, 
      'TwoStars': 2, 'OneStar': 1, 'ZeroStars': 1
    };
    return ratingMap[backendRating] || 1;
  }
  return Math.min(5, Math.max(1, backendRating + 1));
};

const ReviewComponent = ({ lawyerId, userRole, clientId }) => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ rating: 5, comment: '', lawyerId });
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [lawyerId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews?lawyerId=${lawyerId}`);
      const processedData = response.data.map(review => ({
        ...review,
        uiRating: backendToUiRating(review.rating)
      }));
      setReviews(processedData);
      console.log('Fetched reviews:', response.data);
      console.log('Processed reviews (with uiRating):', processedData);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting rating (UI):', formData.rating);
      const apiData = {
        ...formData,
        rating: uiToBackendRating(formData.rating),
        lawyerId
      };
      console.log('Submitting rating (to backend):', apiData.rating);
      await axios.post('/api/reviews', apiData);
      fetchReviews();
      resetForm();
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  const resetForm = () => {
    setFormData({ rating: 5, comment: '', lawyerId });
    setEditingReview(null);
  };

  const renderStars = (uiRating) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`${styles.star} ${star <= uiRating ? styles.filled : ''}`}
          >
            ★
          </span>
        ))}
        <span className={styles.ratingText}>
          {uiRating} {uiRating === 1 ? 'نجمة' : 'نجوم'}
        </span>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* نموذج التقييم */}
      <form onSubmit={handleSubmit}>
        <div className={styles.ratingInput}>
          <label>التقييم:</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
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
        </div>
        {/* باقي العناصر */}
      </form>

      {/* عرض التقييمات */}
      <div className={styles.reviewsList}>
        {reviews.map(review => (
          <div key={review.id} className={styles.reviewItem} style={{marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem'}}>
            <div className={styles.reviewHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
              <div className={styles.reviewerInfo} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem'}}>
                <span className={styles.reviewerName} style={{fontWeight: 'bold', color: '#03142D', fontSize: '1.1rem'}}>
                  {review.clientName ? `بواسطة: ${review.clientName}` : ''}
                </span>
                <div className={styles.reviewRating} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  {[1,2,3,4,5].map((star) => (
                    <span
                      key={star}
                      className={`${styles.star} ${star <= review.uiRating ? styles.filled : ''}`}
                      style={{fontSize: '1.2rem'}}>
                      ★
                    </span>
                  ))}
                  <span className={styles.ratingText} style={{color: '#827133', fontWeight: 'bold'}}>
                    {review.uiRating} {review.uiRating === 1 ? 'نجمة' : 'نجوم'}
                  </span>
                </div>
              </div>
              {userRole === 'client' && (
                <div className={styles.reviewActions}>
                  <button 
                    className={styles.deleteBtnAnimated}
                    onClick={() => {/* ضع هنا دالة الحذف المناسبة */}}
                  >
                    <span>حذف</span>
                    <div className={styles.icon}>
                      <i className="fa fa-remove"></i>
                    </div>
                  </button>
                </div>
              )}
            </div>
            <div className={styles.reviewComment} style={{marginTop: '0.7rem', color: '#495057', fontSize: '1rem', background: '#f8f9fa', borderRadius: '6px', padding: '0.8rem 1rem'}}>
              {review.comment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewComponent;