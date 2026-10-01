export const generateCategorySku = (name: string): string => {
  const words = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "";
  }

  if (words.length === 1) {
    const word = words[0];

    if (word.length === 1) {
      return word;
    }

    return `${word[0]}${word[1]}${word[word.length - 1]}`;
  }

  if (words.length === 2) {
    return `${words[0][0]}${words[1][0]}${
      words[1][words[1].length - 1]
    }`;
  }

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("");
};