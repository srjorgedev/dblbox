import path from 'path';
import fs from 'fs';

export class AssetsRepo {
    private readonly assetsPath = path.join(process.cwd(), 'data', 'assets');

    async findImagePath(fileName: string): Promise<string | null> {
        const fullPath = path.join(this.assetsPath, fileName);
        return fs.existsSync(fullPath) ? fullPath : null;
    }
}