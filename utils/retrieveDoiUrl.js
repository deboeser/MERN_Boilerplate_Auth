const axios = require("axios");

Promise.almost = r => Promise.all(r.map(p => (p.catch ? p.catch(e => e) : p)));

/**
 * Retrieves hyperlink for a given DOI from doi.org
 * @param {String} doi DOI to find hyperlink for
 */
const getLinkFromDOI = doi => {
  console.log(doi);
  return new Promise((resolve, reject) => {
    axios
      .get("https://doi.org/api/handles/" + doi)
      .then(res => {
        let arr = res.data.values;
        arr = arr.filter(item => item.type === "URL");
        resolve(arr[0].data.value);
      })
      .catch(err => reject(err));
  });
};

const getLinksFromDOIList = doiList => {
  let promises = [];
  doiList.forEach(doi => promises.push(getLinkFromDOI(doi)));

  return new Promise((resolve, reject) => {
    Promise.almost(promises)
      .then(values => {
        resolve(values.filter(item => typeof item == "string"));
      })
      .catch(err => reject(err));
  });
};

module.exports = { getLinksFromDOIList, getLinkFromDOI };
