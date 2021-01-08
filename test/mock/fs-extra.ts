export function readdir(directory: string): Promise<string[]> {
  console.log(directory);
  return Promise.resolve([]);
}

export type ReturnLstat = {
  isFile: () => boolean;
}

export function lstat(directory: string): Promise<ReturnLstat> {
  console.log(directory);
  return Promise.resolve({
    isFile() {
      return true;
    },
  });
}

export function mkdir(directory: string): Promise<void> {
  console.log(directory);
  return Promise.resolve();
}

export function move(directory: string): Promise<void> {
  console.log(directory);
  return Promise.resolve();
}

