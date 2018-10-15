const express = require("express");
const router = express.Router();
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");

const Colortag = require("../../models/Colortag");
const validateColortagInput = require("../../validation/colortag");

/**
 * @route   POST api/colortag/
 * @desc    Get all colortags
 * @access  private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Colortag.find()
      .sort({ date: -1 })
      .then(colortags => {
        if (!colortags) {
          errors.nocolortags = "There are no colortags in the database";
          return res.status(404).json(errors);
        }
        res.json(colortags);
      })
      .catch(err =>
        res
          .status(404)
          .json({ nocolortags: "There are no colortags in the database" })
      );
  }
);

/**
 * @route   POST api/colortag/id/:id
 * @desc    Get all colortags of the current user
 * @access  private
 */
router.get(
  "/id/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Colortag.findOne({ _id: req.params.id })
      .then(colortag => {
        if (!colortag) {
          errors.nocolortag = "No colortag with this id";
          return res.status(404).json(errors);
        }
        return res.json(colortag);
      })
      .catch(err => {
        errors.nocolortag = "No colortag with this id";
        return res.status(404).json(errors);
      });
  }
);

/**
 * @route   POST api/colortag/current
 * @desc    Get all colortags of the current user
 * @access  private
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Colortag.find({ user: req.user.id })
      .sort({ date: -1 })
      .then(colortags => {
        if (!colortags) {
          errors.nocolortags = "You do not have any colortags yet";
          return res.status(404).json(errors);
        }
        return res.json(colortags);
      })
      .catch(err =>
        res
          .status(404)
          .json({ nocolortags: "You do not have any colortags yet" })
      );
  }
);

/**
 * @route   POST api/colortag/
 * @desc    Create or update a colortag
 * @access  private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateColortagInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newColortag = {};

    newColortag.user = req.user.id;
    newColortag.tagname = req.body.tagname;
    newColortag.color = req.body.color;
    newColortag.background = req.body.background;
    newColortag.underlined = req.body.underlined;
    newColortag.bold = req.body.bold;
    newColortag.bigger = req.body.bigger;

    if (typeof req.body.phrases !== "undefined") {
      newColortag.phrases = req.body.phrases.split(",");
    }

    if (!isEmpty(req.body.id)) {
      Colortag.findOne({ _id: req.body.id })
        .then(colortag => {
          if (colortag) {
            // Case Update
            Colortag.findOneAndUpdate(
              { _id: req.body.id },
              { $set: newColortag },
              { new: true }
            ).then(colortag => res.json(colortag));
          } else {
            // Case Create because ID does not exist
            new Colortag(newColortag)
              .save()
              .then(post => res.json(post))
              .catch(err => res.status(400).json(err));
          }
        })
        .catch(err => res.status(400).json(err));
    } else {
      new Colortag(newColortag)
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(400).json(err));
    }
  }
);

/**
 * @route   DELETE api/colortag/id/:id
 * @desc    Delete colortag by id
 * @access  private
 */
router.delete(
  "/id/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Colortag.findOneAndRemove({ _id: req.params.id })
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
