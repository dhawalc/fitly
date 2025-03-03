// This is a simple encryption/decryption service
// In a real app, you would use a more secure approach and store keys securely

// Simple XOR encryption (for demonstration only - not secure for production)
export const encryptData = (data, key = 'healthtrack-secret-key') => {
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(encrypted); // Base64 encode
};

export const decryptData = (encryptedData, key = 'healthtrack-secret-key') => {
  const data = atob(encryptedData); // Base64 decode
  let decrypted = '';
  for (let i = 0; i < data.length; i++) {
    decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return decrypted;
}; 