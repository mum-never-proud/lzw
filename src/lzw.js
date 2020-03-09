!(function (factory) {
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define('$L', factory);
  } else {
    window.$L = factory();
  }
})(function () {
  return {
    compress(string) {
      if (!string || typeof string !== 'string') {
        throw Error('i can\'t encode this junk, goodbye sista');
      }

      const dict = {},
        output = [],
        data = string.split(''),
        DATA_LEN = data.length;

      let i = 1,
        code = 256,
        phrase = data[0],
        currChar;

      const t1 = performance.now();

      for (; i < DATA_LEN; i++) {
        currChar = data[i];

        if (dict[phrase + currChar]) {
          phrase += currChar;
        } else {
          output.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
          dict[phrase + currChar] = code++;
          phrase = currChar;
        }
      }
      output.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));

      const t2 = performance.now();

      return {
        dict,
        string,
        encodedString: output.map(o => String.fromCharCode(o)).join(''),
        originalLength: DATA_LEN,
        endcodedLength: output.length,
        executionTime: `${t2 - t1}ms`,
      };
    },

    decompress(string) {
      if (!string || typeof string !== 'string') {
        throw Error('you want me to decode this jenk? goodbye sista');
      }

      const dict = {},
        output = [],
        data = string.split(''),
        DATA_LEN = data.length;

      let i = 1,
        code = 256,
        currChar = data[0],
        phrase = currChar,
        oldPhrase = currChar;

      output.push(phrase);

      const t1 = performance.now();

      for (; i < DATA_LEN; i++) {
        const currCharCode = data[i].charCodeAt(0);

        if (currCharCode < 256) {
          phrase = data[i];
        } else {
          phrase = dict[currCharCode] ? dict[currCharCode] : (oldPhrase + currChar);
        }
        output.push(phrase);
        currChar = phrase.charAt(0);
        dict[code++] = oldPhrase + currChar;
        oldPhrase = phrase;
      }

      const t2 = performance.now(),
        decodedString = output.join('');

      return {
        dict,
        decodedString,
        string,
        originalLength: DATA_LEN,
        decodedLength: decodedString.length,
        executionTime: `${t2 - t1}ms`,
      };
    }
  };
});
