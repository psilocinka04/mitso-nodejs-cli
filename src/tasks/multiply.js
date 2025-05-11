import { Transform } from 'stream';

export class MultiplyTransform extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(chunk, encoding, callback) {
        try {
            const size = parseInt(chunk.toString().trim());
            
            if (isNaN(size) || size <= 0) {
                throw new Error('Input must be a positive number');
            }
            
            const result = this.createMultiplicationTable(size);
            callback(null, JSON.stringify(result) + '\n');
        } catch (error) {
            callback(error);
        }
    }

    createMultiplicationTable(size) {
        return Array.from({ length: size }, (_, i) =>
            Array.from({ length: size }, (_, j) => (i + 1) * (j + 1))
        );
    }
} 