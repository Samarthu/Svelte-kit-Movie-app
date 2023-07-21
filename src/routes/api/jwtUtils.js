// jwtUtils.js
const secretKey = 'svelteapp'; // Replace this with your own secret key

// Function to create a JWT token
export const createToken = async (payload) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await generateSignature(encodedHeader, encodedPayload);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Function to verify a JWT token
export const verifyToken = async (token) => {
  const [encodedHeader, encodedPayload, signature] = token.split('.');

  const expectedSignature = await generateSignature(encodedHeader, encodedPayload);
  if (signature !== expectedSignature) {
    return null; // Invalid token (signature doesn't match)
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  return payload;
};

// Helper function to encode a string to base64url
const base64UrlEncode = (input) => {
  return btoa(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

// Helper function to decode a base64url string
const base64UrlDecode = (input) => {
  return atob(input.replace(/-/g, '+').replace(/_/g, '/'));
};

// Helper function to generate the HMAC SHA-256 signature
const generateSignature = async (encodedHeader, encodedPayload) => {
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signatureInput));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
};
