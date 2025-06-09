import { BlobServiceClient } from '@azure/storage-blob';

const connstr = 'DefaultEndpointsProtocol=https;AccountName=tictactoetijn;AccountKey=0Ajphn5YeLJvRpQ0jNdgWqHqPBOnrjIIInQuc84Li459kVoybmyzQ0kW1y4LzTnfJHaYnJHkUii2+AStAxrmfQ==;EndpointSuffix=core.windows.net';
const containerName = 'game';
const blobServiceClient = BlobServiceClient.fromConnectionString(connstr);
const containerClient = blobServiceClient.getContainerClient(containerName);
const blobName = 'tictactoe.json';
const blobClient = containerClient.getBlobClient(blobName);

export async function getAllBlobs() {
  try {
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(blob);
    }
    return blobs;
  } catch (error) {
    throw new Error('Error listing blobs:', error.message);
  }
}

export async function setJsonBlob(newData) {
  const blobClient = containerClient.getBlockBlobClient(blobName);
  const content = JSON.stringify(newData, null, 2);
  const options = { blobHTTPHeaders: { blobContentType: "application/json" } };

  await blobClient.upload(content, Buffer.byteLength(content), options);
}

export async function getJsonBlob() {
  // Download blob content
  const downloadBlockBlobResponse = await blobClient.download();
  const downloaded = await streamToString(downloadBlockBlobResponse.readableStreamBody);

  // Parse the string as JSON
  const json = JSON.parse(downloaded);
  return json;
}

// Helper to convert stream to string
async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => {
      chunks.push(data.toString());
    });
    readableStream.on('end', () => {
      resolve(chunks.join(''));
    });
    readableStream.on('error', reject);
  });
}
