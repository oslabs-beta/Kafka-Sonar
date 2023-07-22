import { Buffer } from 'buffer';

export default (string: String) => {
  return new Uint8Array(Buffer.from(string));
}