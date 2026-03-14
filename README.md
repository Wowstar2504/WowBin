# WowBin
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWowstar2504%2FWowBin)

![WowBin](https://img.shields.io/badge/version-1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**WowBin** is a "Zero-Knowledge" secret sharing platform. It allows users to share sensitive information (passwords, code snippets, secrets) with the peace of mind that the server never sees the content in plaintext.

### Features
- **Client-Side Encryption**: Uses the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) (AES-GCM 256 BIT) to encrypt notes before they leave your browser.
- **Burn After Reading**: Notes are automatically delete from the Redis database the moment they are retrieved.
- **Self-Destruct Timers**: All notes automatically expires after 1 hour.
- **Zero-Knowledge**: The decryption key is stored in the **URL Fragment**(``#``). Fragments are never sent to the server, making it mathematically impossible for the host to read your data.

### License & Contact
- This is licensed under the MIT license which you may check [here](https://github.com/wowstar2504/WowBin/blob/main/LICENSE).
- If you have any questions or inquiries about this project, please reach me [at wowstar2504@proton.me](mailto:wowstar2504@proton.me).