import { pipe } from "fp-ts/lib/function";
import { TAvailableImageWidths } from "../domain/ImageSearchDomainTypes";

export const createSrcset = (widths: TAvailableImageWidths, publicPath: string): string => widths.reduce((str, w, i, a) => str + `${publicPath}/${w} ${w}w` + (i === a.length - 1 ? "" : ", "), "")

