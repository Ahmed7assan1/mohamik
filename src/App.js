import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from './component/Navbar';
import ServicesPage from './component/ServicesPage';
import Mission from './component/Mission';
import Info from './component/Info';
import UniqueServices from './component/UniqueServices';
import Callus from './component/Callus';
import OurName from './component/OurName';
import FormData from './component/FormData';
import Profile from './component/lawyers/Profile';
import Lawyer from './component/lawyers/Lawyer';
import Login from './component/auth/Login';
import Client from './component/clients/Client';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav/>
        <Routes>
          <Route path="/company" element={
            <>
              <Info
                title={"عننا"}
                paragraph={`"محاميك" هو أول تطبيق وموقع مصري متخصص في تسهيل الوصول إلى الخدمات القانونية...`} 
                backgroundImage="/pics/image66.png"
              />
              <OurName/>
              <FormData/>
              <UniqueServices/>
              <Callus/>
              <Mission/>
            </>
          } />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/lawyers" element={ 
            <>
              <Login/>
              <Lawyer/>
              <Profile/>
              <Client/>
            </>
            } />
        </Routes>
      </div>
    </Router>
  
  );
}

export default App;