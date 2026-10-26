// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - at least 6 characters
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Username validation - at least 3 characters, alphanumeric + spaces
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9\s]{3,}$/;
  return usernameRegex.test(username);
};

// Validate registration form
export const validateRegistration = (formData) => {
  const errors = {};

  if (!formData.username || !formData.username.trim()) {
    errors.username = 'Username is required';
  } else if (!isValidUsername(formData.username)) {
    errors.username = 'Username must be at least 3 characters (letters, numbers, spaces)';
  }

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

// Validate login form
export const validateLogin = (formData) => {
  const errors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

// Validate password reset
export const validatePasswordReset = (formData) => {
  const errors = {};

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};
