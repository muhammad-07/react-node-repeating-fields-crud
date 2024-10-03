import React from 'react';
// import axios from 'axios';

const FormList = ({ forms, error, onEdit, onDelete  }) => {
//   const [forms, setForms] = useState([]); // State to store forms
//   const [error, setError] = useState(null); // State to store any errors

  // Function to fetch forms
//   const fetchFilteredForms = async () => {
//     const token = localStorage.getItem('token'); // Token from localStorage
//     if (!token) {
//       return console.error('User not logged in');
//     }

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/forms',
//         { name: '', city: '' }, // Empty filters, can be replaced with specific values
//         {
//           headers: {
//             Authorization: `Bearer ${token}` // Authorization header with JWT
//           }
//         }
//       );
//       setForms(response.data); // Store the fetched forms in the state
//     } catch (error) {
//       console.error('Error fetching forms:', error);
//       setError('Failed to fetch forms'); // Set an error message
//     }
//   };

  // useEffect to fetch forms on component mount
//   useEffect(() => {
//     fetchFilteredForms();
//   }, []);

  return (
    <div>
      <h2>Your Forms</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {forms.length === 0 ? (
        <p>No forms available</p>
      ) : (
        <ul>
          {forms.map((form, index) => (
            <li key={index}>
              <p><strong>Name:</strong> {form.name}</p>
              <p><strong>City:</strong> {form.city}</p>
              <button onClick={() => onEdit(form)}>Edit</button> &nbsp;&nbsp;
          <button onClick={() => onDelete(form._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormList;
