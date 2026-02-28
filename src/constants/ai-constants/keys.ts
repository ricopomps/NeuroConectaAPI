import { PRIVATE_KEY_BASE64, PUBLIC_KEY_BASE64 } from '../../config/env';

export const PRIVATE_KEY = Buffer.from(PRIVATE_KEY_BASE64 || '', 'base64');
export const PUBLIC_KEY = Buffer.from(PUBLIC_KEY_BASE64 || '', 'base64');
