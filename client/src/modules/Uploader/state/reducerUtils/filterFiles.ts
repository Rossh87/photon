import { filter } from 'fp-ts/Array';
import { flow } from 'fp-ts/lib/function';
import { TPreprocessingResult } from '../../domain/domainTypes';

export const makeImageNameFilter = (nameForRemoval: string) =>
    filter((file: TPreprocessingResult) => file.displayName !== nameForRemoval);

export const filterOneImageFile = (nameForRemoval: string) =>
    flow(makeImageNameFilter(nameForRemoval));
