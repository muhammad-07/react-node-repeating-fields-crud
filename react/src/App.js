import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import FormPage from './pages/FormPage'; 
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './ProtectedRoute';
import Home from './pages/Home';

import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/vendor/font-awesome/css/font-awesome.min.css";
import "./assets/scss/argon-design-system-react.scss?v1.1.0";

function App() {
  const token = localStorage.getItem('token');
  const logout = () => {
    localStorage.removeItem('token');
    console.log('User logged out, token removed');
    window.location.reload(); 
  };

  return (
    <Router>
      <div>
        {/* Navigation Links */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
           
            {!token && <li><Link to="/login">Login</Link></li>}
            {!token && <li><Link to="/signup">Signup</Link></li>}
            {!token && <li><Link to="/forgot-password">Forgot Password?</Link></li>}
            {token && <li><Link to="/form">Form</Link></li>}
            {token && <li><Link to="/profile">Profile</Link></li>}
            {token && <li><button onClick={logout}>Logout</button></li>}
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Protected Route for the Form */}
          <Route path="/form" element={<ProtectedRoute component={FormPage} />} />
          <Route path="/profile" element={<ProtectedRoute component={UserProfile} />} />
        </Routes>
      </div>
    </Router>
  );
}
// function App() {

//   const logout = () => {
//     localStorage.removeItem('token');
//     console.log('User logged out, token removed');
//   };

//   return (
//     <>
//     <Router>
//       <div>
//         {/* Navigation Links */}
//         <nav>
//           <ul>
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/login">Login</Link></li>
//             <li><Link to="/form">Form</Link></li>
//             <li><button onClick={logout}>Logout</button></li>
//           </ul>
//         </nav>

//         {/* Define Routes */}
//         <Routes>
//           <Route path="/" exact>
//             Home Page
//           </Route>
//           <Route path="/login" element={<Login />} />
//           <Route 
//         path="/form" 
//         element={
//           <ProtectedRoute>
//             <FormPage />
//           </ProtectedRoute>
//         } 
//       />
//           {/* Protected Route for the Form */}
//           {/* <ProtectedRoute path="/form" component={FormPage} /> */}
//         </Routes>
//       </div>
//     </Router>


    
//     <h1>App Component</h1>
//     </>
//   );
// }

export default App;
