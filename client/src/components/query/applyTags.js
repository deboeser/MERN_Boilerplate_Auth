import isEmpty from "../../validation/is-empty";

const applyTags = (text, appliedTags) => {
  return new Promise((resolve, reject) => {
    isEmpty(text) && reject("No text");
    isEmpty(appliedTags) && reject("No applied tags");

    let charArray = text.split("");
    charArray = charArray.map(item => {
      return {
        char: item,
        classes: []
      };
    });

    appliedTags.forEach(tag => {
      let tmpResult = [];
      tag.phrases.forEach(phrase => {
        let regEx = new RegExp(phrase, "gi");
        while (regEx.exec(text)) {
          tmpResult.push([regEx.lastIndex - phrase.length, regEx.lastIndex]);
        }
      });
      tmpResult.forEach(finding => {
        for (var i = finding[0]; i < finding[1]; i++) {
          charArray[i].classes.push(...tag.classes);
        }
      });
    });

    charArray = charArray.map(item => {
      return {
        char: item.char,
        classes: item.classes.join(" ")
      };
    });

    let result = [];
    let classes = charArray[0].classes;
    let start = 0;

    for (var i = 0; i < charArray.length; i++) {
      if (!(classes == charArray[i].classes)) {
        result.push({
          text: text.substring(start, i),
          classes: classes
        });
        start = i;
        classes = charArray[i].classes;
      }
    }

    result.push({
      text: text.substring(start, charArray.length),
      classes: classes
    });

    resolve(result);
  });
};

export { applyTags };
