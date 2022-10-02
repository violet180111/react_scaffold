export { default as HttpReq } from './HttpReq';
export { default as commonStyles } from './commonStyles';

/**
 * @description: 获取随机字符串
 */
export function createUUID(size = 16) {
  const buffer = new Uint8Array(size);

  for (let i = 0; i < size; ++i) {
    buffer[i] = (Math.random() * 0xff) | 0;
  }

  buffer[6] = (buffer[6] & 0x4f) | 0x40;
  buffer[8] = (buffer[8] & 0xbf) | 0x80;
  let result = '';

  for (let offset = 0; offset < size; ++offset) {
    const byte = buffer[offset];

    if (offset === 4 || offset === 6 || offset === 8) result += '-';
    if (byte < 16) result += '0';

    result += byte.toString(16).toLowerCase();
  }

  return result;
}
