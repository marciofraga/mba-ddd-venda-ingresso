import { validate as uuidValidate } from 'uuid';
import * as crypto from 'crypto';
import { ValueObject } from './value-object';

export class Uuid extends ValueObject<string> {
  constructor(id?: string) {
    super(id || crypto.randomUUID());
    this.validate();
  }

  private validate() {
    const isValid = uuidValidate(this.value);
    if (!isValid) {
      throw new InvalidUuidError(this.value);
    }
  }

  private getRandomUUID() {
    if(typeof window === 'undefined') {
      return crypto.randomBytes(16).toString('hex');
    }
    return crypto.randomUUID();
  }
}

export class InvalidUuidError extends Error {
  constructor(invalidValue: any) {
    super(`Value ${invalidValue} must be a valid UUID`);
    this.name = 'InvalidUuidError';
  }
}

export default Uuid;