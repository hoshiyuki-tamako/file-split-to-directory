import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import fs from 'fs-extra';

import { FileSplitToDirectory, FileSplitToDirectoryExitCode, FileSplitToDirectoryVerbose } from '../src';
import { CreateTmpFileBase } from './base/CreateTmpFileBase';

@suite()
export class FileSplitToDirectoryTest extends CreateTmpFileBase {
  @test()
  public async cli() {
    const chunk = FileSplitToDirectory.defaultOptions.chunk;

    FileSplitToDirectory.defaultOptions.chunk = this.chunk;
    await FileSplitToDirectory.cli(this.testDirectory);
    this.checkDirectorySuccess();

    FileSplitToDirectory.defaultOptions.chunk = chunk;
  }

  @test()
  public async cliDirectoryEmptyString() {
    const exitCode = process.exitCode;

    {
      const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: this.chunk, verbose: FileSplitToDirectoryVerbose.Error };
      await FileSplitToDirectory.cli('', options);
      this.checkDirectoryFail();
      expect(process.exitCode).equal(FileSplitToDirectoryExitCode.InvalidArgument);

      process.exitCode = exitCode;
    }

    {
      const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: this.chunk, verbose: FileSplitToDirectoryVerbose.None };
      await FileSplitToDirectory.cli('', options);
      this.checkDirectoryFail();
      expect(process.exitCode).equal(FileSplitToDirectoryExitCode.InvalidArgument);

      process.exitCode = exitCode;
    }
  }

  @test()
  public async cliDirectoryEmpty() {
    fs.emptyDirSync(this.testDirectory);
    const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: this.chunk, verbose: FileSplitToDirectoryVerbose.Error };
    await FileSplitToDirectory.cli(this.testDirectory, options);
    const files = fs.readdirSync(this.testDirectory);
    expect(files.length).eq(0);
  }


  @test()
  public async cliChunkInvalid() {
    const exitCode = process.exitCode;

    {
      const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: NaN, verbose: FileSplitToDirectoryVerbose.Error };
      await FileSplitToDirectory.cli(this.testDirectory, options);
      this.checkDirectoryFail();
      expect(process.exitCode).equal(FileSplitToDirectoryExitCode.InvalidArgument);

      process.exitCode = exitCode;
    }

    {
      const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: NaN, verbose: FileSplitToDirectoryVerbose.None };
      await FileSplitToDirectory.cli(this.testDirectory, options);
      this.checkDirectoryFail();
      expect(process.exitCode).equal(FileSplitToDirectoryExitCode.InvalidArgument);

      process.exitCode = exitCode;
    }
  }

  @test()
  public async cliChunkZero() {
    const exitCode = process.exitCode;

    {
      const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: 0, verbose: FileSplitToDirectoryVerbose.Error };
      await FileSplitToDirectory.cli(this.testDirectory, options);
      this.checkDirectoryFail();
      expect(process.exitCode).equal(FileSplitToDirectoryExitCode.InvalidArgument);

      process.exitCode = exitCode;
    }

    {
      const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: 0, verbose: FileSplitToDirectoryVerbose.None };
      await FileSplitToDirectory.cli(this.testDirectory, options);
      this.checkDirectoryFail();
      expect(process.exitCode).equal(FileSplitToDirectoryExitCode.InvalidArgument);

      process.exitCode = exitCode;
    }
  }

  @test()
  public async cliChunkLessThanOne() {
    const exitCode = process.exitCode;
    {
      const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: -1, verbose: FileSplitToDirectoryVerbose.Error };
      await FileSplitToDirectory.cli(this.testDirectory, options);
      this.checkDirectoryFail();
      expect(process.exitCode).equal(FileSplitToDirectoryExitCode.InvalidArgument);

      process.exitCode = exitCode;
    }

    {
      const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: -1, verbose: FileSplitToDirectoryVerbose.None };
      await FileSplitToDirectory.cli(this.testDirectory, options);
      this.checkDirectoryFail();
      expect(process.exitCode).equal(FileSplitToDirectoryExitCode.InvalidArgument);

      process.exitCode = exitCode;
    }
  }

  @test()
  public async cliDirectoryNotExists() {
    const exitCode = process.exitCode;

    {
      const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: this.chunk, verbose: FileSplitToDirectoryVerbose.Error };
      await FileSplitToDirectory.cli(`${this.testDirectory}1`, options);
      this.checkDirectoryFail();
      expect(process.exitCode).equal(FileSplitToDirectoryExitCode.Error);

      process.exitCode = exitCode;
    }

    {
      const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: this.chunk, verbose: FileSplitToDirectoryVerbose.None };
      await FileSplitToDirectory.cli(`${this.testDirectory}1`, options);
      this.checkDirectoryFail();
      expect(process.exitCode).equal(FileSplitToDirectoryExitCode.Error);

      process.exitCode = exitCode;
    }
  }

  @test()
  public async cliOutputDirectory() {
    const options = {... FileSplitToDirectory.defaultOptions, async: false, chunk: this.chunk, verbose: FileSplitToDirectoryVerbose.None, output: this.testOutputDirectory };
    await FileSplitToDirectory.cli(this.testDirectory, options);
    this.checkDirectorySuccess(undefined, this.testOutputDirectory);
  }

  @test()
  public async cliAsync() {
    const options = {... FileSplitToDirectory.defaultOptions, async: true, chunk: this.chunk, verbose: FileSplitToDirectoryVerbose.None };
    await FileSplitToDirectory.cli(this.testDirectory, options);
    this.checkDirectorySuccess();
  }

  @test()
  public async cliSync() {
    const options = {... FileSplitToDirectory.defaultOptions, async: false, chunk: this.chunk, verbose: FileSplitToDirectoryVerbose.None };
    await FileSplitToDirectory.cli(this.testDirectory, options);
    this.checkDirectorySuccess();
  }

  @test()
  public async run() {
    await new FileSplitToDirectory().run(this.testDirectory, this.chunk);
    this.checkDirectorySuccess();
  }

  @test()
  public async runDefault() {
    const chunk = FileSplitToDirectory.defaultOptions.chunk;

    FileSplitToDirectory.defaultOptions.chunk = this.chunk;
    await new FileSplitToDirectory().run(this.testDirectory);
    this.checkDirectorySuccess();

    FileSplitToDirectory.defaultOptions.chunk = chunk;
  }

  @test()
  public async runCustomCompare() {
    const chunk = FileSplitToDirectory.defaultOptions.chunk;

    FileSplitToDirectory.defaultOptions.chunk = this.chunk;
    const fstd = new FileSplitToDirectory();
    fstd.compare = () => 0;
    await fstd.run(this.testDirectory);
    this.checkDirectorySuccess(fstd.compare);

    FileSplitToDirectory.defaultOptions.chunk = chunk;
  }

  @test()
  public async runCustomDirectoryNameGenerator() {
    const chunk = FileSplitToDirectory.defaultOptions.chunk;

    FileSplitToDirectory.defaultOptions.chunk = this.chunk;
    const fstd = new FileSplitToDirectory();
    fstd.directoryNameGenerator = (i) => (i + 10).toString();
    await fstd.run(this.testDirectory, this.chunk, this.testOutputDirectory);
    this.checkDirectorySuccess(undefined, this.testOutputDirectory);
    const folders = fs.readdirSync(this.testOutputDirectory).sort(fstd.compare);
    for (const [i, folder] of Object.entries(folders)) {
      expect(folder).eq(fstd.directoryNameGenerator(+i));
    }

    FileSplitToDirectory.defaultOptions.chunk = chunk;
  }

  @test()
  public async runOutputDirectory() {
    const chunk = FileSplitToDirectory.defaultOptions.chunk;

    FileSplitToDirectory.defaultOptions.chunk = this.chunk;
    const fstd = new FileSplitToDirectory();
    await fstd.run(this.testDirectory, this.chunk, this.testOutputDirectory);
    this.checkDirectorySuccess(undefined, this.testOutputDirectory);

    FileSplitToDirectory.defaultOptions.chunk = chunk;
  }

  @test()
  public runSync() {
    new FileSplitToDirectory().runSync(this.testDirectory, this.chunk);
    this.checkDirectorySuccess();
  }

  @test()
  public runSyncDefault() {
    const chunk = FileSplitToDirectory.defaultOptions.chunk;

    FileSplitToDirectory.defaultOptions.chunk = this.chunk;
    new FileSplitToDirectory().runSync(this.testDirectory);
    this.checkDirectorySuccess();

    FileSplitToDirectory.defaultOptions.chunk = chunk;
  }

  @test()
  public runSyncCustomCompare() {
    const chunk = FileSplitToDirectory.defaultOptions.chunk;

    FileSplitToDirectory.defaultOptions.chunk = this.chunk;
    const fstd = new FileSplitToDirectory();
    fstd.compare = () => 0;
    fstd.runSync(this.testDirectory);
    this.checkDirectorySuccess(fstd.compare);

    FileSplitToDirectory.defaultOptions.chunk = chunk;
  }

  @test()
  public runSyncCustomDirectoryNameGenerator() {
    const chunk = FileSplitToDirectory.defaultOptions.chunk;

    FileSplitToDirectory.defaultOptions.chunk = this.chunk;
    const fstd = new FileSplitToDirectory();
    fstd.directoryNameGenerator = (i) => (i + 10).toString();
    fstd.runSync(this.testDirectory, this.chunk, this.testOutputDirectory);
    this.checkDirectorySuccess(undefined, this.testOutputDirectory);
    const folders = fs.readdirSync(this.testOutputDirectory).sort(fstd.compare);
    for (const [i, folder] of Object.entries(folders)) {
      expect(folder).eq(fstd.directoryNameGenerator(+i));
    }

    FileSplitToDirectory.defaultOptions.chunk = chunk;
  }

  @test()
  public runSyncOutputDirectory() {
    const chunk = FileSplitToDirectory.defaultOptions.chunk;

    FileSplitToDirectory.defaultOptions.chunk = this.chunk;
    const fstd = new FileSplitToDirectory();
    fstd.runSync(this.testDirectory, this.chunk, this.testOutputDirectory);
    this.checkDirectorySuccess(undefined, this.testOutputDirectory);

    FileSplitToDirectory.defaultOptions.chunk = chunk;
  }

}
