const isEmailValid = (email: string): boolean => {
  return (
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) !== null
  );
};

export const validateForm = (requiredFields: string[], values: any): any => {
  let valid = true;
  const errors: any = {};

  requiredFields.forEach((k: string) => {
    if (values[k] === "" || values[k] === null) {
      valid = false;
      errors[k] = "error";
    }
  });

  if (values["email"] && !isEmailValid(values["email"])) {
    valid = false;
    errors["email"] = "error";
  }

  return {
    valid,
    errors,
  };
};
