const fs = require('fs');
const path = require('path');

// Ensure directory exists
exports.ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Create upload directories when server starts
exports.createUploadDirectories = () => {
    const uploadDir = path.join(__dirname, '../uploads');
    const carsDir = path.join(uploadDir, 'cars');

    this.ensureDirectoryExists(uploadDir);
    this.ensureDirectoryExists(carsDir);

    console.log('Upload directories created');
};
