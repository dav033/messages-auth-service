const { default: axios } = require("axios");
const User_auth = require("../models/authentication.users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  return await User_auth.findAll();
};

const createSessionToken = async (userId) => {
  try {
    const payload = {
      userId: userId,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
  } catch (error) {
    console.log("Error al crear el token", error);
    throw new Error("Error al crear el token");
  }
};

const verifySessionToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const encryptPassword = async (password) => {
  try {
    console.log("PASSWORD, ", password + "UWU");
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log("Error al encriptar la contraseña", error);
    throw new Error("Error al encriptar la contraseña");
  }
};

const decryptPassword = async (password, encryptedPassword) => {
  return await bcrypt.compare(password, encryptedPassword);
};

const createUser = async (user) => {
  console.log("USUEr", user.password);
  const encryptedPassword = await encryptPassword(user.password);
  console.log(encryptedPassword, "ENCRYPTED");

  const userr = await User_auth.create({
    id: user.id,  
    password: encryptedPassword,
  });

  const response = await createSessionToken(userr.id);

  return {
    token: response,
    id: userr.id,
    name: user.name,
    profileImage: user.profileImage,
    temporal: false,
  };
};

const login = async (name, password) => {
  try {
    const user_information = await axios.get(
      `http://localhost:4000/users/get_user_by_name`,
      {
        params: {
          name: name,
        },
      }
    );

    console.log("USER", user_information.data);

    if (!user_information) {
      throw new Error("Usuario no encontrado");
    }

    const user = await User_auth.findOne({
      where: {
        id: user_information.data.id,
      },
    });

    const isPasswordCorrect = await decryptPassword(password, user.password);

    console.log("UWU", isPasswordCorrect);
    if (!isPasswordCorrect) {
      throw new Error("Contraseña incorrecta");
    }

    const token = await createSessionToken(user.id);

    return {
      token: token,
      id: user_information.data.id,
      name: user_information.data.name,
      profileImage: user_information.data.profileImage,
      temporal: false,
    };
  } catch (error) {
    console.log("Error al iniciar sesión", error);
    throw new Error("Error al iniciar sesión");
  }
};

module.exports = {
  getAllUsers,
  createSessionToken,
  verifySessionToken,
  createUser,
  login,
};
