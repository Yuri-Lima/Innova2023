/**
 * Description: Replaces text within a portion of a string
 * @param str 
 * @param replace 
 * @param start 
 * @param length 
 * @returns string
 */
function substr_replace (str:string, replace:string, start: number, length:number | undefined):string { // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/substr_replace/
    // original by: Brett Zamir (https://brett-zamir.me)
    if (start < 0) {
      // start position in str
      start = start + str.length
    }
    length = length !== undefined ? length : str.length
    if (length < 0) {
      length = length + str.length - start
    }
    return [
      str.slice(0, start),
      replace.substring(0, length),
      replace.slice(length),
      str.slice(start + length)
    ].join('')
  }

  export default substr_replace