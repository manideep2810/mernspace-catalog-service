import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FileData, FileStorage } from "../types/storage";
import config from "config";

export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: config.get("s3.Region"),
            credentials: {
                accessKeyId: config.get("s3.AccessKeyId"),
                secretAccessKey: config.get("s3.SecretAccessKey"),
            },
        });
    }

    async upload(file: FileData): Promise<void> {
        const objectParams = {
            Bucket: config.get("s3.Bucket"),
            Key: file.filename,
            Body: file.fileData,
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await this.client.send(new PutObjectCommand(objectParams));
    }
    delete(): void {
        throw new Error("Method not implemented.");
    }
    getObjectURI(): string {
        throw new Error("Method not implemented.");
    }
}
