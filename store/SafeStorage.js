import { encrypt, decrypt } from 'react-native-simple-encryption';

export function encryptString(message, key) {
    let newMessage = message.length + '!' + message;
    return encrypt(key, newMessage);
}

export function decryptString(message, key) {
    const decryptedMessage = decrypt(key, message);
    const start = decryptedMessage.indexOf('!') + 1;
    const length = parseInt(decryptedMessage.substring(0, start));
    return decryptedMessage.substring(start, start + length);
}