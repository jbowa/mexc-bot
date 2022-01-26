import crypto from 'crypto-js';

const sign = (accessKey: string, timestamp: string, params: string, secretKey: string) => {
  let hmacDigest = '';
  try {
    hmacDigest = crypto.HmacSHA256(`${accessKey}${timestamp}${params}`, secretKey).toString();
    return hmacDigest;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default sign;
