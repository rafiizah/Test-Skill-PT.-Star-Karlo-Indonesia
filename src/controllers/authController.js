const User = require("../models/User");
const Session = require("../models/Session");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { fullname, username, password } = req.body;

    if (!fullname || !username || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Semua Field harus diisi" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Username sudah digunakan" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullname,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      status: true,
      message: "Registrasi berhasil",
      data: { id: user._id, fullname: user.fullname, username: user.username },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: " Username atau Password salah." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: " Username atau Password salah." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    await Session.create({
      user: user._id,
      token,
      expiresAt,
    });

    res.json({
      success: true,
      message: " login telah berhasil",
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await Session.findOneAndUpdate({ token: req.token }, { isActive: false });

    res.json({ success: true, message: "Logout telah berhasil. " });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password Lama Salah." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await Session.updateMany({ user: user._id }, { isActive: false });

    res.json({
      success: true,
      message:
        "Password berhasil diubah. Silahkan login kembali dengan password baru",
    });
  } catch (error) {
    next(error);
  }
};
