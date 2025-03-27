const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = 500;
    let message = 'Server Error';
    let errors = {};

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';

        Object.keys(err.errors).forEach(field => {
            errors[field] = err.errors[field].message;
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';

        errors.field = Object.keys(err.keyValue)[0];
        errors.value = Object.values(err.keyValue)[0];
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found with id of ${err.value}`;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};

module.exports = errorHandler;