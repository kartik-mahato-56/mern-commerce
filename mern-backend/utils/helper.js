const path = require('path')
const fsPormise = require('fs').promises;


exports.sendResponse = (res, success, code, messsage, data={}) => {
  if (success === false) {
    console.log(data);
  }

  return res.json({
    success: success,
    statusCode: code,
    message: messsage,
    data: data,
  });
};

// Define a function to validate file extensions
exports.imageExtensionCheck = (file) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  return allowedExtensions.includes(fileExtension);
};
