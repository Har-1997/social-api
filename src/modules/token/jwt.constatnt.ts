import { readFileSync } from "fs";

// This is keys for JWT (public and private), withpublic verify token and with private create token
export const jwtPrivateKey = readFileSync(`${process.cwd()}/crypto/private.pem`).toString();
export const jwtPublicKey  = readFileSync(`${process.cwd()}/crypto/public.pem`).toString();