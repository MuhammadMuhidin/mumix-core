const axios = require("axios");
const AppError = require("../../core/app.error");

const { FONNTE_TOKEN, FONNTE_BASE_URL } = process.env;

if (!FONNTE_TOKEN || !FONNTE_BASE_URL) {
  throw new Error("FONNTE config missing in environment");
}

exports.sendOtp = async (phone, name, otp) => {
  if (!phone) {
    throw new AppError({
      statusCode: 400,
      code: "PHONE_NOT_FOUND",
      message: "Phone number not found"
    });
  }

  const message = `
Halo ${name},

Kode OTP login Anda adalah:

${otp}

Kode ini berlaku selama 3 menit.
Jangan bagikan kode ini kepada siapa pun.
`.trim();

  try {
    const response = await axios.post(
      FONNTE_BASE_URL,
      {
        target: phone,
        message,
        countryCode: "62",
      },
      {
        headers: {
          Authorization: FONNTE_TOKEN,
        },
        timeout: 8000,
      }
    );

    if (!response.data || response.data.status !== true) {
      throw new AppError({
        statusCode: 500,
        code: "OTP_PROVIDER_REJECTED",
        message: "Failed to send OTP"
      });
    }

    return true;

  } catch (err) {
    if (err.response) {
      throw new AppError({
        statusCode: err.response.status || 500,
        code: "OTP_PROVIDER_ERROR",
        message: "OTP provider error"
      });
    }

    throw new AppError({
      statusCode: 500,
      code: "OTP_SENDING_FAILED",
      message: "OTP sending failed"
    });
  }
};