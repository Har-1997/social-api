import { writeFileSync } from 'fs';
import { generateKeyPairSync } from 'crypto';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: ''
  }
});

writeFileSync(`${process.cwd()}/crypto/private.pem`, privateKey);
writeFileSync(`${process.cwd()}/crypto/public.pem`, publicKey);
