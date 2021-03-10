import { IPreprocessedFile } from '../uploadTypes';
import {getResizedImages} from './getResizedImages';
import {Task, map, chain, of} from 'fp-ts/lib/Task'

export const uploadOneImage = (f: IPreprocessedFile) => {
	// 1. generate the resized images--may need to convert to blob here b/c we can do quality downgrade first, then calculate size from blob
	// to send accurate metadata to Google
	// 2. map the resizes into objects with ownerID(fromParent), mediaType(fromParent), sizeInBytes, integrityHash, primaryColor
	// 3. make parallel requests for upload URIs--abort if ANY fail
	// 4. init the file uploads
	const resized = getResizedImages(f);


}

const genDataForURIRequest = (f: IPreprocessedFile) => (canvas: HTMLCanvasElement) => Object.assign({}, {
	mediaType: f.type,
	sizeInBytes: canvas.
})