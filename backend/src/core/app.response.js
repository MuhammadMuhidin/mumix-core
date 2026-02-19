exports.success = (res, data, meta = null, status = 200) => {
    res.status(status).json({
        success:true,
        data,
        meta
    });
}