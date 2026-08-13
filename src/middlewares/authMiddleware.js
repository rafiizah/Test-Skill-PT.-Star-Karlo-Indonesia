const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers?.authorization || req.headers?.Authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Akses ditolak. Header Authorization: Bearer token wajib diisi.",
      });
    }

    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: " Akses ditolak. Token tidak ditemukan",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const activeSession = await Session.findOne({ token, isActive: true });

    if (!activeSession) {
      return res.status(401).json({
        success: false,
        message: "Session telah habis, silahkan Login kembali",
      });
    }

    req.user = await User.findById(decode.id).select("-password");
    req.token = token;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: " Token tidak valid/kadaluwarsa" });
  }
};

module.exports = { protect };
