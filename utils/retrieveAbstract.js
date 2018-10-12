const { JSDOM } = require("jsdom");
const phantom = require("phantom");

const MIN_LENGTH = 300;
const TIMEOUT = 120000;
const MAX_ATTEMPS = 3;

let _ph;

/**
 * Returns a promise that starts a phantom instance
 * Resolve: returns the phantom instance
 * Reject: Returns an error object
 */
const startPhantom = () => {
  return new Promise((resolve, reject) => {
    phantom
      .create(["--load-images=true"], { logLevel: "error" })
      .then(ph => {
        _ph = ph;
        resolve(_ph);
      })
      .catch(err => reject(err));
  });
};

/**
 * Returns a promise that resolves into a string containing the website
 * requested under the given link, if failed process will be repeated up to
 * MAX_ATTEMPTS times
 * @param {Phantom} _ph Running phantom instance
 * @param {WebPage} _page Phantom page instance to render on
 * @param {String} link Link that should be rendered by phantom
 * @param {number} attempt Attempt to retrieve website
 */
const getRenderedWebsite = (_ph, _page, link, attempt) => {
  return new Promise((resolve, reject) => {
    let to = setTimeout(() => {
      clearTimeout(to);
      if (attempt < MAX_ATTEMPS) {
        console.log(`Timeout attempt ${attempt} for ${link}`);
        getRenderedWebsite(_ph, _page, link, attempt + 1)
          .then(res => resolve(res))
          .catch(err => reject(err));
      } else {
        reject("Final Timeout for " + link);
        _ph
          .exit()
          .then(res => {})
          .catch(err => {});
      }
    }, TIMEOUT);

    _ph
      .createPage()
      .then(page => {
        _page = page;
        _page.onUrlChanged = function(targetUrl) {
          console.log("New URL: " + targetUrl);
        };
        return _page.open(link);
      })
      .then(status => {
        clearTimeout(to);
        return _page.property("content");
      })
      .then(content => {
        resolve(content);
        _page
          .close()
          .then(res => {})
          .catch(err => {});
        _ph
          .exit()
          .then(res => {})
          .catch(err => {});
      })
      .catch(function(e) {
        reject(e);
      });
  });
};

/**
 * Extracts the abstract from the dom passed in as String txt
 * @param {String} txt HTML of webpage as txt
 */
const extractAbstractFromDom = txt => {
  const dom = new JSDOM(txt);
  const arr = [
    ...dom.window.document.querySelectorAll(
      "[class*='abstract'],[id*='abstract'],[class*='Abstract'],[id*='Abstract']"
    )
  ];
  let results = [];
  if (arr.length > 0) {
    arr.forEach(node => {
      getAllChildren(node, results);
    });
  } else {
    // console.log("### No tags for " + link + " ###");
  }
  const result_set = results.filter(
    (entry, pos) => entry.length > MIN_LENGTH && results.indexOf(entry) == pos
  );
  return result_set;
};

/**
 * Checks if all children of acceptable types to merge their content into one result
 * @param {*} node
 */
const allAcceptable = node => {
  const childrenArray = [...node.childNodes];
  return childrenArray.every(node => {
    const acceptable = [
      "SPAN",
      "P",
      "A",
      "B",
      "I",
      "STRONG",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "EM",
      "SUB",
      "SUP",
      "FONT",
      undefined
    ];
    return acceptable.indexOf(node.tagName) > -1;
  });
};

/**
 * Recursively retrieves all descendents of a node and pushes the text content of
 * all descendents with a minimum length  (MIN_LENGTH) into the results array
 * @param {*} node
 * @param {Array} results
 */
const getAllChildren = (node, results) => {
  if (node.childNodes.length === 0) {
    results.push(node.textContent);
  } else if (allAcceptable(node)) {
    const concatContent = [...node.childNodes]
      .map(node => node.textContent)
      .join(" ");
    if (concatContent.length > MIN_LENGTH) {
      results.push(concatContent);
    }
  } else {
    [...node.childNodes].forEach(child => {
      getAllChildren(child, results);
    });
  }
};

/**
 * retrieves all text blocks from a website under a given link that could be a scientific abstract
 * @param {String} link   retrieves the abstract from a link
 */
const getAbstract = link => {
  return new Promise((resolve, reject) => {
    let page;
    startPhantom()
      .then(ph => {
        getRenderedWebsite(ph, page, link, 0)
          .then(txt => resolve(extractAbstractFromDom(txt)))
          .catch(err => reject(err));
      })
      .catch(e => console.log(e));
  });
};

module.exports = { getAbstract };
