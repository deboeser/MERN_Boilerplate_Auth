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
  getLinkFromDOI(req.params.doi)
    .then(obj => {
      return res.json({ ...obj });
    })
    .catch(err => {
      return res.status(404).json(err);
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
    .then(obj => {
      getAbstract(obj.url)
        .then(arr => {
          if (arr.length == 0) {
            obj.error.text = "No abstract found on website";
            obj.error.abstract = true;
            return res.status(404).json(obj);
          } else {
            obj.abstract = {
              resultcount: arr.length,
              text: arr.join(" | "),
              details: arr
            };
            return res.json(obj);
          }
        })
        .catch(err => {
          obj.error.text = "Errors occured while extracting abstract";
          obj.error.abstract = true;
          return res.status(400).json(obj);
        });
    })
    .catch(obj => {
      return res.status(404).json(obj);
    });
});

module.exports = router;
