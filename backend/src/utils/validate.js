const validator = require('validator');

const validateSignUpData = (data) => {
  const { firstName, lastName, email, password } = data;
  const errors = {};

  if (!firstName || !lastName) {
    errors.name = 'First name and last name are required';
  }

  if(firstName && firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters long';
  }
  
  if(lastName && lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters long';
  }

  if(firstName && firstName.length > 30) {
    errors.firstName = 'First name must be less than 30 characters long';
  }
  
  if(lastName && lastName.length > 30) {
    errors.lastName = 'Last name must be less than 30 characters long';
  }
  
  if (!email || !validator.isEmail(email)) {
    errors.email = 'Invalid email address';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateUserProfileData = (data) => {
  const { firstName, lastName, age, bio, avatar } = data;
  const errors = {};

  if (!firstName || !lastName) {
    errors.name = 'First name and last name are required';
  }

  if(firstName && firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters long';
  }
  
  if(lastName && lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters long';
  }

  if(firstName && firstName.length > 30) {
    errors.firstName = 'First name must be less than 30 characters long';
  }
  
  if(lastName && lastName.length > 30) {
    errors.lastName = 'Last name must be less than 30 characters long';
  }
  
  if (age && (isNaN(age) || age < 0 || age > 120)) {
    errors.age = 'Invalid age';
  }

  if (bio && bio.length > 200) {
    errors.bio = 'Bio must be less than 200 characters long';
  }

  if (avatar && !validator.isURL(avatar)) {
    errors.avatar = 'Invalid avatar URL';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = { validateSignUpData, validateUserProfileData };
