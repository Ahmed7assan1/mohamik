import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = ({ setUserRole, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://mohamek-legel.runasp.net/api/Account/login', formData);

      if (!response.data?.token?.token) {
        throw new Error('No token received');
      }

      const { token, role, id } = response.data;
      localStorage.setItem('token', token.token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('lawyerId', id);
      
      if (setUserRole) {
        setUserRole(role);
      }
      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      }

      switch (role) {
        case 'Lawyer':
          navigate('/lawyer-profile');
          break;
        case 'Client':
          navigate('/client-profile');
          break;
        default:
          setError('Invalid user role. Please contact support.');
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('lawyerId');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-box"]}>
        <h2>تسجيل الدخول إلى حسابك</h2>

        {error && (
          <div className={styles["error-message"]}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="password">كلمة المرور</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="أدخل كلمة المرور"
            />
          </div>

          <button
            type="submit"
            className={styles["login-button"]}
            disabled={loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className={styles["login-footer"]}>
          <p>ليس لديك حساب؟ <a href="/register">سجل هنا</a></p>
          <a href="/forgot-password">نسيت كلمة المرور؟</a>
        </div>
      </div>
    </div>
  );
};

export default Login;