import React from 'react';
import {
	IImage
} from '../domain/domainTypes';
import TextField from '@material-ui/core/TextField';
import {fromPredicate, map} from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/function'

interface IFileUpdateFormProps {
	handleFileUpdate: (
		previousName: string,
		updates: Partial<IImage>
	) => void;
	fileName: string;
	closeAccordion: () => void;
}

const FileUpdateForm: React.FunctionComponent<IFileUpdateFormProps> = ({
	handleFileUpdate,
	fileName,
	closeAccordion,
}) => {
	const [inputState, setInputState] = React.useState<string>('');
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setInputState(e.target.value);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		pipe(
			inputState,
			fromPredicate<string>((s) => s.length > 0),
			map(x => {
				handleFileUpdate(fileName, { displayName: inputState });
				return x;
			}),
			map(x => {
				setInputState('');
				return x
			})
		)
		
		closeAccordion();
	};

	return (
		<form onSubmit={onSubmit} noValidate autoComplete="off">
			<TextField
				id="outlined-basic"
				label="Update name"
				variant="outlined"
				onChange={onChange}
				value={inputState}
			/>
		</form>
	);
};

export default FileUpdateForm