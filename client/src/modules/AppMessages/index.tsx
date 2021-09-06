import { Alert, AlertProps } from '@material-ui/lab';
import { pipe, constNull } from 'fp-ts/lib/function';
import { fromArray } from 'fp-ts/lib/NonEmptyArray';
import { map as OMap, fold as OFold } from 'fp-ts/Option';
import React, { FunctionComponent, ReactElement } from 'react';
import { TAppMessages } from '../Auth/state/authStateTypes';
import { useAuthDispatch, useAuthState } from '../Auth/state/useAuthState';
import { IconButton, makeStyles } from '@material-ui/core';
import CloseOutlined from '@material-ui/icons/CloseOutlined';

const useStyles = makeStyles((theme) => ({
	alert: {
		margin: theme.spacing(2, 0, 0, 0),
	},
}));

const AppMessages: FunctionComponent = () => {
	const { appMessages } = useAuthState();
	const authDispatch = useAuthDispatch();
	const classes = useStyles();

	return pipe(
		appMessages,
		fromArray,
		// This always takes the most recent message
		OMap((msgs) => msgs[msgs.length - 1]),
		OFold(constNull, ({ severity, action, message, id }) => (
			<Alert
				className={classes.alert}
				severity={severity}
				action={
					<IconButton
						aria-label="close-snackbar"
						onClick={() =>
							authDispatch({
								type: 'REMOVE_APP_MESSAGE',
								payload: id,
							})
						}
					>
						<CloseOutlined />
					</IconButton>
				}
			>
				{message}
			</Alert>
		))
	);
};

export default AppMessages;
