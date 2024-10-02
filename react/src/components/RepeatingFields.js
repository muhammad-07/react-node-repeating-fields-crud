import React from "react";
import TextField from "./TextField"; 
import SelectField from "./SelectField";
const RepeatingFields = ({ formFields, setFormFields, fieldName }) => {
  const addField = () => {
    const newField = { name: "", city: "" }; // Include a selection property
    setFormFields([...formFields, newField]);
  };

  const removeField = (index) => {
    const data = [...formFields];
    if (data.length < 2) {
      alert("At least 1 field is required");
      return;
    }
    data.splice(index, 1);
    setFormFields(data);
  };

  const handleChange = (e, index) => {
    const data = [...formFields];
    const inputName = e.target.name.split(`[`)[0];
    console.log(inputName);
    if (inputName in data[index]) { 
        data[index][inputName] = e.target.value;
      } else {
        console.log(inputName);
        
        console.log("Invalid input name");
        console.log(data[index]);
      }   
    
    setFormFields(data);
  };

  return (
    <div>
      {formFields.map((form, index) => (
        <div key={index}>
          <TextField
            index={index}
            form={form}
            fieldName={"name"}
            handleFormChange={handleChange}
            removeFields={removeField}
          />
          <SelectField
            index={index}
            form={form}
            fieldName={"city"}
            handleFormChange={handleChange}
            removeFields={removeField}
          />
        </div>
      ))}
      <button type="button" onClick={addField} className="btn">Add More</button>
    </div>
  );
};

export default RepeatingFields;
