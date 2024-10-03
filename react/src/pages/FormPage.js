import React, { useState, useEffect } from 'react';
import RepeatingFields from "../components/RepeatingFields";
import axios from 'axios';
import FormList from './FormList';

const FormPage = () => {
  const [formFields, setFormFields] = useState([{ name: "", city: "" }]);
  const [forms, setForms] = useState([]);
  const [editFormId, setEditFormId] = useState(null); 
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFilteredForms();
  }, []);
  const submit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      return console.error('User not logged in');
    }

    try {
      if (editFormId) {
        // Update existing form
        const response = await axios.put(`http://localhost:5000/api/form/${editFormId}`, { name: formFields[0].name, city: formFields[0].city }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Form updated:', response.data);
      } else {
        // Submit new form
        const response = await axios.post('http://localhost:5000/api/form', { formFields }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Form submitted:', response.data);
      }
      
      // After submission or update, fetch the updated form list
      fetchFilteredForms();
      setEditFormId(null); // Reset the editFormId to handle new submissions
      setFormFields([{ name: "", city: "" }]); // Reset form fields
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (form) => {
    setEditFormId(form._id); // Set the form to be edited
    setFormFields([{ name: form.name, city: form.city }]); // Pre-fill the form with data to edit
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return console.error('User not logged in');
    }

    try {
      await axios.delete(`http://localhost:5000/api/form/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Form deleted');
      fetchFilteredForms(); // Refresh the form list after deletion
    } catch (error) {
      console.error('Error deleting form:', error);
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
 
  return (
    <div>
      <form onSubmit={submit}>
        <RepeatingFields formFields={formFields} setFormFields={setFormFields} />
        <button type="submit">{editFormId ? "Update" : "Submit"}</button>
      </form>
      <hr/>
      <h3>Entries Available</h3>
      <FormList forms={forms} error={error} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default FormPage;
