// src/hooks/useFormat.ts
export const insertSpaceBetweenPairs = (str) => {
    if (str == null) {
      return '';
    }

    let removePlus = false;

    if (str.startsWith('+0')) {
      str = str.slice(1);
      removePlus = true;
    }

    if (removePlus) {
      return str.match(/.{1,2}/g)?.join(' ') || '';
    } else {
      const firstThreeChars = str.slice(0, 3);
      const fourthChar = str.slice(3, 4);
      const restOfChars = str.slice(4);

      const stringWithSpaces = restOfChars.match(/.{1,2}/g)?.join(' ') || '';

      return firstThreeChars + ' ' + fourthChar + ' ' + stringWithSpaces;
    }
  };
