# File Split To Directory

split files to folders

## Install

```bash
npm i -g file-split-to-directory
```

## Notes

It may take very long time from few `minutes` to few `hours` to process all files as moving files are slow.

Make sure there is enough memory as it will required to store all filenames / path names and queue all fs.move command at onces.

### Use For

Can be use for a work around for `irfanview thumbnail viewer` cannot load large amount of image issue

## Usage

### Command Line

```bash
file-split-to-directory .
```

```bash
file-split-to-directory "/mnt/d/download"
```

```bash
# each folder 4400 files (default is 4400)
file-split-to-directory "/mnt/d/download" --chunk 4400
file-split-to-directory "/mnt/d/download" -c 4400
```

```bash
# async may work faster over network
file-split-to-directory "/mnt/d/download" --async
```

```ps1
file-split-to-directory "D:/Download" -- -c 4400 --async
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
# npm start -- <directory> --chunk [chunk=4400] --async
npm start -- "D:/download"

# with custom size
npm start -- "D:/download" 1000
```

### Api

```ts
import { FileSplitToDirectory } from 'file-split-to-directory';

(async () => {
  const fileSplitToDirectory = new FileSplitToDirectory();
  try {
    await fileSplitToDirectory.run('D:/download', 4400);
  } catch (e) {
    // handle file system error
  }
})();
```

```ts
import { FileSplitToDirectory } from 'file-split-to-directory';

try {
  new FileSplitToDirectory().runSync('D:/download');
} catch (e) {
  // handle file system error
}
```
