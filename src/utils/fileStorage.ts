import fs from 'fs';
import path from 'path';
import { app } from 'electron';

class LocalFileStorage {
  private basePath: string;

  constructor() {
    this.basePath = path.join(app.getPath('userData'), 'case-files');
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  async saveFile(file: Buffer, filename: string): Promise<string> {
    const filePath = path.join(this.basePath, filename);
    await fs.promises.writeFile(filePath, file);
    return filePath;
  }

  async getFile(filename: string): Promise<Buffer> {
    const filePath = path.join(this.basePath, filename);
    return fs.promises.readFile(filePath);
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.basePath, filename);
    await fs.promises.unlink(filePath);
  }

  getFilePath(filename: string): string {
    return path.join(this.basePath, filename);
  }
}

export const localFileStorage = new LocalFileStorage();