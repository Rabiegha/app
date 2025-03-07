import { useState } from "react";
import { editAttendee } from "../services/editAttendeeService.tsx";

const useEditAttendee = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const updateAttendeeData = async (data, onSuccess) => {
    setLoading(true);
    try {
      const response = await editAttendee(data);
      if (response) {
        setSuccess(true);
        onSuccess();
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { loading, success, updateAttendeeData };
};

export default useEditAttendee;