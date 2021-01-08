import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

import { FileSplitToDirectory as _FileSplitToDirectory } from '../src';
import * as fs from './mock/fs-extra';

const { FileSplitToDirectory } = proxyquire('../src/FileSplitToDirectory', {
  'fs-extra': fs,
}) as {
  FileSplitToDirectory: {
    defaultChunkSize: number,
    cli(directory?: string, count?: number): Promise<void>,
    new (): _FileSplitToDirectory,
  },
};

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class FileSplitToDirectoryTest {
  @test()
  public async run() {
    const fileSplitToDirectory = new FileSplitToDirectory();
    expect(fileSplitToDirectory).property('run');
  }

  @test()
  public async cli() {
    expect(FileSplitToDirectory).property('cli');
  }
}
