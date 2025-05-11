import { Command } from 'commander';
import { createReadStream, createWriteStream } from 'fs';
import { EncodeTransform } from './tasks/encode.js';
import { MultiplyTransform } from './tasks/multiply.js';

const program = new Command();

program
    .option('-i, --input <file>', 'Input file path')
    .option('-o, --output <file>', 'Output file path')
    .option('-t, --task <task>', 'Task to execute (encode or multiply)', true)
    .parse(process.argv);

const options = program.opts();

// Validate task
if (!['encode', 'multiply'].includes(options.task)) {
    console.error('Error: Task must be either "encode" or "multiply"');
    process.exit(1);
}

// Create appropriate transform stream
const transformStream = options.task === 'encode' 
    ? new EncodeTransform()
    : new MultiplyTransform();

// Set up input stream
let inputStream;
if (options.input) {
    try {
        inputStream = createReadStream(options.input);
    } catch (error) {
        console.error(`Error reading input file: ${error.message}`);
        process.exit(1);
    }
} else {
    inputStream = process.stdin;
}

// Set up output stream
let outputStream;
if (options.output) {
    try {
        outputStream = createWriteStream(options.output);
    } catch (error) {
        console.error(`Error writing to output file: ${error.message}`);
        process.exit(1);
    }
} else {
    outputStream = process.stdout;
}

// Handle errors
inputStream.on('error', (error) => {
    console.error(`Input stream error: ${error.message}`);
    process.exit(1);
});

outputStream.on('error', (error) => {
    console.error(`Output stream error: ${error.message}`);
    process.exit(1);
});

transformStream.on('error', (error) => {
    console.error(`Transform error: ${error.message}`);
    process.exit(1);
});

// Pipe streams
inputStream
    .pipe(transformStream)
    .pipe(outputStream);

// If reading from stdin, keep the process alive
if (!options.input) {
    process.stdin.resume();
} 