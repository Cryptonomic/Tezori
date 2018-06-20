const minLength = function(length) {
  return `Pass Phrase must be at least ${length} characters.`
}

export default function validate(value, validateType) {
  switch(validateType) {
    case 'notEmpty':
      if (!value) {
        return 'Must not be empty';
      }
      break;
    case 'locationFilled':
      if (!value.length) {
        console.log('value length', value.length)
        return 'Must upload a wallet.'
      }
      break;
    case 'minLength8': 
      if (value.length < 8) {
        return minLength(8);
      }
      break;
    case 'samePassPhrase':
      //value = [typeof passPhrase, typeof confirmedPassPhrase]
      if (!(Array.isArray(value ) && value.length == 2)) {
        return '[ERR] Not valid parameters.'
      }

      if (value[0] !== value[1]) {
        return 'Passphrases must be equal.'
      }
      break;
  }
  return false;
}