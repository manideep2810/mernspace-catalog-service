export interface FileData {
    filename: string;
    fileData: ArrayBuffer;
}

export interface FileStorage {
    upload(file: FileData): Promise<void>;
    delete(filename: string): void;
    getObjectURI(filename: string): string;
}
