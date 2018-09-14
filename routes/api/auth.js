const express = require("express");
const router = express.Router();

/**
 * @route   GET api/auth/example
 * @desc    Implements example boilerplate route
 * @access  public
 */
router.get("/example", (req, res) => res.json({ msg: "Example route" }));

module.exports = router;
