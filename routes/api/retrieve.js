const express = require("express");
const router = express.Router();
const { getAbstract } = require("../../utils/retrieveAbstract");
const { getLinkFromDOI } = require("../../utils/retrieveDoiUrl");
const isEmpty = require("../../validation/is-empty");

/**
 * @route   POST api/retrieve/doitourl/:doi
 * @desc    Get hyperlink from DOI
 * @access  public
 */
router.get("/doitourl/:doi(*)", (req, res) => {
  const errors = {};
  getLinkFromDOI(req.params.doi)
    .then(link => {
      return res.json({ link: link });
    })
    .catch(err => {
      errors.nolink = "No link available";
      return res.status(404).json(errors);
    });
});

/**
 * @route   POST api/retrieve/doitoabstract/:doi
 * @desc    Get abstract from DOI
 * @access  public
 */
router.get("/doitoabstract/:doi(*)", (req, res) => {
  const errors = {};
  getLinkFromDOI(req.params.doi)
    .then(link => {
      getAbstract(link)
        .then(arr => {
          if (arr.length == 0) {
            errors.noabstract = "No abstract available";
            return res.status(404).json(errors);
          } else {
            return res.json({
              link: link,
              count: arr.length,
              results: arr,
              abstract: arr.join("\n")
            });
          }
        })
        .catch(err => {
          errors.retreivalerror = "Errors occured while retreiving abstract";
          return res.status(400).json(errors);
        });
    })
    .catch(err => {
      errors.nolink = "No source for abstract found";
      return res.status(404).json(errors);
    });
});

module.exports = router;
