import React, { Dispatch } from 'react';
import {
	TUploaderActions,
	TSelectedFilesState,
} from '../state/uploadStateTypes';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import { pipe } from 'fp-ts/lib/function';
import { map, fromNullable, Applicative, fold } from 'fp-ts/lib/Option';
import { sequenceT } from 'fp-ts/lib/Apply';
import { makeStyles } from '@material-ui/styles';
import theme from '../../theme';
import { TUserState } from '../../Auth/state/authStateTypes';
import { useAppActions } from '../../appState/useAppState';

const useStyles = makeStyles({
	fileForm: {
		display: 'flex',
		justifyContent: 'flex-end',
		margin: theme.spacing(2),
	},

	hiddenInput: {
		opacity: '0',
		width: '0.1px',
		height: '0.1px',
		position: 'absolute',
	},

	button: {
		margin: theme.spacing(0, 1),
		textTransform: 'uppercase',
		fontWeight: theme.typography.fontWeightBold,
	},

	submitButton: {},
});

interface IProps {
	dispatch: Dispatch<TUploaderActions>;
	acceptedExtensions: Array<string>;
	submitIsDisabled: boolean;
	user: TUserState;
	selectedFiles: TSelectedFilesState;
}

const UploadForm: React.FunctionComponent<IProps> = ({
	user,
	acceptedExtensions,
	submitIsDisabled,
	selectedFiles,
}) => {
	const classes = useStyles();

	const actions = useAppActions();

	// does nothing if ownerID or FileList is nullable
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const reset = () => {
			e.target.files = null;
			e.target.value = '';
		};
		pipe(
			sequenceT(Applicative)(
				fromNullable(e.target.files),
				fromNullable(user)
			),
			map(actions.FILES_CHANGED),

			// We reset the native file input after every change, whether
			// it passes pre-processing or not.
			// This keeps the native file input from getting out-of-sync
			// with application state--we don't ever want files from previous
			// change events to end up in the pre-processing flow a second time.
			fold(reset, reset)
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		actions.PROCESS_FILES(selectedFiles);
	};

	return (
		<form onSubmit={handleSubmit} className={classes.fileForm}>
			<label htmlFor="file-selection-input" id="file-slection-input">
				<input
					className={classes.hiddenInput}
					accept={acceptedExtensions.join(',')}
					id="file-selection-input"
					multiple
					type="file"
					onChange={handleFileChange}
					aria-labelledby="file-selection-input"
					aria-label="select files"
				/>
				<Button
					className={classes.button}
					size="large"
					variant="text"
					color="primary"
					component="span"
				>
					select files
				</Button>
			</label>
			<Button
				className={clsx(classes.button, classes.submitButton)}
				size="large"
				variant="text"
				disabled={submitIsDisabled}
				type="submit"
				color="secondary"
			>
				SUBMIT
			</Button>
		</form>
	);
};

export default UploadForm;
