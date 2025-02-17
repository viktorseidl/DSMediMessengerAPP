import { util } from "node-forge";
import pako from 'pako';
import { toByteArray, fromByteArray } from 'react-native-quick-base64';
import { Buffer } from "buffer";
import { decompressSync, compressSync, gzipSync } from "fflate";
import { deflate, inflate } from 'react-native-gzip';


//AUSGELAGERT IN DEN BACKEND


export function decompress(base64String) {
    const compressedBuffer = toByteArray(base64String);
    const originalLength = new DataView(compressedBuffer.buffer).getUint32(0, true);
    console.log(`Original Length: ${originalLength}`);
    const compressedData = compressedBuffer.subarray(4);
    const decompressedData = pako.inflate(compressedData);
    return fromByteArray(decompressedData);
}



export function compress(base64String) {
    // const start1 = Date.now();
    const inputData = toByteArray(base64String);
    // const end1 = Date.now();

    // console.log(`toByteArray: ${end1 - start1} ms`);


    // const start2 = Date.now();

    const compressedData = gzipSync(inputData, {level: 6});
    // const end2 = Date.now();
    // console.log(`gzipSync: ${end2 - start2} ms`);

    
    const originalLength = inputData.length;

    // const start3 = Date.now();

    const gZipBuffer = new Uint8Array(4 + compressedData.length);
    // const end3 = Date.now();
    // console.log(`Uint8Array: ${end3 - start3} ms`);



    // const start4 = Date.now()
    const dataView = new DataView(gZipBuffer.buffer);
    // const end4 = Date.now();

    // console.log(`DataView: ${end4 - start4} ms`);


    // const start5 = Date.now();

    dataView.setUint32(0, originalLength, true);
    // const end5 = Date.now();

    // console.log(`setUint32: ${end5 - start5} ms`);


    // const start6 = Date.now();

    gZipBuffer.set(compressedData, 4);
    // const end6 = Date.now();

    // console.log(`setgZipBuffer: ${end6 - start6} ms`);


    return fromByteArray(gZipBuffer);
  }
    





export function testDecompress(base64String) {
    const results = {};

    // // Combination 1: Buffer + pako
    // const start1 = Date.now();
    // results['Buffer + pako'] = decompressUsingBufferAndPako(base64String);
    // const end1 = Date.now();
    // console.log(`Buffer + pako: ${end1 - start1} ms`);

    // // Combination 2: Buffer + fflate
    // const start2 = Date.now();
    // results['Buffer + fflate'] = decompressUsingBufferAndFflate(base64String);
    // const end2 = Date.now();
    // console.log(`Buffer + fflate: ${end2 - start2} ms`);

    // Combination 3: react-native-quick-base64 + pako
    const start3 = Date.now();
    results['react-native-quick-base64 + pako'] = decompressUsingQuickBase64AndPako(base64String);
    const end3 = Date.now();
    console.log(`react-native-quick-base64 + pako: ${end3 - start3} ms`);

    // Combination 4: react-native-quick-base64 + fflate
    const start4 = Date.now();
    results['react-native-quick-base64 + fflate'] = decompressUsingQuickBase64AndFflate(base64String);
    const end4 = Date.now();
    console.log(`react-native-quick-base64 + fflate: ${end4 - start4} ms`);

     // Combination 5: react-native-quick-base64 + pako Stream
     const start5 = Date.now();
     results['react-native-quick-base64 + pakostream'] = decompressUsingQuickBase64AndPakoStream(base64String);
     const end5 = Date.now();
     console.log(`react-native-quick-base64 + pakostream: ${end5 - start5} ms`);

    return results;
}

function decompressUsingBufferAndPako(base64String) {
    const compressedBuffer = Buffer.from(base64String, 'base64');
    const compressedData = compressedBuffer.subarray(4);
    const decompressedData = pako.inflate(compressedData);
    return Buffer.from(decompressedData).toString('base64');
}

function decompressUsingBufferAndFflate(base64String) {
    const compressedBuffer = Buffer.from(base64String, 'base64');
    const compressedData = compressedBuffer.subarray(4);
    const decompressedData = decompressSync(compressedData);
    return Buffer.from(decompressedData).toString('base64');
}

function decompressUsingQuickBase64AndPako(base64String) {
    const compressedBuffer = toByteArray(base64String);
    const compressedData = compressedBuffer.subarray(4);
    const decompressedData = pako.inflate(compressedData);
    return fromByteArray(decompressedData);
}

function decompressUsingQuickBase64AndFflate(base64String) {
    const compressedBuffer = toByteArray(base64String);
    const compressedData = compressedBuffer.subarray(4);
    const decompressedData = decompressSync(compressedData);
    return fromByteArray(decompressedData);
}

function decompressUsingQuickBase64AndPakoStream(base64String) {
    const compressedBuffer = toByteArray(base64String);
    const compressedData = compressedBuffer.subarray(4);
    const inflater = new pako.Inflate()
    inflater.push(compressedData, true);
    if (inflater.err) {
        throw new Error(`Decompression error: ${inflater.msg}`);
    }
    const decompressedData = inflater.result;
    return fromByteArray(decompressedData);
}




export function testCompression(base64String) {
    const results = {};
    console.log("STARTING TEST...")

    // Test 1: react-native-quick-base64 + pako
    const start1 = Date.now();
    results['react-native-quick-base64 + pako'] = compressUsingQuickBase64AndPako(base64String);
    const end1 = Date.now();
    console.log(`react-native-quick-base64 + pako: ${end1 - start1} ms`);
    
    // Test 2: react-native-quick-base64 + fflate
    const start2 = Date.now();
    results['react-native-quick-base64 + fflate'] = compressUsingQuickBase64AndFflate(base64String);
    const end2 = Date.now();
    console.log(`react-native-quick-base64 + fflate: ${end2 - start2} ms`);
    
    // Test 3: react-native-quick-base64 + pakoChunk
    const start3 = Date.now();
    results['react-native-quick-base64 + pako in Chunks'] = compressInChunksPako(base64String);
    const end3 = Date.now();
    console.log(`react-native-quick-base64 + pako in Chunks: ${end3 - start3} ms`);
    
    // Test 4: react-native-quick-base64 + fflateChunk
    const start4 = Date.now();
    results['react-native-quick-base64 + pako in Chunks'] = compressInChunksFflate(base64String);
    const end4 = Date.now();
    console.log(`react-native-quick-base64 + pako in Chunks: ${end4 - start4} ms`);
        
    return results;
}

function compressUsingQuickBase64AndPako(base64String) {
    // Decode Base64 string to Uint8Array
    const inputData = toByteArray(base64String);

    // Compress the Uint8Array using pako
    const compressedData = pako.deflate(inputData);

    // Create a buffer with the original length and compressed data
    const originalLength = inputData.length;
    const gZipBuffer = new Uint8Array(4 + compressedData.length);
    new DataView(gZipBuffer.buffer).setUint32(0, originalLength, true);
    gZipBuffer.set(compressedData, 4);

    // Encode the buffer to Base64
    return fromByteArray(gZipBuffer);
}

function compressUsingQuickBase64AndFflate(base64String) {
    // Decode Base64 string to Uint8Array
    const inputData = toByteArray(base64String);

    // Compress the Uint8Array using fflate
    const compressedData = compressSync(inputData);

    // Create a buffer with the original length and compressed data
    const originalLength = inputData.length;
    const gZipBuffer = new Uint8Array(4 + compressedData.length);
    new DataView(gZipBuffer.buffer).setUint32(0, originalLength, true);
    gZipBuffer.set(compressedData, 4);

    // Encode the buffer to Base64
    return fromByteArray(gZipBuffer);
}

function compressInChunksPako(base64String, chunkSize = 1024 * 1024) { // 1 MB chunks
    const inputData = toByteArray(base64String);
    const originalLength = inputData.length;

    const compressedChunks = [];
    for (let i = 0; i < inputData.length; i += chunkSize) {
        const chunk = inputData.slice(i, i + chunkSize);
        compressedChunks.push(pako.deflate(chunk));
    }

    const compressedData = Uint8Array.from(compressedChunks.flat());

    const gZipBuffer = new Uint8Array(4 + compressedData.length);
    new DataView(gZipBuffer.buffer).setUint32(0, originalLength, true);
    gZipBuffer.set(compressedData, 4);

    return fromByteArray(gZipBuffer);
}

function compressInChunksFflate(base64String, chunkSize = 1024 * 1024) { // 1 MB chunks
    const inputData = toByteArray(base64String);
    const originalLength = inputData.length;

    const compressedChunks = [];
    for (let i = 0; i < inputData.length; i += chunkSize) {
        const chunk = inputData.slice(i, i + chunkSize);
        compressedChunks.push(compressSync(chunk));
    }

    const compressedData = Uint8Array.from(compressedChunks.flat());

    const gZipBuffer = new Uint8Array(4 + compressedData.length);
    new DataView(gZipBuffer.buffer).setUint32(0, originalLength, true);
    gZipBuffer.set(compressedData, 4);

    return fromByteArray(gZipBuffer);
}