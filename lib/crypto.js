import CryptoJS from "crypto-js"

export function decryptCrypto(value, SECRET_KEY = null) {
  try {
    const decrypt = CryptoJS.AES.decrypt(value, SECRET_KEY || process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
    return decrypt
  } catch (error) {
    return null
  }
}

export function encryptCrypto(value, SECRET_KEY = null) {
  return CryptoJS.AES.encrypt(value, SECRET_KEY || process.env.CRYPTO_SECRET_KEY).toString()
}
