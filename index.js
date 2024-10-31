function calculateMD5(message) {
  if (typeof message !== 'string' || message.length === 0) {
    throw new Error('Invalid input: Message must be a non-empty string.');
  }

  // Convert the message to bytes
  const bytes = new TextEncoder().encode(message);

  // Initialize MD5 registers
  let A = 0x67452301;
  let B = 0xefcdab89;
  let C = 0x98badcfe;
  let D = 0x10325476;

  // Padding
  const paddedBytes = padBytes(bytes);

  // Process the message in 64-byte blocks
  for (let i = 0; i < paddedBytes.length; i += 64) {
    const block = paddedBytes.slice(i, i + 64);
    [A, B, C, D] = updateBlock(A, B, C, D, block);
  }

  // Finalize the hash
  return (
    A.toString(16).padStart(8, '0') +
    B.toString(16).padStart(8, '0') +
    C.toString(16).padStart(8, '0') +
    D.toString(16).padStart(8, '0')
  );
}

// Padding function
function padBytes(bytes) {
  const paddedLength = Math.ceil((bytes.length + 8) / 64) * 64;
  const paddedBytes = new Uint8Array(paddedLength);
  paddedBytes.set(bytes);
  paddedBytes[bytes.length] = 0x80; // Append the '1' bit
  const lengthInBits = bytes.length * 8;
  for (let i = 0; i < 8; i++) {
    paddedBytes[paddedLength - 8 + i] = (lengthInBits >> (i * 8)) & 0xff;
  }
  return paddedBytes;
}

// Block processing
function updateBlock(A, B, C, D, block) {
  const words = new Array(16).fill(0);
  for (let i = 0; i < 64; i += 4) {
    words[i >> 2] =
      (block[i] | (block[i + 1] << 8) | (block[i + 2] << 16) | (block[i + 3] << 24)) >>> 0; // Unsigned
  }

  let a = A, b = B, c = C, d = D;

  // Round 1
  a = addRotLeft(add(a, f(b, c, d) + words[0] + 0xd76aa478), 7);
  d = addRotLeft(add(d, f(a, b, c) + words[1] + 0xe8c7b756), 12);
  c = addRotLeft(add(c, f(d, a, b) + words[2] + 0x242070db), 17);
  b = addRotLeft(add(b, f(c, d, a) + words[3] + 0xc1bdceee), 22);
  a = addRotLeft(add(a, f(b, c, d) + words[4] + 0xf57c0faf), 7);
  d = addRotLeft(add(d, f(a, b, c) + words[5] + 0x4787c62a), 12);
  c = addRotLeft(add(c, f(d, a, b) + words[6] + 0xa8304613), 17);
  b = addRotLeft(add(b, f(c, d, a) + words[7] + 0xfd469501), 22);
  a = addRotLeft(add(a, f(b, c, d) + words[8] + 0x698098d8), 7);
  d = addRotLeft(add(d, f(a, b, c) + words[9] + 0x8b44f7af), 12);
  c = addRotLeft(add(c, f(d, a, b) + words[10] + 0xffff5bb1), 17);
  b = addRotLeft(add(b, f(c, d, a) + words[11] + 0x895cd7be), 22);
  a = addRotLeft(add(a, f(b, c, d) + words[12] + 0x6b901122), 7);
  d = addRotLeft(add(d, f(a, b, c) + words[13] + 0xfd987193), 12);
  c = addRotLeft(add(c, f(d, a, b) + words[14] + 0xa679438e), 17);
  b = addRotLeft(add(b, f(c, d, a) + words[15] + 0x49b40821), 22);

  // Round 2
  a = addRotLeft(add(a, g(b, c, d) + words[1] + 0xf61e2562), 5);
  d = addRotLeft(add(d, g(a, b, c) + words[6] + 0xc040b340), 9);
  c = addRotLeft(add(c, g(d, a, b) + words[11] + 0x265e5a51), 14);
  b = addRotLeft(add(b, g(c, d, a) + words[0] + 0xe9b6c7aa), 20);
  a = addRotLeft(add(a, g(b, c, d) + words[5] + 0x0b2a7c6f), 5);
  d = addRotLeft(add(d, g(a, b, c) + words[10] + 0x498e38d1), 9);
  c = addRotLeft(add(c, g(d, a, b) + words[15] + 0x5cb0a9dc), 14);
  b = addRotLeft(add(b, g(c, d, a) + words[4] + 0x76e3d5e9), 20);
  a = addRotLeft(add(a, g(b, c, d) + words[9] + 0x983e5152), 5);
  d = addRotLeft(add(d, g(a, b, c) + words[14] + 0xa831c66d), 9);
  c = addRotLeft(add(c, g(d, a, b) + words[3] + 0xb00327c8), 14);
  b = addRotLeft(add(b, g(c, d, a) + words[8] + 0xbf597fc7), 20);
  a = addRotLeft(add(a, g(b, c, d) + words[13] + 0xc4ce6af9), 5);
  d = addRotLeft(add(d, g(a, b, c) + words[2] + 0x4787c62a), 9);
  c = addRotLeft(add(c, g(d, a, b) + words[7] + 0x8b44f7af), 14);
  b = addRotLeft(add(b, g(c, d, a) + words[12] + 0xffff5bb1), 20);

  // Round 3
  a = addRotLeft(add(a, h(b, c, d) + words[5] + 0x6b901122), 4);
  d = addRotLeft(add(d, h(a, b, c) + words[8] + 0xfd987193), 11);
  c = addRotLeft(add(c, h(d, a, b) + words[11] + 0xa679438e), 16);
  b = addRotLeft(add(b, h(c, d, a) + words[14] + 0x49b40821), 23);
  a = addRotLeft(add(a, h(b, c, d) + words[1] + 0xf61e2562), 4);
  d = addRotLeft(add(d, h(a, b, c) + words[4] + 0xc040b340), 11);
  c = addRotLeft(add(c, h(d, a, b) + words[7] + 0x265e5a51), 16);
  b = addRotLeft(add(b, h(c, d, a) + words[10] + 0xe9b6c7aa), 23);
  a = addRotLeft(add(a, h(b, c, d) + words[13] + 0x0b2a7c6f), 4);
  d = addRotLeft(add(d, h(a, b, c) + words[0] + 0x498e38d1), 11);
  c = addRotLeft(add(c, h(d, a, b) + words[3] + 0x5cb0a9dc), 16);
  b = addRotLeft(add(b, h(c, d, a) + words[6] + 0x76e3d5e9), 23);

  // Combine the results
  A = (A + a) >>> 0;
  B = (B + b) >>> 0;
  C = (C + c) >>> 0;
  D = (D + d) >>> 0;

  return [A, B, C, D];
}

// Utility functions
function f(x, y, z) {
  return (x & y) | (~x & z);
}

function g(x, y, z) {
  return (x & z) | (y & ~z);
}

function h(x, y, z) {
  return x ^ y ^ z;
}

function add(x, y) {
  return (x + y) >>> 0; // Unsigned addition
}

function addRotLeft(x, y) {
  return (x + (y << (x & 31))) | (y >>> (32 - (x & 31))); 
}

const inputString = "Hello, World!";
const md5Hash = calculateMD5(inputString);
console.log(`MD5 hash of "${inputString}": ${md5Hash}`);
