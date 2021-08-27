import { ICombinedUploadRequestMetadata } from "../sharedUploadTypes";
import { IAsyncDeps } from "../../../core/asyncDeps";
import { getCollection, tryUpdateOne } from "../../../core/repo";
import { pipe } from "fp-ts/lib/function";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import {
  IBreakpointTransferObject,
  IDBUpload,
} from "../../../../sharedTypes/Upload";
import { ObjectId } from "mongodb";

export const updateBreakpoints =
  (updates: IBreakpointTransferObject) => (deps: IAsyncDeps) =>
    pipe(
      deps.repoClient,
      getCollection<IDBUpload>("uploads"),
      tryUpdateOne<IDBUpload>({
        //   @ts-ignore
        _id: new ObjectId(updates.imageID),
      })({ $set: { breakpoints: updates.breakpoints } })
    );
