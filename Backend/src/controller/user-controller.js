import { createUser, findUserByEmail } from "../models/user-model.js";

export const createUserController = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check duplicate email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password

    const userId = await createUser({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: userId,
        name,
        email,
        role,
      },
    });
  } catch (error) {
    next(error);
  }
};
