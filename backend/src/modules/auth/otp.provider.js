const axios = require("axios");
const AppError = require("../../core/app.error");

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
const FONNTE_BASE_URL = process.env.FONNTE_BASE_URL;

if (!FONNTE_TOKEN || !FONNTE_BASE_URL) {
  throw new Error("FONNTE config missing in environment");
}

exports.sendOtp = async (phone, name, otp) => {
  try {
    if (!phone) {
      throw new AppError("Phone number not found", 400);
    }

    const message = `
Halo ${name},

Kode OTP login Anda adalah:

${otp}

Kode ini berlaku selama 3 menit.
Jangan bagikan kode ini kepada siapa pun.
    `.trim();

    const response = await axios.post(
      FONNTE_BASE_URL,
      {
        target: phone,
        message,
        countryCode: "62", // ubah sesuai kebutuhan
      },
      {
        headers: {
          Authorization: FONNTE_TOKEN,
        },
        timeout: 8000,
      }
    );

    if (!response.data || response.data.status !== true) {
      throw new AppError("Failed to send OTP", 500);
    }

    return true;

  } catch (error) {
    if (error.response) {
      throw new AppError(
        "OTP provider error",
        error.response.status || 500
      );
    }

    throw new AppError("OTP sending failed", 500);
  }
};