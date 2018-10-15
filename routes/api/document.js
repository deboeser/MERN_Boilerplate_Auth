const express = require("express");
const document = express.Router();
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");

const Document = require("../../models/Document");
const validateDocumentInput = require("../../validation/document");
/**
 * @route   POST api/document/
 * @desc    Get all documents
 * @access  private
 */
document.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Document.find()
      .sort({ date: -1 })
      .then(documents => {
        if (isEmpty(documents)) {
          errors.nodocuments = "There are no documents in the database";
          return res.status(404).json(errors);
        }
        res.json(documents);
      })
      .catch(err =>
        res
          .status(404)
          .json({ nodocuments: "There are no documents in the database" })
      );
  }
);

/**
 * @route   GET api/document/id/:id
 * @desc    Get document by id
 * @access  private
 */
document.get(
  "/id/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Document.findOne({ _id: req.params.id })
      .then(document => {
        if (!document) {
          errors.nodocument = "No document with this id";
          return res.status(404).json(errors);
        }
        return res.json(document);
      })
      .catch(err => {
        errors.nodocument = "No document with this id";
        return res.status(404).json(errors);
      });
  }
);

/**
 * @route   GET api/document/doi/:doi
 * @desc    Get document by DOI
 * @access  private
 */
document.get(
  "/doi/:doi(*)",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Document.findOne({ doi: req.params.doi })
      .then(document => {
        if (!document) {
          errors.nodocument = "No document with this DOI";
          return res.status(404).json(errors);
        }
        return res.json(document);
      })
      .catch(err => {
        errors.nodocument = "No document with this DOI";
        return res.status(404).json(errors);
      });
  }
);

/**
 * @route   POST api/document/
 * @desc    Create or update a document
 * @access  private
 */
document.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateDocumentInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newDocument = {};

    newDocument.doi = req.body.doi;
    newDocument.url = req.body.url;
    newDocument.abstract = req.body.abstract;

    if (!isEmpty(req.body.id)) {
      Document.findOne({ _id: req.body.id })
        .then(document => {
          if (document) {
            // Case Update
            Document.findOneAndUpdate(
              { _id: req.body.id },
              { $set: newDocument },
              { new: true }
            ).then(document => res.json(document));
          } else {
            // Case Create because ID does not exist
            new Document(newDocument)
              .save()
              .then(document => res.json(document))
              .catch(err => res.status(400).json(err));
          }
        })
        .catch(err => res.status(400).json(err));
    } else {
      new Document(newDocument)
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(400).json(err));
    }
  }
);

/**
 * @route   DELETE api/document/id/:id
 * @desc    Delete document by id
 * @access  private
 */
document.delete(
  "/id/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Document.findOneAndRemove({ _id: req.params.id })
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = document;
