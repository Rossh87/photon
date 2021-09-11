// import React, { useEffect, useState, Dispatch } from 'react';
// import {
// 	Button,
// 	Snackbar,
// 	IconButton,
// 	useTheme,
// 	makeStyles,
// } from '@material-ui/core';
// import { Alert } from '@material-ui/lab';
// import { getOrElse, Option, chain, map } from 'fp-ts/lib/Option';
// import { BaseError } from '../../../core/error';
// import { pipe, flow } from 'fp-ts/lib/function';
// import { CloseOutlined } from '@material-ui/icons';
// import { TSnackbarStatus } from '../state/imageConfigurationStateTypes';

// const useStyles = makeStyles((theme) => ({
// 	errMessage: {
// 		backgroundColor: theme.palette.error.main,
// 	},

// 	warningMessage: {
// 		backgroundColor: theme.palette.warning.main,
// 	},

// 	successMessage: {
// 		backgroundColor: theme.palette.success.main,
// 	},
// }));

// interface Props {
// 	status: TSnackbarStatus;
// 	error: Option<BaseError>;
// 	handleDiscard: () => void;
// 	handleSave: () => void;
// 	resetError: () => void;
// 	resetStatus: () => void;
// 	handleDeletion: () => void;
// }
// const Snacktion: React.FunctionComponent<Props> = ({
// 	status,
// 	error,
// 	handleDiscard,
// 	handleSave,
// 	resetError,
// 	resetStatus,
// 	handleDeletion,
// }) => {
// 	const classes = useStyles();
// 	useEffect(() => {
// 		let timerID: ReturnType<typeof setTimeout>;

// 		if (status === 'success') {
// 			timerID = setTimeout(() => resetStatus(), 2000);
// 		}

// 		return () => clearTimeout(timerID);
// 	}, [status]);

// 	type SevMap = { [K in TSnackbarStatus]: string };

// 	const statusToSeverityMap: SevMap = {
// 		attemptedClose: 'warning',
// 		error: 'error',
// 		success: 'success',
// 		attemptedDelete: 'error',
// 		none: 'info',
// 	};
// 	const renderMessage = () => {
// 		return status === 'attemptedClose'
// 			? 'Are you sure you want to close without saving?'
// 			: status === 'error'
// 			? pipe(
// 					error,
// 					map((e) => e.message),
// 					getOrElse(() => 'Oops!  Something went wrong')
// 			  )
// 			: status === 'success'
// 			? 'Submission successful'
// 			: status === 'attemptedDelete'
// 			? 'Deletion is permanent, and cannot be undone.  Are you sure?'
// 			: '';
// 	};

// 	const renderAction = () => {
// 		if (status === 'attemptedClose') {
// 			return (
// 				<>
// 					<Button
// 						variant="text"
// 						style={{ color: 'white' }}
// 						onClick={handleDiscard}
// 					>
// 						Discard
// 					</Button>
// 					<Button
// 						variant="text"
// 						style={{ color: 'white' }}
// 						onClick={handleSave}
// 					>
// 						Keep
// 					</Button>
// 				</>
// 			);
// 		} else if (status === 'error') {
// 			return (
// 				<IconButton aria-label="close-snackbar" onClick={resetError}>
// 					<CloseOutlined />
// 				</IconButton>
// 			);
// 		} else if (status === 'attemptedDelete') {
// 			return (
// 				<>
// 					<Button
// 						variant="text"
// 						style={{ color: 'white' }}
// 						onClick={resetStatus}
// 					>
// 						Abort
// 					</Button>
// 					<Button
// 						variant="text"
// 						style={{ color: 'white' }}
// 						onClick={handleDeletion}
// 					>
// 						Delete
// 					</Button>
// 				</>
// 			);
// 		} else
// 			return (
// 				<IconButton onClick={resetStatus}>
// 					<CloseOutlined />
// 				</IconButton>
// 			);
// 	};

// 	const deriveClassName = () =>
// 		status === 'attemptedDelete' || status === 'error'
// 			? classes.errMessage
// 			: status === 'attemptedClose'
// 			? classes.warningMessage
// 			: classes.successMessage;

// 	return (
// 		<Snackbar
// 			open={status !== 'none'}
// 			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
// 			data-testid="dialog-snackbar"
// 		>
// 			<Alert severity="warning" action={renderAction()}>
// 				{renderMessage()}
// 			</Alert>
// 		</Snackbar>
// 	);
// };

// export default Snacktion;

export const d = () => {};
