import React, { useEffect, useState, Dispatch } from 'react';
import { Button, Snackbar, IconButton, useTheme } from '@material-ui/core';
import { getOrElse, Option, chain, map } from 'fp-ts/lib/Option';
import { BaseError } from '../../../core/error';
import { TDialogActions, TSnackbarStatus } from '../state/imageDialogState';
import { lookup } from 'fp-ts/lib/Record';
import { pipe, flow } from 'fp-ts/lib/function';
import { CloseOutlined } from '@material-ui/icons';

interface Props {
	status: TSnackbarStatus;
	error: Option<BaseError>;
	handleDiscard: () => void;
	handleSave: () => void;
	resetError: () => void;
	resetStatus: () => void;
	handleDeletion: () => void;
}
const Snacktion: React.FunctionComponent<Props> = ({
	status,
	error,
	handleDiscard,
	handleSave,
	resetError,
	resetStatus,
	handleDeletion,
}) => {
	const [open, setOpen] = useState(false);

	const theme = useTheme();

	useEffect(() => {
		let timerID: ReturnType<typeof setTimeout>;

		setOpen(status !== 'none');

		if (status === 'success') {
			timerID = setTimeout(() => resetStatus(), 2000);
		}

		return () => clearTimeout(timerID);
	}, [status]);

	const renderMessage = () => {
		return status === 'attemptedClose'
			? 'Are you sure you want to close without saving?'
			: status === 'error'
			? pipe(
					error,
					map((e) => e.message),
					getOrElse(() => 'Oops!  Something went wrong')
			  )
			: status === 'success'
			? 'Submission successful'
			: status === 'attemptedDelete'
			? 'Deletion is permanent, and cannot be undone.  Are you sure?'
			: '';
	};

	const renderAction = () => {
		if (status === 'attemptedClose') {
			return (
				<>
					<Button
						variant="text"
						style={{ color: 'white' }}
						onClick={handleDiscard}
					>
						Discard
					</Button>
					<Button
						variant="text"
						style={{ color: 'white' }}
						onClick={handleSave}
					>
						Keep
					</Button>
				</>
			);
		} else if (status === 'error') {
			return (
				<IconButton aria-label="close-snackbar" onClick={resetError}>
					<CloseOutlined />
				</IconButton>
			);
		} else if (status === 'attemptedDelete') {
			return (
				<>
					<Button
						variant="text"
						style={{ color: 'white' }}
						onClick={resetStatus}
					>
						Abort
					</Button>
					<Button
						variant="text"
						style={{ color: 'white' }}
						onClick={handleDeletion}
					>
						Delete
					</Button>
				</>
			);
		} else
			return (
				<IconButton onClick={() => setOpen(false)}>
					<CloseOutlined />
				</IconButton>
			);
	};

	const deriveColor = () =>
		status === 'attemptedDelete'
			? theme.palette.error.main
			: status === 'attemptedClose'
			? theme.palette.warning.main
			: status === 'error'
			? theme.palette.error.main
			: theme.palette.success.main;

	return (
		<Snackbar
			open={open}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			ContentProps={{
				style: {
					backgroundColor: deriveColor(),
				},
			}}
			message={renderMessage()}
			action={renderAction()}
		></Snackbar>
	);
};

export default Snacktion;
