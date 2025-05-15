import { useState } from "react";

const useValidation = () => {
  const [errors, setErrors] = useState({});

  const validateFields = ({ nom, prenom, email }) => {
    const newErrors = {};
    if (!nom) newErrors.nom = true;
    if (!prenom) newErrors.prenom = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true si aucun problème
  };

  const resetError = (field) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };

  return { errors, validateFields, resetError };
};

export default useValidation;
