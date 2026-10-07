import { Module } from '@nestjs/common';
import Minio from 'minio';

@Module({})
export class MinioModule {
  static client = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT.replace('http://', ''),
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
  });

  provideMinioClient() {
    return MinioModule.client;
  }
}