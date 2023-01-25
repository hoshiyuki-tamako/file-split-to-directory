import { expect } from 'chai';
import fs from 'fs-extra';
import { isEqual } from 'lodash';
import os from 'os';
import path from 'path';
import sinon from 'sinon';
import { v4 } from 'uuid';

function randomId() {
  return Math.random().toString(36).slice(2).toLocaleUpperCase();
}

export abstract class CreateTmpFileBase {
  protected chunk = 16;
  protected fileCount = 200;
  protected testDirectory = path.join(os.tmpdir(), `FileSplitToDirectoryTest-${v4()}${+new Date()}`);
  protected testOutputDirectory = path.join(os.tmpdir(), `FileSplitToDirectoryTestOutput-${v4()}${+new Date()}`);
  protected testOutputDirectoryRecursive = path.join(os.tmpdir(), `FileSplitToDirectoryTestOutput-${randomId}/${randomId}/${randomId}`);
  protected sandbox = sinon.createSandbox();

  public before() {
    fs.ensureDirSync(this.testDirectory, 0o777);

    let i = this.fileCount;
    while (i-- > 0) {
      const filename = `${i}.tmp`;
      const filePath = path.join(this.testDirectory, filename);
      fs.closeSync(fs.openSync(filePath, 'w'));
    }

    // sandbox
    this.sandbox.replace(console, "log", function (message) {
      expect(!!message).to.be.true;
    });

    this.sandbox.replace(console, "error", function (message) {
      expect(!!message).to.be.true;
    });
  }

  public after() {
    fs.rmSync(this.testDirectory, { recursive: true, force: true });
    fs.rmSync(this.testOutputDirectory, { recursive: true, force: true });
    sinon.restore();
  }

  protected checkDirectoryFail() {
    const files = fs.readdirSync(this.testDirectory);
    expect(files.length).eq(Math.ceil(this.fileCount));

    for (const f of files) {
      const filePath = path.join(this.testDirectory, f);
      const folderLstat = fs.lstatSync(filePath);
      expect(folderLstat.isFile()).to.be.true;
    }
  }

  protected checkDirectorySuccess(compare?: (x: string, y: string) => number, outputDirectory?: string) {
    const directoryCompare = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
    compare ??= directoryCompare;
    outputDirectory ||= this.testDirectory;

    const folders = fs.readdirSync(outputDirectory).sort(directoryCompare);
    expect(folders.length).eq(Math.ceil(this.fileCount / this.chunk));

    const fileNameInOrder = [] as string[];

    for (const folder of folders) {
      const folderPath = path.join(outputDirectory, folder);
      const folderLstat = fs.lstatSync(folderPath);
      expect(folderLstat.isDirectory()).to.be.true;

      const files = fs.readdirSync(folderPath).sort(compare);
      expect(files.length).lessThanOrEqual(this.fileCount);
      expect(files.length).greaterThanOrEqual(1);

      for (const f of files) {
        fileNameInOrder.push(f);
        const filePath = path.join(folderPath, f);
        const fileLstat = fs.lstatSync(filePath);
        expect(fileLstat.isFile()).to.be.true;
      }
    }

    expect(isEqual(fileNameInOrder, [...fileNameInOrder].sort(compare))).to.be.true;
  }
}
