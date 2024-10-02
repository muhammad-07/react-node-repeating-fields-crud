import React, { useState } from 'react';
import RepeatingFields from "../components/RepeatingFields";
import axios from 'axios';

const FormPage = () => {
  const [formFields, setFormFields] = useState([{ name: "", city: "" }]);

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
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <RepeatingFields formFields={formFields} setFormFields={setFormFields} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormPage;
