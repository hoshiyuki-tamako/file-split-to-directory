import { FileSplitToDirectory } from '../src';

(async () => {
  // command line
  await FileSplitToDirectory.cli('D:/download');

  const fileSplitToDirectory = new FileSplitToDirectory();
  try {
    // same as await fileSplitToDirectory.run('D:/download', FileSplitToDirectory.defaultChunkSize);
    await fileSplitToDirectory.run('D:/download');
  } catch (e) {
    // handle file system error
  }
})();
