import { hash, verify } from 'argon2';

export const Hasher = {
  hashValue: (value: string | Buffer) => {
    return hash(value);
  },
  verifyHash: (hashedValue: string, value: string | Buffer) => {
    return verify(hashedValue, value);
  },
};
