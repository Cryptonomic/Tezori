function minLength(length) {
  return `Pass Phrase must be at least ${length} characters.`
}
/**
 * 
 * @param value { string | string[] }
 * @param validateType { string }
 * @returns { false | string }
 */
export default function hasError(value, validateType) {
  switch(validateType) {
    case 'notEmpty':
      if (!value) {
        return 'Must not be empty';
      }
      break;
    case 'locationFilled':
      if ( !value.length ) {
        return 'Must upload a wallet.';
      }
      break;
    case 'minLength8': 
      if ( value.length < 8 ) {
        return minLength(8);
      }
      break;
    case 'samePassPhrase':
      if ( !(Array.isArray(value ) && value.length == 2) ) {
        return '[ERR] Not valid parameters.';
      }

      if ( value[0] !== value[1] ) {
        return 'Passphrases must be equal.';
      }
      break;
  }
  return false;
}