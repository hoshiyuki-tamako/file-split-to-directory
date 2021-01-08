#!/usr/bin/env node
import commander from 'commander';

import { FileSplitToDirectory } from '.';
import pkg from '../package.json';

commander
  .version(pkg.version)
  .description(pkg.description)
  .command(`${Object.keys(pkg.bin)[0]} [directory] [count]`)
  .action(FileSplitToDirectory.cli)
  .parse(process.argv);
