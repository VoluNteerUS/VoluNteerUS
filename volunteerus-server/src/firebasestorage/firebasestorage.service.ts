
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class FirebasestorageService {
    private readonly storage: admin.storage.Storage;

    constructor() {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId : process.env.PROJECT_ID,
                    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
                    clientEmail: process.env.CLIENT_EMAIL,
                }),
                storageBucket: process.env.BUCKET_URL
            });

            // Get a reference to the storage service, which is used to create references in your storage bucket
            this.storage = admin.storage();
        }
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

    // async deleteFile(filename: string, folder: string) {
    //     const bucket = this.storage.bucket();
    //     const file = bucket.file(`${folder}/${filename}`);
    //     await file.delete();
    // }
}