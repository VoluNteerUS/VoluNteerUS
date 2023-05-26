
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebasestorageService {
    private readonly storage: admin.storage.Storage;

    constructor() {
        // Service account credentials
        const serviceAccount = require(path.resolve('./credentials/firebase_credentials.json'));

        // Initialize Firebase
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "volunteerus-3a56d.appspot.com"
        });

        // Get a reference to the storage service, which is used to create references in your storage bucket
        this.storage = admin.storage();
    }

    async uploadFile(file: Express.Multer.File, folder: string) : Promise<string> {
        const bucket = this.storage.bucket();

        const { originalname, buffer } = file;
        const blob = bucket.file(`${folder}/${originalname.replace(/ /g, "_")}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
                reject(err);
            });

            blobStream.on('finish', () => {     
                blob.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((url) => {
                    return resolve(url[0]);
                }).catch((err) => {
                    reject(err);
                });
            });

            blobStream.end(buffer);
        });  
    }
}