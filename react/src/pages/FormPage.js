import React, { useState, useEffect } from 'react';
import RepeatingFields from "../components/RepeatingFields";
import axios from 'axios';
import FormList from './FormList';

const FormPage = () => {
  const [formFields, setFormFields] = useState([{ name: "", city: "" }]);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  const submit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      return console.error('User not logged in');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/form', { formFields }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Form submitted:', response.data);
      
      fetchFilteredForms();
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchFilteredForms = async () => {
    const token = localStorage.getItem('token'); // Token from localStorage
    if (!token) {
      return console.error('User not logged in');
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/forms',
        { name: '', city: '' }, // Empty filters, can be replaced with specific values
        {
          headers: {
            Authorization: `Bearer ${token}` // Authorization header with JWT
          }
        }
      );
      setForms(response.data); // Store the fetched forms in the state
    } catch (error) {
      console.error('Error fetching forms:', error);
      setError('Failed to fetch forms'); // Set an error message
    }
  };
  useEffect(() => {
    fetchFilteredForms();
  }, []);
  return (
    <div>
      <form onSubmit={submit}>
        <RepeatingFields formFields={formFields} setFormFields={setFormFields} />
        <button type="submit">Submit</button>
      </form>
      <hr/>
      <h3>Entries Available</h3>
      <FormList forms={forms} error={error} />
    </div>
  );
};

export default FormPage;
