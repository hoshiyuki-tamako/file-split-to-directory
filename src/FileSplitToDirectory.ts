import { filter } from 'async';
import chalk from 'chalk';
import fs from 'fs-extra';
import { chunk } from 'lodash';
import path from 'path';

export class FileSplitToDirectory {
  public static defaultChunkSize = 4400;

  public static async cli(directory?: string, count?: number): Promise<void> {
    try {
      await new FileSplitToDirectory().run(directory || '.', Number(count));
      console.log(chalk.green('Completed'));
    } catch(e) {
      console.error(chalk.red(e.stack));
      process.exitCode = 1;
    }
  }

  public async run(directory: string, chunkSize?: number | null): Promise<void> {
    const size = Math.abs(chunkSize || FileSplitToDirectory.defaultChunkSize);
    console.log(fs);

    const filenames = await filter(await fs.readdir(directory), async (p) => {
      const stat = await fs.lstat(path.join(directory, p));
      return stat.isFile();
    });

    await Promise.all(chunk(filenames, size).map(async (paths, i) => {
      const targetDirectory = path.join(directory, i.toString());
      await fs.mkdir(targetDirectory);
      await Promise.all(paths.map(async (p) => {
        const originalFile = path.join(directory, p);
        const targetFile = path.join(targetDirectory, path.basename(p));
        await fs.move(originalFile, targetFile);
      }));
    }));
  }
}
