export const validateEmail = (email, callback) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const result = regex.test(email);
  callback(result);
  return result;
};

export const validatePassword = (password, callback) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const result = regex.test(password);
  callback(result);
  return result;
};
