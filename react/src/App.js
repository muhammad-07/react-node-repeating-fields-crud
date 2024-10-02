import { useState } from "react";
import "./App.css";
import RepeatingFields from "./components/RepeatingFields";
import axios from "axios";

function App() {
  const [formFields, setFormFields] = useState([{ name: "", city: "" }]);

  const submit = async (e) => {
    e.preventDefault();
    console.log(formFields);
    

    try {      
      // const formattedFields = {name: formFields[0].name, city: formFields[0].city};
      const response = await axios.post('http://localhost:5000/api/form', { formFields });
  // console.log(formattedFields);
      // const response = await axios.post('http://localhost:5000/api/form', formattedFields);
      console.log('Form submitted:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
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
