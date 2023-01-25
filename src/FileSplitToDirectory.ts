import { filter } from 'async';
import clc from 'cli-color';
import fs from 'fs-extra';
import { chunk } from 'lodash';
import path from 'path';

export interface FileSplitToDirectoryOption {
  chunk: number;
  async: boolean;
  verbose: number;
}

export enum FileSplitToDirectoryExitCode {
  Success = 0,
  InvalidArgument = 422,
  Error = 500,
}

export enum FileSplitToDirectoryVerbose {
  None = 0,
  Error = 1,
}

export class FileSplitToDirectory {
  public static defaultOptions = {
    chunk: 4400,
    async: false,
    verbose: FileSplitToDirectoryVerbose.Error,
  } as FileSplitToDirectoryOption;

  public static async cli(directory: string, options = this.defaultOptions): Promise<void> {
    options.verbose = +options.verbose;
    options.chunk = +options.chunk;

    // validate
    if (!directory) {
      if (options.verbose) {
        console.error(clc.red(`directory cannot be empty: ${directory}`));
      }
      process.exitCode = FileSplitToDirectoryExitCode.InvalidArgument;
      return;
    }

    if (!Number.isFinite(options.chunk)) {
      if (options.verbose) {
        console.error(clc.red(`chunk invalid: ${options.chunk}`));
      }
      process.exitCode = FileSplitToDirectoryExitCode.InvalidArgument;
      return;
    }

    if (options.chunk <= 0) {
      if (options.verbose) {
        console.error(clc.red(`chunk cannot smaller or equal to 0: ${options.chunk}`));
      }
      process.exitCode = FileSplitToDirectoryExitCode.InvalidArgument;
      return;
    }

    // action
    try {
      const fileSplitToDirectory = new FileSplitToDirectory();
      if (options.async) {
        await fileSplitToDirectory.run(directory, options.chunk);
      } else {
        fileSplitToDirectory.runSync(directory, options.chunk);
      }
    } catch (e) {
      if (options.verbose) {
        console.error(clc.red((e as Error).message));
        console.error(clc.red((e as Error).stack));
      }
      process.exitCode = FileSplitToDirectoryExitCode.Error;
    }
  }

  compare = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
  directoryNameGenerator = (i: number) => i.toString();

  public runSync(directory: string, chunkSize = FileSplitToDirectory.defaultOptions.chunk) {
    const size = Math.abs(chunkSize);

    const filenames = fs.readdirSync(directory)
      .filter((p) => fs.lstatSync(path.join(directory, p)).isFile())
      .sort(this.compare);

    chunk(filenames, size).forEach((paths, i) => {
      const targetDirectory = path.join(directory, this.directoryNameGenerator(i));
      fs.mkdirSync(targetDirectory);
      paths.forEach((p) => {
        const originalFile = path.join(directory, p);
        const targetFile = path.join(targetDirectory, path.basename(p));
        fs.moveSync(originalFile, targetFile);
      });
    });
  }

  public async run(directory: string, chunkSize = FileSplitToDirectory.defaultOptions.chunk): Promise<void> {
    const size = Math.abs(chunkSize);

    const filenames = await filter(await fs.readdir(directory), async (p, callback) => {
      const stat = await fs.lstat(path.join(directory, p));
      callback(null, stat.isFile());
    });

    await Promise.all(chunk(filenames.sort(this.compare), size).map(async (paths, i) => {
      const targetDirectory = path.join(directory, this.directoryNameGenerator(i));
      await fs.mkdir(targetDirectory);
      await Promise.all(paths.map(async (p) => {
        const originalFile = path.join(directory, p);
        const targetFile = path.join(targetDirectory, path.basename(p));
        await fs.move(originalFile, targetFile);
      }));
    }));
  }
}
