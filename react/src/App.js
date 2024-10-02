// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/auth/Login'; // Import your Login component
import FormPage from './pages/FormPage'; // Import the FormPage component
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
function App() {
  const token = localStorage.getItem('token');
  const logout = () => {
    localStorage.removeItem('token');
    console.log('User logged out, token removed');
  };

  return (
    <Router>
      <div>
        {/* Navigation Links */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
           
            {!token && <li><Link to="/login">Login</Link></li>}
            {token && <li><Link to="/form">Form</Link></li>}
            {token && <li><button onClick={logout}>Logout</button></li>}
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/login" element={<Login />} />
          {/* Protected Route for the Form */}
          <Route path="/form" element={<ProtectedRoute component={FormPage} />} />
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
