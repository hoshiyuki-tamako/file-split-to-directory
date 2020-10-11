# File Split To Directory

work around for irfanview thumbnail cannot load large amount of image issue

## Notes

it may take very long time from few `minutes` to few `hours` to process all files as moving files is slow.

## Required

NodeJs >= 14

```bash
npm i
```

## Run

```bash
# npm start <directory> [size=4500]
npm start "D:/download"

# with custom size
npm start "D:/download" 1000
```
