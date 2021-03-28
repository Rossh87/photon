/** Borrowed/adapted from github users amabes & kroeder, see the gist here:
 * https://gist.github.com/amabes/88324d68690e0e7b8e313cd0cafaa219
 * */

// export interface MockFile {
// 	name: string;
// 	body: string | Buffer;
// 	mimeType: string;
// 	lastModified?: number;
// }

// export const createFileFromMockFile = (file: MockFile | File): File => {
// 	const blob = new Blob([file.body], { type: file.mimeType }) as any;
// 	blob['lastModifiedDate'] = file.lastModified
// 		? file.lastModified
// 		: Date.now();
// 	blob['name'] = file.name;
// 	return blob as File;
// };

export const createMockFileList = (...files: File[]): FileList => {
	const fileList: FileList = {
		length: files.length,
		item(index: number): File {
			return fileList[index];
		},
		*[Symbol.iterator]() {
			let ln = this.length;
			let position = 0;
			while (position < ln) {
				let val = this[position++];
				yield val;
			}
		},
	};
	files.forEach((file, index) => (fileList[index] = file));

	return fileList;
};
