import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
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
        return await this.client.send(new PutObjectCommand(objectParams));
    }
    async delete(filename: string): Promise<void> {
        const objectParams = {
            Bucket: config.get("s3.Bucket"),
            Key: filename,
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.client.send(new DeleteObjectCommand(objectParams));
    }

    getObjectURI(filename: string): string {
        const bucket = config.get("s3.Bucket");
        const region = config.get("s3.Region");
        if (typeof bucket === "string" && typeof region === "string") {
            return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
        }
        throw new Error("Invalid S3 Configuration");
    }
}
