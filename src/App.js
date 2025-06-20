import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Nav from './component/common/Navbar';
import ServicesPage from './component/services/ServicesPage';
import Mission from './component/about/Mission';
import Info from './component/about/Info';
import UniqueServices from './component/services/UniqueServices';
import Callus from './component/contact/Callus';
import OurName from './component/about/OurName';
import FormData from './component/contact/FormData';
import LawyerProfile from './component/lawyers/LawyerProfile';
import ClientProfile from './component/clients/ClientProfile';
import LawyerList from './component/lawyers/LawyerList';
import Login from './component/auth/Login';
import { useEffect, useState } from 'react';
import Profile from './component/lawyers/Profile';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (token && role) {
      setUserRole(role);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('lawyerId');
    setUserRole(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App" dir="rtl" lang="ar">
        <Nav userRole={userRole} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<Navigate to="/company" />} />
          <Route path="/login" element={
            isAuthenticated ? 
              (userRole === 'Lawyer' ? <Navigate to="/lawyer-profile" /> : <Navigate to="/client-profile" />) 
              : <Login setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />
          } />
          
          {/* Public routes */}
          <Route path="/company" element={
            <>
              <Info
                title={"عننا"}
                paragraph={`"محاميك" هو أول تطبيق وموقع مصري متخصص في تسهيل الوصول إلى الخدمات القانونية...`} 
                backgroundImage="/pics/image66.png"
              />
              <OurName />
              <FormData />
              <UniqueServices />
              <Callus />
              <Mission />
            </>
          } />
          <Route path="/services" element={<ServicesPage />} />
          
          {/* Protected routes based on role */}
          <Route 
            path="/lawyer-profile" 
            element={
              isAuthenticated && userRole === 'Lawyer' ? 
                <LawyerProfile /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/client-profile" 
            element={
              isAuthenticated && userRole === 'Client' ? 
                <ClientProfile /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/lawyers" 
            element={
              isAuthenticated ? 
                <LawyerList /> : 
                <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;