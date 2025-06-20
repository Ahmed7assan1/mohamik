import React, { useState, useEffect } from 'react';
import styles from './LawyerDescription.module.css';
import LogoSpinner from '../common/LogoSpinner';

const LawyerDescription = ({ lawyerId }) => {
  const [description, setDescription] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    yearsOfExperience: 0,
    education: '',
    officeLocation: '',
    lawyerId: lawyerId
  });

  useEffect(() => {
    fetchDescription();
  }, [lawyerId]);

  const fetchDescription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://mohamek-legel.runasp.net/api/LawyerDescription/get-description-throw-lawyer?lawyerId=${lawyerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setDescription(data);
          setFormData({
            bio: data.bio || '',
            yearsOfExperience: data.yearsOfExperience || 0,
            education: data.education || '',
            officeLocation: data.officeLocation || '',
            lawyerId: lawyerId
          });
        }
      } else {
        console.log('No description found.');
      }
    } catch (error) {
      console.error("Error fetching description:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'yearsOfExperience') {
      const nonNegativeValue = Math.max(0, parseInt(value) || 0);
      setFormData(prev => ({ ...prev, [name]: nonNegativeValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const endpoint = description
      ? `http://mohamek-legel.runasp.net/api/LawyerDescription/edit-lawyer-discription`
      : `http://mohamek-legel.runasp.net/api/LawyerDescription/create-lawyer-description`;
      const method = description ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في الحفظ");
      }

      const result = await response.json();
      alert("✅ تم الحفظ بنجاح!");
      await fetchDescription();
      setIsEditing(false);
    } catch (error) {
      console.error("Error:", error);
      alert(`❌ خطأ: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!description) return;
    
    if (!window.confirm('هل أنت متأكد من حذف الوصف المهني؟')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://mohamek-legel.runasp.net/api/LawyerDescription/delete-lawyer-description', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: description.id })
      });

      if (response.ok) {
        alert("🗑️ تم حذف الوصف المهني.");
        setDescription(null);
        setFormData({
          bio: '',
          yearsOfExperience: 0,
          education: '',
          officeLocation: '',
          lawyerId: lawyerId
        });
        setIsEditing(true);
      } else {
        throw new Error("فشل في الحذف");
      }
    } catch (error) {
      console.error("Error deleting description:", error);
      alert(`❌ خطأ أثناء الحذف: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles["lawyer-description-container"]}>
      <h2>الوصف المهني</h2>

      {/* Show spinner when loading */}
      {!isEditing && !description && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <LogoSpinner size={80} />
        </div>
      )}

      {!isEditing && description ? (
        <div className={styles["description-view"]}>
          <p><strong>السيرة الذاتية:</strong> {description.bio}</p>
          <p><strong>سنوات الخبرة:</strong> {description.yearsOfExperience}</p>
          <p><strong>التعليم:</strong> {description.education}</p>
          <p><strong>موقع المكتب:</strong> {description.officeLocation}</p>
          <div className={styles["action-buttons"]}>
            <button onClick={() => setIsEditing(true)}>تعديل</button>
            <button 
              onClick={handleDelete} 
              className={`${styles["delete-btn"]} ${isDeleting ? styles.success : ''}`}
              disabled={isDeleting}
            >
              <span>حذف</span>
              <div className={styles.icon}>
                <i className={`fa ${isDeleting ? 'fa-check' : 'fa-remove'}`}></i>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles["description-form"]}>
          <label>
            السيرة الذاتية:
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            سنوات الخبرة:
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              min="0"
              required
            />
          </label>
          <label>
            التعليم:
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            موقع المكتب:
            <input
              type="text"
              name="officeLocation"
              value={formData.officeLocation}
              onChange={handleInputChange}
              required
            />
          </label>
          <div className={styles["form-actions"]}>
            <button type="submit">💾 حفظ</button>
            {description && (
              <button type="button" onClick={() => setIsEditing(false)}>إلغاء</button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default LawyerDescription;
