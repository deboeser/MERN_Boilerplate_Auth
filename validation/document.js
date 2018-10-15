const isEmpty = require("./is-empty");

const validateDocumentInput = data => {
  let errors = {};

  data.doi = !isEmpty(data.doi) ? data.doi : "";
  data.url = !isEmpty(data.url) ? data.url : "";

  if (isEmpty(data.doi)) {
    errors.doi = "DOI is required";
  }

  if (isEmpty(data.url)) {
    errors.url = "URL is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateDocumentInput;
