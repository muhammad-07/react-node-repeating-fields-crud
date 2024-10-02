import { useState } from "react";
import "./App.css";
import RepeatingFields from "./components/RepeatingFields";
import axios from "axios";

function App() {
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
 
  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    console.log('User logged out, token removed');
  };
  const fetchForms = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return console.error('User not logged in');
    }
  
    try {
      const response = await axios.get('http://localhost:5000/api/forms', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setForms(response.data); // Assuming you're storing the forms in state
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };
  

  return (
    <div className="App">
      <form className="form" onSubmit={submit}>
        <RepeatingFields formFields={formFields} setFormFields={setFormFields} />
      </form>
      <br />
      <button type="submit"  onClick={submit} className="btn">Submit</button>
    </div>
  );
}

export default App;
