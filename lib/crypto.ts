export async function encryptData(text: string) {
  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const exportedKey = await window.crypto.subtle.exportKey("raw", key);
  
  return {
    encryptedBase64: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    ivBase64: btoa(String.fromCharCode(...iv)),
    keyBase64: btoa(String.fromCharCode(...new Uint8Array(exportedKey))),
  };
}

export async function decryptData(encryptedBase64: string, ivBase64: string, keyBase64: string) {
  const keyBuffer = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const data = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const key = await window.crypto.subtle.importKey("raw", keyBuffer, "AES-GCM", true, ["decrypt"]);
  const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(decrypted);
}