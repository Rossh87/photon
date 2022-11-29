import React, { Dispatch, forwardRef } from 'react';
import { TUploaderActions } from '../state/uploadStateTypes';
import TextField from '@mui/material/TextField';
import { fromPredicate, map } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { TPreprocessingResult } from '../domain/domainTypes';
import { useAppActions } from '../../appState/useAppState';

interface IFileUpdateFormProps {
	dispatch: Dispatch<TUploaderActions>;
	closeAccordion: () => void;
	imageFile: TPreprocessingResult;
}

const FileUpdateForm = forwardRef<any, IFileUpdateFormProps>(
	({ closeAccordion, imageFile }, ref) => {
		const [inputState, setInputState] = React.useState<string>('');

		const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
			setInputState(e.target.value);

		const actions = useAppActions();

		const setNewDisplayName = () =>
			actions.INIT_NAME_UPDATE([imageFile, inputState]);

		const resetFileNameInput = () => setInputState('');

		const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			pipe(
				inputState,
				fromPredicate<string>((s) => s.length > 0),
				map(setNewDisplayName),
				map(resetFileNameInput),
				map(closeAccordion)
			);
		};

		return (
			<form onSubmit={onSubmit} noValidate autoComplete="off">
				<TextField
					size="small"
					id="outlined-basic"
					label="Update name"
					variant="outlined"
					onChange={onChange}
					value={inputState}
					ref={ref}
				/>
			</form>
		);
	}
);

export default FileUpdateForm;
