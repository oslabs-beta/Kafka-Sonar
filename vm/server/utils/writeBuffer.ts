import { Buffer } from 'buffer';

// utility function for converting strings to buffers to write files
export default (string: String) => {
  return new Uint8Array(Buffer.from(string));
};