import { validWSBaseData } from './validWSData.js';

export function getInvalidWSData(type) {

  const base = { ...validWSBaseData };

  switch (type) {

    case 'EMPTY_ALL_FIELDS':
      return {
        firstName: '',
        lastName: '',
        dob: '',
        address: '',
        city: '',
        postCode: '',
        phone: ''
      };

    case 'FIRST_NAME_NUMBERS':
      return { ...base, firstName: '1234' }; // numbers not allowed

    case 'LAST_NAME_NUMBERS':
      return { ...base, lastName: '5678' }; // numbers not allowed

    case 'UNDERAGE_DOB':
      return { ...base, dob: '2010-01-01' }; // less than 18 years old

    case 'ADDRESS_SPECIAL_CHARS':
      return { ...base, address: '@@##!!' }; // invalid chars

    case 'CITY_SPECIAL_CHARS':
      return { ...base, city: '@@##' }; // invalid chars

    case 'CITY_NUMERIC':
      return { ...base, city: '12345' }; // numbers not allowed

    case 'POSTCODE_SPECIAL_CHARS':
      return { ...base, postCode: '@@##' }; // invalid postal code

    case 'INVALID_PHONE':
      return { ...base, phone: 'abcd123' }; // invalid phone format

    case 'FIRST_NAME_TOO_SHORT':
      return { ...base, firstName: 'A' }; // too short

    case 'LAST_NAME_TOO_SHORT':
      return { ...base, lastName: 'B' }; // too short

    case 'POSTCODE_TOO_SHORT':
      return { ...base, postCode: '1' }; // too short

    case 'PHONE_TOO_SHORT':
      return { ...base, phone: '123' }; // too short

    default:
      throw new Error(`Unknown WS validation type: ${type}`);
  }
}
