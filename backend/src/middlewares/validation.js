const AppError = require("../core/app.error");

exports.validate = (validator) => async (req, res, next) => {
    try {
        await validator.validate(req.body);
        next();
    } catch (err) {
        next(new AppError(err.message, 400));
    }

};
