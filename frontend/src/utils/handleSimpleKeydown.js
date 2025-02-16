const handleSimpleKeydown = (e, setFormData, fieldName, ref) => {
  if (e.key === "Escape") {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: "",
    }));
    ref.current?.blur();
  }
};

export default handleSimpleKeydown;
