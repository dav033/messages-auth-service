const { default: axios } = require("axios");
const User_auth = require("../models/authentication.users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const getAllUsers = async () => {
  try {
    return await User_auth.findAll();
  } catch (error) {
    console.error("Error fetching all users", error);
    throw new CustomError(500, "Error fetching all users");
  }
};

const createSessionToken = async (userId) => {
  try {
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Error creating session token", error);
    throw new CustomError(500, "Error creating session token");
  }
};

const verifySessionToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Error verifying session token", error);
    throw new CustomError(401, "Invalid session token");
  }
};

const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Error encrypting password", error);
    throw new CustomError(500, "Error encrypting password");
  }
};

const decryptPassword = async (password, encryptedPassword) => {
  try {
    return await bcrypt.compare(password, encryptedPassword);
  } catch (error) {
    console.error("Error decrypting password", error);
    throw new CustomError(500, "Error decrypting password");
  }
};

const createUser = async (user) => {
  try {
    const encryptedPassword = await encryptPassword(user.password);
    const newUser = await User_auth.create({
      id: user.id,
      password: encryptedPassword,
    });
    const token = await createSessionToken(newUser.id);

    return {
      token,
      id: newUser.id,
      name: user.name,
      profileImage: user.profileImage,
      temporal: false,
    };
  } catch (error) {
    console.error("Error creating user", error);
    throw new CustomError(500, "Error creating user");
  }
};

const login = async (name, password) => {
  try {
    const userResponse = await axios.get(
      `http://localhost:4000/users/get_user_by_name`,
      { params: { name } }
    );

    if (!userResponse.data) {
      throw new CustomError(404, "Usuario no encontrado");
    }

    const user = await User_auth.findOne({
      where: { id: userResponse.data.id },
    });

    if (!user) {
      throw new CustomError(404, "Usuario no encontrado en la base de datos");
    }

    const isPasswordCorrect = await decryptPassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new CustomError(401, "Contraseña incorrecta");
    }

    const token = await createSessionToken(user.id);

    return {
      token,
      id: userResponse.data.id,
      name: userResponse.data.name,
      profileImage: userResponse.data.profileImage,
      temporal: false,
    };
  } catch (error) {
    console.error("Error logging in", error);
    if (error.response && error.response.status) {
      throw new CustomError(error.response.status, error.response.data.message);
    } else if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError(500, "Error logging in");
    }
  }
};

module.exports = {
  getAllUsers,
  createSessionToken,
  verifySessionToken,
  encryptPassword,
  decryptPassword,
  createUser,
  login,
  CustomError,
};
