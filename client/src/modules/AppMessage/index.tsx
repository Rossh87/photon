import React, { FunctionComponent } from 'react';
import { Button, IconButton, Snackbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Alert } from '@mui/lab';
import { CloseOutlined } from '@mui/icons-material';
import { useAppState, useAppDispatch } from '../appState/useAppState';
import {
	IAdvancedMessageAction,
	ISimpleMessageAction,
} from '../appMeta/appMetaTypes';
import { isAdvancedMessageAction } from '../appMeta/guards';

const useStyles = makeStyles((theme) => ({
	actionButton: {
		fontWeight: theme.typography.fontWeightBold,
		color: theme.palette.common.white,
	},

	alert: {
		minWidth: '30vw',
		maxWidth: '95vw',
	},
}));

const AppMessage: FunctionComponent = () => {
	const { appMeta } = useAppState();
	const appMessage = appMeta.appMessage;
	const appDispatch = useAppDispatch();
	const classes = useStyles();

	const renderSimpleAction = (a: ISimpleMessageAction) => (
		<IconButton aria-label="close-message" onClick={a.handler} size="large">
			<CloseOutlined />
		</IconButton>
	);

	const renderAdvancedAction = (a: IAdvancedMessageAction) => (
		<>
			<Button
				variant="text"
				className={classes.actionButton}
				onClick={a.abort.handler}
				data-testid="snackbar-abort"
			>
				{a.abort.buttonText}
			</Button>
			<Button
				variant="text"
				className={classes.actionButton}
				onClick={a.proceed.handler}
				data-testid="snackbar-proceed"
			>
				{a.proceed.buttonText}
			</Button>
		</>
	);

	const renderAction = (a: ISimpleMessageAction | IAdvancedMessageAction) =>
		isAdvancedMessageAction(a)
			? renderAdvancedAction(a)
			: renderSimpleAction(a);

	return appMessage ? (
		<Snackbar
			open
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			data-testid="app-message-snackbar"
			autoHideDuration={appMessage.timeout}
			onClose={() => appDispatch({ type: 'META/REMOVE_APP_MESSAGE' })}
			classes={{ root: classes.alert }}
		>
			<Alert
				severity={appMessage.severity}
				action={renderAction(appMessage.action)}
				variant="filled"
			>
				{appMessage.displayMessage}
			</Alert>
		</Snackbar>
	) : null;
};

export default AppMessage;
