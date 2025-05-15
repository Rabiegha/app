export const cleanParams = (params) => {
    const cleaned = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];

      const isEmpty = (
        value === null ||
        value === undefined ||
        value === '' ||
        value === 'null'
      );

      if (!isEmpty || value === 0) {
        cleaned[key] = value;
      }
    });

    return cleaned;
  };
