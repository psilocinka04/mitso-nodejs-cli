import { Transform } from 'stream';

export class EncodeTransform extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(chunk, encoding, callback) {
        try {
            const input = chunk.toString().trim();
            const result = this.encodeString(input);
            callback(null, result + '\n');
        } catch (error) {
            callback(error);
        }
    }

    encodeString(str) {
        const charCount = new Map();
        
        // Count character occurrences (case-insensitive)
        for (const char of str.toLowerCase()) {
            charCount.set(char, (charCount.get(char) || 0) + 1);
        }
        
        // Create result string
        return str
            .toLowerCase()
            .split('')
            .map(char => charCount.get(char) === 1 ? '(' : ')')
            .join('');
    }
} 