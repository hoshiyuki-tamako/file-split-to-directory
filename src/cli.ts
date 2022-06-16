#!/usr/bin/env node
import { Command } from 'commander';

import { FileSplitToDirectory } from '.';
import pkg from '../package.json';

new Command()
  .name(pkg.name)
  .version(pkg.version)
  .description(pkg.description)
  .argument('<directory>', 'Directory of those files that will be split')
  .option('-c, --chunk <chunk>', 'How many files pre directory; default 4400', '4400')
  .option('-a, --async', 'Run file operation async, maybe faster moving files over network')
  .option('-v, --verbose', '0 = no output. 1 (default) = error only', '1')
  .action(FileSplitToDirectory.cli)
  .addHelpText('after', `Example:
  $ file-split-to-directory "/mnt/d/download" --chunk 4400 --async`)
  .parse();
