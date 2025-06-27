import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import debug from "debug";

debug.enable("cli:*");

yargs(hideBin(process.argv))
  .commandDir("commands", {
    extensions: ["ts"],
  })
  .demandCommand(1, "You need to specify a command")
  .strict()
  .help().argv;
