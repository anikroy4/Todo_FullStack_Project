const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../model/userModel');
const nodemailer = require('nodemailer');

const ACCESS_SECRET =
  process.env.ACCESS_TOKEN_SECRET || 'todo_fallback_access_secret_01521428527';
const REFRESH_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'todo_fallback_refresh_secret_01521428525';

// Optional email transporter (safely handles missing or invalid credentials)
let transporter = null;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
} catch (e) {
  console.warn('Nodemailer setup warning:', e.message);
}

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, ACCESS_SECRET, {
    expiresIn: '24h',
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, REFRESH_SECRET, {
    expiresIn: '365d',
  });
};

const registrationController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res
        .status(400)
        .json({ error: `${normalizedEmail} is already registered.` });
    }

    const hashed = await bcryptjs.hash(password, 10);

    const user = new User({
      username: username.trim(),
      email: normalizedEmail,
      password: hashed,
      isVerified: false,
    });

    await user.save();

    const verificationToken = jwt.sign({ id: user._id }, ACCESS_SECRET, {
      expiresIn: '7d',
    });
    const clientUrl =
      process.env.CLIENT_URL || process.env.CLINT_URL || 'http://localhost:5173';
    const verifyLink = `${clientUrl}/verify/${verificationToken}`;

    let emailSent = false;
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `${user.username}, please verify your email`,
          html: `<div style="font-family: sans-serif; padding: 20px;">
            <h2>Welcome to Todo App, ${user.username}!</h2>
            <p>Please click the button below to verify your email address:</p>
            <p><a href="${verifyLink}" style="display:inline-block;padding:10px 20px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:6px;">Verify Email</a></p>
            <p>Or copy this link: <a href="${verifyLink}">${verifyLink}</a></p>
          </div>`,
        });
        emailSent = true;
      } catch (mailError) {
        console.warn('Mail transporter error (auto-verifying fallback):', mailError.message);
      }
    }

    // If email could not be sent (dev/network/credentials issue), auto-verify user so they are not blocked
    if (!emailSent) {
      user.isVerified = true;
      await user.save();
    }

    return res.status(201).json({
      message: emailSent
        ? 'Registration successful! Please check your email to verify.'
        : 'Registration successful! Your account is verified and ready to use.',
      verifyLink: !emailSent ? verifyLink : undefined,
      autoVerified: !emailSent,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: error.message || 'Registration failed' });
  }
};

const verificationTokenController = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    const userExists = await User.findById(decoded.id);

    if (!userExists) {
      return res.status(404).json({ error: 'User not found or invalid token.' });
    }

    userExists.isVerified = true;
    await userExists.save();

    return res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid or expired verification token.' });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (!userExists) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isPasswordMatch = await bcryptjs.compare(password, userExists.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isVerified = userExists.isVerified;
    if (!isVerified) {
      const verificationToken = jwt.sign({ id: userExists._id }, ACCESS_SECRET, {
        expiresIn: '7d',
      });
      const clientUrl =
        process.env.CLIENT_URL || process.env.CLINT_URL || 'http://localhost:5173';
      const verifyLink = `${clientUrl}/verify/${verificationToken}`;

      return res.status(403).json({
        error: 'Please verify your email before logging in.',
        notVerified: true,
        verifyLink,
      });
    }

    const accessToken = generateAccessToken(userExists);
    const refreshToken = generateRefreshToken(userExists);
    userExists.refreshToken = refreshToken;
    await userExists.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Login successful',
      accessToken,
      user: {
        id: userExists._id,
        username: userExists.username,
        email: userExists.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

const refreshController = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'No refresh token provided.' });
    }

    const userExists = await User.findOne({ refreshToken: token });
    if (!userExists) {
      return res.status(403).json({ error: 'Invalid refresh token.' });
    }

    jwt.verify(token, REFRESH_SECRET, (error, decoded) => {
      if (error) {
        return res.status(403).json({ error: 'Expired or invalid token.' });
      }
      const accessToken = generateAccessToken(userExists);
      return res.json({
        accessToken,
        user: {
          id: userExists._id,
          username: userExists.username,
          email: userExists.email,
        },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Refresh token error' });
  }
};

const getMeController = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

const logoutController = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: '' });
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
    });
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Logout failed' });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Please enter your email.' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found with this email.' });
    }

    const resetToken = jwt.sign({ id: userExists._id }, ACCESS_SECRET, {
      expiresIn: '1h',
    });
    const clientUrl =
      process.env.CLIENT_URL || process.env.CLINT_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl}/reset-password/${resetToken}`;

    let emailSent = false;
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: userExists.email,
          subject: 'Reset Your Password - Todo App',
          html: `<div style="font-family: sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>Click the link below to set a new password:</p>
            <p><a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:6px;">Reset Password</a></p>
            <p>Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
            <p>This link is valid for 1 hour.</p>
          </div>`,
        });
        emailSent = true;
      } catch (mailError) {
        console.warn('Mail transporter error on reset:', mailError.message);
      }
    }

    return res.json({
      message: emailSent
        ? 'Please check your email for the password reset link.'
        : 'Password reset link generated.',
      resetLink: !emailSent ? resetLink : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Failed to process request.' });
  }
};

const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    const userExists = await User.findById(decoded.id);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found or invalid token.' });
    }

    userExists.password = await bcryptjs.hash(password, 10);
    await userExists.save();

    return res.json({ message: 'Password reset successfully! You can now log in.' });
  } catch (error) {
    return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
  }
};

module.exports = {
  registrationController,
  loginController,
  verificationTokenController,
  refreshController,
  logoutController,
  getMeController,
  forgotPasswordController,
  resetPasswordController,
};
