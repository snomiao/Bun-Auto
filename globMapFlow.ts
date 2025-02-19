import fs from "fs/promises";
import pMap from "p-map";
import { filter } from "rambda";
import { globflow } from "./globflow";
import { nil } from "./nil";
if (import.meta.main) {
  globTextMapFlow("./**/package.json").log().done();
}
/** get flow of Map<filepath, filecontent> */
export function globTextMapFlow(
  pattern: string,
  {
    watch = true,
    polling = 0,
    cwd = process.cwd(),
    filter: _filter = (filename: string): boolean => true,
    signal = new AbortController().signal,
  } = {}
) {
  // console.log("gtmf");
  return globflow(pattern, { watch, signal, cwd, polling })
    .map(filter(_filter))
    .reduce(async (s, list) => {
      await pMap(list, async (f) => {
        const val = await fs.readFile(f, "utf8").catch(nil);
        null == val || s.set(f, val);
        null == val && s.delete(f);
      });
      return s;
    }, new Map<string, string>());
}
