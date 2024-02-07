export const slugify = (str: string, replacement = '-'): string =>
  str
    // remove not allowed characters
    .replace(/[^\w\s$*_+~.()'"!-:@]+/g, '')
    // trim leading/trailing spaces
    .trim()
    // also remove duplicates of the replacement character
    .replace(new RegExp('[\\s' + replacement + ']+', 'g'), replacement)
    .toLowerCase()
    .replace(new RegExp('[^a-zA-Z0-9' + replacement + ']', 'g'), '')
    .replace(/[^\w\s$*_+~()'"!\-:@]+/g, replacement);
