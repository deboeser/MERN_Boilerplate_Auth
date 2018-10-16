const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Reset = require("../../models/Reset");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const serverconfig = require("../../config/serverconfig");
const passport = require("passport");

const {
  validateLoginInput,
  validateRegisterInput,
  validateChangePasswordInput,
  validateResetPasswordInput
} = require("../../validation/auth");

/**
 * @route   GET api/auth/example
 * @desc    Implements example boilerplate route
 * @access  public
 */
router.get("/example", (req, res) => res.json({ msg: "Example route" }));

/**
 * @route   POST api/auth/register
 * @desc    Register a new user
 * @access  public
 */
router.post("/register", (req, res) => {
  // Check Validation of register fields

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });

      // Password encryption with salt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

/**
 * @route   POST api/auth/login
 * @desc    Login to an account
 * @access  public
 */
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          email: user.email
        };
        jwt.sign(
          payload,
          keys.secret,
          { expiresIn: serverconfig.expiry },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

/**
 * @route   POST api/auth/current
 * @desc    Return the current user
 * @access  private
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email
    });
  }
);

/**
 * @route   POST api/auth/change-password
 * @desc    Changes the password of the user
 * @access  private
 */
router.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChangePasswordInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    bcrypt.compare(req.body.password, req.user.password).then(isMatch => {
      if (!isMatch) {
        errors.password = "Password incorrect";
        return res.status(401).json(errors);
      } else {
        const newUserData = {
          password: req.body.passwordNew1
        };

        // Password encryption with salt
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUserData.password, salt, (err, hash) => {
            if (err) throw err;
            newUserData.password = hash;

            User.findOneAndUpdate(
              { email: req.user.email },
              { $set: newUserData },
              { new: true }
            )
              .then(usr => res.json({ success: true }))
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
);

/**
 * @route   POST api/auth/reset-password
 * @desc    Creates reset password entry that expires
 * after 10 minutes or three failed attempts
 * @access  public
 */
router.post("/reset-password", (req, res) => {
  const errors = {};

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      errors.email = "No user with this email";
      return res.status(404).json(errors);
    } else {
      Reset.findOne({ user: user._id }).then(reset => {
        if (reset) {
          Reset.findOneAndRemove({ user: user._id })
            .then(() => {})
            .catch(err => res.status(500).json(err));
        }

        const newReset = {
          user: user._id,
          otp: String(Math.floor(100000 + Math.random() * 900000))
        };
        new Reset(newReset)
          .save()
          .then(reset => {
            // TODO: send email with link and otp
            return res.json(reset);
          })
          .catch(err => res.status(400).json(err));
      });
    }
  });
});

/**
 * @route   POST api/auth/reset-password/:hash
 * @desc    Resets the password for a reset entry with id :hash
 * @access  public
 */
router.post("/reset-password/:hash", (req, res) => {
  const { errors, isValid } = validateResetPasswordInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Reset.findOne({ _id: req.params.hash }).then(reset => {
    if (!reset) {
      // Case no otp with given hash
      errors.reset = "Not a valid reset link";
      return res.status(404).json(errors);
    } else {
      if (reset.exp < Date.now()) {
        // Case reset expired
        errors.expired = "Reset link expired";
        Reset.findOneAndRemove({ _id: req.params.hash })
          .then(() => res.status(401).json(errors))
          .catch(err => res.status(500).json(err));
      } else if (reset.remainingAttempts === 0) {
        // Case attempts used up
        errors.expired = "Too many failed attempts";
        Reset.findOneAndRemove({ _id: req.params.hash })
          .then(() => res.status(401).json(errors))
          .catch(err => res.status(500).json(err));
      } else if (!(reset.otp === String(req.body.otp))) {
        // Case otp wrong
        const updateReset = {
          remainingAttempts: reset.remainingAttempts - 1
        };

        Reset.findOneAndUpdate(
          { _id: reset._id },
          { $set: updateReset },
          { new: true }
        ).then(reset => {});

        errors.otp = "Otp is incorrect";
        errors.remaining = updateReset.remainingAttempts;
        return res.status(404).json(errors);
      } else if (reset.otp === String(req.body.otp)) {
        // Case reset password
        Reset.findOneAndRemove({ _id: req.params.hash })
          .then(() => {})
          .catch(err => res.status(500).json(err));

        const newUserData = {
          password: req.body.passwordNew1
        };

        // Password encryption with salt
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUserData.password, salt, (err, hash) => {
            if (err) throw err;
            newUserData.password = hash;

            User.findOneAndUpdate(
              { _id: reset.user },
              { $set: newUserData },
              { new: true }
            )
              .then(usr => res.json({ success: true }))
              .catch(err => console.log(err));
          });
        });
      }
    }
  });
});

module.exports = router;
