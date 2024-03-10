const express = require("express");
const userSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');

const SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check for empty fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        // Normalize email address to lowercase
        const normalizedEmail = email.toLowerCase();
       
        // Check if user with the given email already exists
        const userExist = await userSchema.findOne({ email: normalizedEmail });
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

         // Validation for password
         const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
         if (!passwordRegex.test(password)) {
             return res.status(400).json({
                 success: false,
                 message: 'Password must contain at least one letter, one number, and one special character, and must be at least 8 characters long'
             });
         }
         

        // Hash the password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error hashing password"
            });
        }

        // Create a new user
        const newUser = await userSchema.create({ name, email:normalizedEmail, password: hashedPassword });

        // Send response
        return res.status(200).json({
            success: true,
            data: newUser,
            message: "Sign up successful"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = SignUp;
