#!/usr/bin/env bun

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import bunAuto from ".";
import pkg from "./package.json";

await yargs(hideBin(process.argv))
  .scriptName(pkg.name)
  .usage("$0 <cmd> [args]")
  .command(
    ["*", "auto"],
    "bun auto manage dependencies",
    (y) =>
      y
        .alias("w", "watch")
        .boolean("watch")
        .default("watch", true, "watch mode")
        .alias("d", "dryRun")
        .boolean("dryRun")
        .default("dryRun", false, "dry run mode")
        .alias("r", "remove")
        .boolean("remove")
        .default("remove", true, "auto remove unused dependencies")
        .alias("i", "install")
        .boolean("install")
        .default("install", true, "auto install dependencies"),
    async (argv) => await bunAuto(argv)
  )
  .command(
    ["remove", "r"],
    "Remove all unused dependencies",
    (y) =>
      y
        .alias("w", "watch")
        .boolean("watch")
        .default("watch", true, "watch mode")
        .alias("d", "dryRun")
        .boolean("dryRun")
        .default("dryRun", false, "dry run mode"),
    async (argv) => await bunAuto(argv)
  )
  .command(
    ["install", "i"],
    "Install all missing dependencies",
    (y) =>
      y
        .alias("w", "watch")
        .boolean("watch")
        .default("watch", true, "watch mode")
        .alias("d", "dryRun")
        .boolean("dryRun")
        .default("dryRun", false, "dry run mode"),
    async (argv) => await bunAuto({ ...argv, install: true, remove: false })
  )
  .version(pkg.version)
  .alias("w", "watch")
  .alias("v", "version")
  .alias("h", "help")
  .strict()
  .help()
  .parse();
