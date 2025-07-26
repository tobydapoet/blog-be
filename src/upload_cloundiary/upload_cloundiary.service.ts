import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { error } from 'node:console';
import { resolve } from 'node:path';
import { Readable } from 'node:stream';

@Injectable()
export class UploadCloundiaryService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUNDIARY_KEY_NAME,
      api_key: process.env.CLOUNDIARY_API_KEY,
      api_secret: process.env.CLOUNDIARY_API_SECRET,
    });
  }

  async uploadImage(
    fileBuffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('No result returned from Cloudinary'));
          resolve(result);
        },
      );

      Readable.from(fileBuffer).pipe(uploadStream);
    });
  }
}
