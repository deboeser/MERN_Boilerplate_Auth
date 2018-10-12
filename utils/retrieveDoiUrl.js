const axios = require("axios");
const isEmpty = require("../validation/is-empty");

Promise.almost = r => Promise.all(r.map(p => (p.catch ? p.catch(e => e) : p)));

/**
 * Retrieves hyperlink for a given DOI from doi.org
 * @param {String} doi DOI to find hyperlink for
 */
const getLinkFromDOI = doi => {
  return new Promise((resolve, reject) => {
    let result = {
      doi: doi,
      error: {}
    };
    axios
      .get("https://doi.org/api/handles/" + doi)
      .then(res => {
        let arr = res.data.values;
        arr = arr.filter(item => item.type === "URL");
        result.url = arr[0].data.value;
        resolve(result);
      })
      .catch(err => {
        result.error.text = "No link found";
        result.error.url = true;
        reject(result);
      });
  });
};

const getLinksFromDOIList = doiList => {
  let promises = [];
  doiList.forEach(doi => promises.push(getLinkFromDOI(doi)));

  return new Promise((resolve, reject) => {
    Promise.almost(promises)
      .then(values => {
        resolve(values);
      })
      .catch(err => reject(err));
  });
};

module.exports = { getLinksFromDOIList, getLinkFromDOI };
