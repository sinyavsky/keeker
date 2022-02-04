import { Near } from 'near-api-js';
import { nearConnectionConfig } from '../utils/constants.js';

export default async function getValidatorsList() {  
  try {
    const near = new Near(nearConnectionConfig);
    return (await near.connection.provider.validators(null)).current_validators.reduce(function(res, current) {
      res.push(current.account_id);
      return res;
    }, []);
  }

  catch(error) {
    return [];
  }
}