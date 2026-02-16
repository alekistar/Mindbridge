/**
 * Client-side encryption utilities using Web Crypto API.
 * Uses PBKDF2 for key derivation and AES-GCM for encryption.
 */

// Generate a random salt
export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array).map(b => String.fromCharCode(b)).join('');
};

// Derive a key from a password and salt
const deriveKey = async (password: string, salt: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

// Encrypt text
export const encryptData = async (text: string, password: string): Promise<{ cipherText: string; salt: string; iv: string }> => {
  const salt = generateSalt();
  const key = await deriveKey(password, salt);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();

  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    enc.encode(text)
  );

  // Convert to base64 for storage
  const cipherText = btoa(String.fromCharCode(...new Uint8Array(encryptedContent)));
  const ivString = btoa(String.fromCharCode(...iv));
  const saltString = btoa(salt);

  return { cipherText, salt: saltString, iv: ivString };
};

// Decrypt text
export const decryptData = async (cipherText: string, salt: string, iv: string, password: string): Promise<string> => {
  try {
    const saltBytes = atob(salt);
    const key = await deriveKey(password, saltBytes);
    const ivBytes = new Uint8Array(atob(iv).split('').map(c => c.charCodeAt(0)));
    const cipherBytes = new Uint8Array(atob(cipherText).split('').map(c => c.charCodeAt(0)));

    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: ivBytes
      },
      key,
      cipherBytes
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedContent);
  } catch (e) {
    throw new Error("Decryption failed. Incorrect password or corrupted data.");
  }
};