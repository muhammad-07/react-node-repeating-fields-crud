import React from "react";

const SelectField = ({ index, form, fieldName, handleFormChange, removeFields }) => {
  const handleChange = (e) => {
    handleFormChange(e, index);
  };

  return (
    <div>
      <select
        name={fieldName + `[${index}]`} // Use the same naming convention
        value={form.city} // Make sure your form object has a 'selection' property
        onChange={handleChange}
      >
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      <button className="btn" onClick={() => removeFields(index)}>Remove</button>
    </div>
  );
};

export default SelectField;
