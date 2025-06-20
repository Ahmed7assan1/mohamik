import React, { useState, useRef } from 'react';
import styles from './DelegationUpload.module.css';

const DelegationUpload = () => {
  const [lawyerId, setLawyerId] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setMessage('');
      } else {
        setMessage('يرجى رفع ملف PDF فقط');
      }
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('يرجى رفع ملف PDF فقط');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lawyerId) {
      setMessage('يرجى إدخال رقم المحامي');
      return;
    }
    if (!file) {
      setMessage('يرجى رفع ملف PDF');
      return;
    }
    setLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('LawyerId', lawyerId);
    formData.append('DelegationDocument', file);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://mohamek-legel.runasp.net/api/Delegation/request-delgation', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setMessage('تم رفع التفويض بنجاح!');
        setFile(null);
        setLawyerId('');
      } else {
        const errorText = await res.text();
        setMessage('حدث خطأ أثناء رفع التفويض: ' + errorText);
      }
    } catch (err) {
      setMessage('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        رقم المحامي:
        <input
          type="text"
          value={lawyerId}
          onChange={(e) => setLawyerId(e.target.value)}
          className={styles.input}
          required
        />
      </label>
      <div
        className={
          dragActive ? `${styles.dropArea} ${styles.active}` : styles.dropArea
        }
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        {file ? (
          <span>{file.name}</span>
        ) : (
          <span>اسحب ملف PDF هنا أو اضغط للاختيار</span>
        )}
        <input
          type="file"
          accept="application/pdf"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'جاري الرفع...' : 'رفع التفويض'}
      </button>
      {message && <div className={styles.message}>{message}</div>}
    </form>
  );
};

export default DelegationUpload; 