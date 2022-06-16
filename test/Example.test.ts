import { suite, test } from '@testdeck/mocha';

import { FileSplitToDirectory } from '../src';
import { CreateTmpFileBase } from './base/CreateTmpFileBase';

@suite()
export class FileSplitToDirectoryTest extends CreateTmpFileBase {


  @test()
  public async ApiExampleAsync() {
    (async () => {
      const fileSplitToDirectory = new FileSplitToDirectory();
      try {
        await fileSplitToDirectory.run(this.testDirectory, 4400);
      } catch (e) {
        // handle file system error
      }
    })();
  }

  @test()
  public async ApiExampleSync() {
    try {
      new FileSplitToDirectory().runSync(this.testDirectory);
    } catch (e) {
      // handle file system error
    }
  }
}
