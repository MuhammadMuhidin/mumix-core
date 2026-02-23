const userRepo = require("../user/user.repository");
const AppError = require("../../core/app.error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} = require("@simplewebauthn/server");
const { sendOtp } = require("./otp.provider");
const crypto = require("crypto");

const OTP_TTL_MS = 3 * 60 * 1000; // 3 menit
const OTP_MAX_ATTEMPTS = 5;

const JWT_SECRET = process.env.JWT_SECRET;
const RP_ID = process.env.RP_ID;
const ORIGIN = process.env.ORIGIN;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

if (!RP_ID || !ORIGIN) {
  throw new Error("RP_ID or ORIGIN is not defined");
}

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const hashOtp = (otp) =>
  crypto
    .createHash("sha256")
    .update(otp + process.env.OTP_SECRET)
    .digest("hex");

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.is_active) {
    throw new AppError("Account disabled", 403);
  }

  if (user.webauthn_enabled) {
    return {
      requires2FA: true,
      email: user.email
    };
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      tokenVersion: Number(user.token_version)
    },
    JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

exports.generateWebAuthnRegisterOptions = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const options = await generateRegistrationOptions({
    rpName: "Mumix App",
    rpID: RP_ID,
    userID: String(user.id),
    userName: user.email,
    attestationType: "none",
    authenticatorSelection: {
      userVerification: "required"
    }
  });

  await userRepo.update(user.id, {
    webauthn_current_challenge: options.challenge
  });

  return options;
};

exports.verifyWebAuthnRegister = async (userId, credential) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const verification = await verifyRegistrationResponse({
    response: credential,
    expectedChallenge: user.webauthn_current_challenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID
  });

  if (!verification.verified) {
    throw new AppError("Registration failed", 400);
  }

  const { credentialID, credentialPublicKey, counter } =
    verification.registrationInfo;

  const toBase64Url = (buffer) =>
  Buffer.from(buffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await userRepo.update(user.id, {
    webauthn_credential_id: toBase64Url(credentialID),
    webauthn_public_key: toBase64Url(credentialPublicKey),
    webauthn_counter: counter,
    webauthn_enabled: true
  });

  return { success: true };
};

exports.generateWebAuthnLoginOptions = async (email) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.webauthn_enabled) {
    throw new AppError("2FA not enabled", 400);
  }

  const base64UrlToBuffer = (base64url) =>
    Buffer.from(
      base64url
        .replace(/-/g, "+")
        .replace(/_/g, "/"),
      "base64"
    );

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials: [
      {
        id: base64UrlToBuffer(user.webauthn_credential_id),
        type: "public-key",
        transports: ["internal"]
      }
    ],
    userVerification: "required"
  });

  await userRepo.update(user.id, {
    webauthn_current_challenge: options.challenge
  });

  return options;
};

exports.verifyWebAuthnLogin = async (email, credential) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const base64UrlToBuffer = (base64url) => {
    const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
    const base64 = (base64url + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    return Buffer.from(base64, "base64");
  };

  const verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge: user.webauthn_current_challenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
    authenticator: {
      credentialID: base64UrlToBuffer(user.webauthn_credential_id),
      credentialPublicKey: base64UrlToBuffer(user.webauthn_public_key),
      counter: user.webauthn_counter
    }
  });

  if (!verification.verified) {
    throw new AppError("Invalid fingerprint", 401);
  }

  await userRepo.update(user.id, {
    webauthn_counter: verification.authenticationInfo.newCounter
  });

  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  await sendOtp(user.phone, user.name, otp);

  return {
    email: user.email,
    otpHash,
    expiresAt: Date.now() + OTP_TTL_MS,
    maxAttempts: OTP_MAX_ATTEMPTS
  };
};

exports.generateDisable2FAOptions = async (userId) => {
  const user = await userRepo.findById(userId);

  if (!user.webauthn_enabled) {
    throw new AppError("2FA not enabled", 400);
  }

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials: [
      {
        id: Buffer.from(
          user.webauthn_credential_id,
          "base64url"
        ),
        type: "public-key"
      }
    ],
    userVerification: "required"
  });

  await userRepo.update(user.id, {
    webauthn_current_challenge: options.challenge
  });

  return options;
};

exports.disable2FAWithReauth = async (
  userId,
  password,
  credential
) => {
  const user = await userRepo.findByIdWithPassword(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // 1️⃣ Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid password", 401);
  }

  const verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge: user.webauthn_current_challenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
    authenticator: {
      credentialID: Buffer.from(
        user.webauthn_credential_id,
        "base64url"
      ),
      credentialPublicKey: Buffer.from(
        user.webauthn_public_key,
        "base64url"
      ),
      counter: user.webauthn_counter
    }
  });

  if (!verification.verified) {
    throw new AppError("Invalid fingerprint", 401);
  }

  await userRepo.update(user.id, {
    webauthn_enabled: false,
    webauthn_credential_id: null,
    webauthn_public_key: null,
    webauthn_counter: 0,
    webauthn_current_challenge: null
  });
};

exports.validateOtp = async (sessionData, otpInput) => {
  if (!sessionData) {
    throw new AppError("Unauthorized", 403);
  }

  if (Date.now() > sessionData.expiresAt) {
    throw new AppError("OTP expired", 401);
  }

  const hash = hashOtp(otpInput);

  if (hash !== sessionData.otpHash) {
    if (sessionData.attempts + 1 >= sessionData.maxAttempts) {
      throw new AppError("Too many attempts", 401);
    }

    return { valid: false };
  }

  const user = await userRepo.findByEmail(sessionData.email);
  if (!user) throw new AppError("User not found", 404);

  return { valid: true, user };
};