const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateColortagInput = data => {
  let errors = {};

  data.tagname = !isEmpty(data.tagname) ? data.tagname : "";
  data.underlined = !isEmpty(data.underlined) ? data.underlined : "";
  data.bold = !isEmpty(data.bold) ? data.bold : "";
  data.bigger = !isEmpty(data.bigger) ? data.bigger : "";
  data.phrases = !isEmpty(data.phrases) ? data.phrases : [];

  if (Validator.isEmpty(data.tagname)) {
    errors.tagname = "Tag name is required";
  } else if (!Validator.isLength(data.tagname, { min: 2, max: 50 })) {
    errors.tagname = "Tag name must be between 2 and 50 characters";
  }

  if (typeof data.color === "undefined") {
    errors.color = "Color is required";
  }

  if (typeof data.background === "undefined") {
    errors.background = "Background color is required";
  }

  if (Validator.isEmpty(data.underlined)) {
    errors.underlined = "Underlined flag is required";
  } else if (Validator.isBoolean(data.underlined)) {
    errors.underlined = "Underlined flag must be of type boolean";
  }

  if (Validator.isEmpty(data.bold)) {
    errors.bold = "Bold flag is required";
  } else if (Validator.isBoolean(data.bold)) {
    errors.bold = "Bold flag must be of type boolean";
  }

  if (Validator.isEmpty(data.bigger)) {
    errors.bigger = "Bigger flag is required";
  } else if (Validator.isBoolean(data.bigger)) {
    errors.bigger = "Bigger flag must be of type boolean";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateColortagInput;
