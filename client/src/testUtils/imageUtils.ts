import fs from 'fs';
import path from 'path';
import { pipe } from 'fp-ts/lib/function';

type TTestFileSizeParam = 'small' | 'med' | 'large' | 'original';

export const getOversizeImageBuf = () =>
	fs.readFileSync(path.join(__dirname, 'testImages', 'oversize_image.jpg'));

export const getTestPNGBuf = () =>
	fs.readFileSync(path.join(__dirname, 'testImages', 'test_png.png'));

export const getTestJPGBuf = (sizeParam: TTestFileSizeParam) =>
	fs.readFileSync(
		path.join(__dirname, 'testImages', `test_img_${sizeParam}.jpg`)
	);

export const nodeBufferToFile = (fileName: string) => (fileType: string) => (
	buf: Buffer
) =>
	pipe(
		buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
		Array.of,
		(arrayBuff) =>
			new File(arrayBuff, fileName, {
				type: fileType,
			})
	);

export const getTestPNGFile = (fileName: string) =>
	pipe(getTestPNGBuf(), nodeBufferToFile(fileName)('image/png'));

export const getTestJPEGFile = (
	fileName: string,
	sizeParam: TTestFileSizeParam
) => pipe(getTestJPGBuf(sizeParam), nodeBufferToFile(fileName)('image/jpg'));

export const getOversizeImageFile = (fileName: string) =>
	pipe(getOversizeImageBuf(), nodeBufferToFile(fileName)('image/jpg'));
