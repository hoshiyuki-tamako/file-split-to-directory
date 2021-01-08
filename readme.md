# File Split To Directory

split files to folders

## Install

```bash
npm i -g file-split-to-directory
```

or

```bash
npm i file-split-to-directory
```

## Notes

It may take very long time from few `minutes` to few `hours` to process all files as moving files are slow.

Make sure there is enough memory as it will required to store all filenames / path names and queue all fs.move command at onces.

### Use For

Can be use for a work around for `irfanview thumbnail viewer` cannot load large amount of image issue

## Usage

### Command Line

```bash
file-split-to-directory
```

```bash
file-split-to-directory "/mnt/d/download"
```

```bash
# each folder 1000 files
file-split-to-directory "/mnt/d/download" 1000
```

```ps
file-split-to-directory "D:/download"
```

```ps
file-split-to-directory "D:/download" 1000
```

### Result

from

```text
- Download
-- 1.png
-- 2.png
-- 3.png
-- ....
-- 4401.png
-- ....
-- 8801.png
```

to

```text
- Download
|- 1
||- 1.png
||- 2.png
||- 3.png
||- ...
|- 2
||- 4401.png
||- ...
|- 3
||- 8801.png
```

### Run Directly

```bash
# npm start <directory> [size=4400]
npm start "D:/download"

# with custom size
npm start "D:/download" 1000
```

### Api

```ts
import { FileSplitToDirectory } from 'file-split-to-directory';

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
```
