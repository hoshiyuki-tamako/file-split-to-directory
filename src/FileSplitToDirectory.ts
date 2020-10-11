import { filter } from 'async';
import fs from 'fs-extra';
import { chunk } from 'lodash';
import path from 'path';

export default class FileSplitToDirectory {
  public static defaultChunkSize = 4400;

  public async run(folder: string, chunkSize = FileSplitToDirectory.defaultChunkSize) {
    chunkSize ||= FileSplitToDirectory.defaultChunkSize;
    chunkSize = Math.abs(chunkSize);

    const filenames = await filter(await fs.readdir(folder), async (p) => {
      const stat = await fs.lstat(path.join(folder, p));
      return stat.isFile();
    });

    await Promise.all(chunk(filenames, chunkSize).map(async (paths, i) => {
      const targetFolder = path.join(folder, i.toString());
      await fs.mkdir(targetFolder);
      await Promise.all(paths.map(async (p) => {
        const originalFile = path.join(folder, p);
        const targetFile = path.join(targetFolder, path.basename(p));
        await fs.move(originalFile, targetFile);
      }));
    }));
  }
}
