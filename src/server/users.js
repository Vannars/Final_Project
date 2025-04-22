const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

//==================================================LOGIN AND REGISTER ROUTES==================================================
module.exports = (db) => {
  // Route to handle login
  router.post(
    "/login",
    [
      check("username").isAlphanumeric().trim().escape(), // Validate username
      check("password").isLength({ min: 8 }).trim().escape(), // Validate password length
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors
      }

      const sqlquery = "SELECT PasswordHash FROM users WHERE username = ?";
      const sanitizedUsername = req.body.username; // Sanitize username input

      db.query(sqlquery, [sanitizedUsername], (err, result) => {
        if (err) return next(err);

        if (result.length === 0) {
          return res.status(404).json({ message: "User not found" }); // User does not exist
        }

        bcrypt.compare(
          req.body.password,
          result[0].PasswordHash,
          (err, isMatch) => {
            if (err) return res.status(500).json({ message: "Login failed" });

            if (isMatch) {
              req.session.userId = sanitizedUsername; // Set session userId
              req.session.username = sanitizedUsername; // Set session username
              return res.status(200).json({ message: "Login successful" });
            } else {
              return res.status(401).json({ message: "Invalid credentials" }); // Incorrect password
            }
          }
        );
      });
    }
  );

  // Route to handle logout
  router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" }); // Handle logout error
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Route to check session user (logged in status)
  router.get("/session", (req, res) => {
    if (req.session && req.session.username) {
      res.json({ loggedIn: true, username: req.session.username });
    } else {
      res.json({ loggedIn: false });
    }
  });
  // Route to handle registration
  router.post(
    "/register",
    [
      check("email").isEmail(), // Validate email format
      check("password").isLength({ min: 8 }), // Validate password length
      check("username").isAlphanumeric(), // Validate username format
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors
      }

      const saltRounds = 10;
      const { username, email, password } = req.body; // Extract user details from request body

      bcrypt.hash(password, saltRounds, (err, PasswordHash) => {
        if (err) return next(err);

        const sqlquery =
          "INSERT INTO users (username, email, PasswordHash) VALUES (?, ?, ?)";
        db.query(sqlquery, [username, email, PasswordHash], (err, result) => {
          if (err) return next(err);

          res.status(201).json({ message: "User registered successfully" });
        });
      });
    }
  );

  router.get("/", (req, res, next) => {
    const sqlquery = "SELECT username FROM users"; // fetch all usernames
    db.query(sqlquery, (err, results) => {
      if (err) return next(err); // basic errors
      res.json(results); // Send usernames as json
    });
  });
  return router; // Return the router object
};
