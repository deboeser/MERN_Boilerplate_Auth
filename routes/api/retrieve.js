const express = require("express");
const router = express.Router();
const { getAbstract } = require("../../utils/retrieveAbstract");
const { getLinkFromDOI } = require("../../utils/retrieveDoiUrl");
const isEmpty = require("../../validation/is-empty");
const Document = require("../../models/Document");

/**
 * @route   POST api/retrieve/doitourl/:doi
 * @desc    Get hyperlink from DOI
 * @access  public
 */
router.get("/doitourl/:doi(*)", (req, res) => {
  Document.findOne({ doi: req.params.doi })
    .then(document => {
      if (!document) {
        getLinkFromDOI(req.params.doi)
          .then(obj => {
            const newDocument = {
              doi: obj.doi,
              url: obj.url
            };
            new Document(newDocument)
              .save()
              .then(doc => console.log("Saved: ", doc))
              .catch(err => console.log(err));
            return res.json({ ...obj });
          })
          .catch(err => {
            return res.status(404).json(err);
          });
      } else {
        return res.json({
          doi: document.doi,
          url: document.url
        });
      }
    })
    .catch(err => console.log(err));
});

/**
 * @route   POST api/retrieve/doitoabstract/:doi
 * @desc    Get abstract from DOI
 * @access  public
 */
router.get("/doitoabstract/:doi(*)", (req, res) => {
  const errors = {};
  Document.findOne({ doi: req.params.doi }).then(document => {
    if (!document) {
      getLinkFromDOI(req.params.doi)
        .then(obj => {
          const newDocument = {
            doi: req.params.doi,
            url: obj.url
          };
          getAbstract(obj.url)
            .then(arr => {
              if (arr.length == 0) {
                obj.error.text = "No abstract found on website";
                obj.error.abstract = true;
                return res.status(404).json(obj);
              } else {
                newDocument.abstract = arr.join(" | ");
                obj.abstract = newDocument.abstract;
                obj.abstractDetails = {
                  resultcount: arr.length,
                  details: arr
                };
                return res.json(obj);
              }
            })
            .catch(err => {
              obj.error.text = "Errors occured while extracting abstract";
              obj.error.abstract = true;
              return res.status(400).json(obj);
            })
            .then(() => {
              new Document(newDocument)
                .save()
                .then(doc => console.log("Saved:", doc))
                .catch(err => console.log(err));
            });
        })
        .catch(obj => {
          return res.status(404).json(obj);
        });
    } else if (isEmpty(document.abstract)) {
      getAbstract(document.url).then(arr => {
        let obj = {
          doi: document.doi,
          url: document.url
        };
        if (arr.length == 0) {
          obj.error = {
            text: "No abstract found on website",
            abstract: true
          };
          return res.status(404).json(obj);
        } else {
          obj.abstract = arr.join(" | ");
          obj.abstractDetails = {
            resultcount: arr.length,
            details: arr
          };
          const newDocument = {
            doi: document.doi,
            url: document.url,
            abstract: obj.abstract
          };
          Document.findOneAndUpdate(
            { _id: document._id },
            { $set: newDocument },
            { new: true }
          ).then(doc => console.log("Updated: ", doc));
          return res.json(obj);
        }
      });
    } else {
      return res.json({
        doi: document.doi,
        url: document.url,
        abstract: document.abstract
      });
    }
  });
});

module.exports = router;
