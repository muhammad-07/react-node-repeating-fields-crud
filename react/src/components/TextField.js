import React from "react";

const TextField = ({ index, form, fieldName, handleFormChange, removeFields }) => {
  const handleChange = (e) => {
    handleFormChange(e, index);
  };

  return (
    <div>
      <input
        name={fieldName+`[${index}]`}
        type="text"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter your name"
      />
      {/* <button className="btn" onClick={() => removeFields(index)}>Remove</button> */}
    </div>
  );
};

export default TextField;
