import FileSplitToDirectory from './FileSplitToDirectory';

class Main {
  public static async main() {
    const [,,folder, chunkSize] = process.argv;
    if (!folder) {
      throw new Error('Missing folder argument: npm start YOUR_FOLDER_REAL_PATH');
    }
    console.log('it may take very long time from few minutes to few hours to process depends on how many files');
    await new FileSplitToDirectory().run(folder, +chunkSize);
  }
}

Main.main().catch(console.error);
