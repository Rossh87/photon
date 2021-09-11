import React, { FunctionComponent } from 'react';
import { ISimpleMessageAction, IAdvancedMessageAction } from './appMetaTypes';
import {
	Button,
	IconButton,
	makeStyles,
	Snackbar,
	useTheme,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { CloseOutlined } from '@material-ui/icons';
import { isAdvancedMessageAction } from './guards';
import { useAppState, useAppDispatch } from '../appState/useAppState';

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
		<IconButton aria-label="close-snackbar" onClick={a.handler}>
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