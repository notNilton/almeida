export interface StorageProvider {
  upload(file: Express.Multer.File): Promise<string>;
  delete(filename: string): Promise<void>;
  getUrl(filename: string): string;
}
