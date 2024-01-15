const path = require("path");
const fs = require("fs");
const uniqId = require("uniqid");

exports.sendResponse = (res, success, code, messsage, data = {}) => {
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
exports.imageExtensionCheck = async (file) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG", '.webp', '.WEBP'];
    const fileExtension = path.extname(file.name).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
        return `${uniqId()}${fileExtension}`;
    } else {
        return null;
    }
};

exports.uploadImage = async (folder, fileName, files) => {
    const sampleFile = files;
    let uploadDir = `public/${folder}`;
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    sampleFile.mv(`${uploadDir}/${fileName}`, (err) => {
        if (err) {
            throw new Error(err);
        }
    });
    return `${folder}/${fileName}`;
};

exports.deleteFile = async (filePath) => {
    deletePath = path.join(__dirname, "..", filePath);
    if (fs.existsSync(deletePath)) {
        // console.log(deletePath);
        return fs.unlink(deletePath, (err) => {
            err
                ? console.log(err.message)
                : console.log("Successfully file deleted");
        });
    }
};
