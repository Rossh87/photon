import React, { FunctionComponent } from 'react';
import {
	IAdvancedMessageAction,
	IAppMessage,
	ISimpleMessageAction,
	TAppMessageState,
} from '../Auth/state/authStateTypes';
import { Button, IconButton, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { CloseOutlined } from '@material-ui/icons';
import { pipe } from 'fp-ts/lib/function';
import { isAdvancedMessageAction } from '../Auth/state/guards';
import { useAuthState } from '../Auth/state/useAuthState';
import { fromNullable, fold, map } from 'fp-ts/Option';

const renderSimpleAction = (a: ISimpleMessageAction) => (
	<IconButton aria-label="close-snackbar" onClick={a.handler}>
		<CloseOutlined />
	</IconButton>
);

const renderAdvancedAction = (a: IAdvancedMessageAction) => (
	<>
		<Button
			variant="text"
			style={{ color: 'white' }}
			onClick={a.abort.handler}
		>
			{a.abort.buttonText}
		</Button>
		<Button
			variant="text"
			style={{ color: 'white' }}
			onClick={a.proceed.handler}
		>
			{a.proceed.buttonText}
		</Button>
	</>
);

const renderAction = (a: ISimpleMessageAction | IAdvancedMessageAction) =>
	isAdvancedMessageAction(a)
		? renderAdvancedAction(a)
		: renderSimpleAction(a);

const onSome = ({ severity, displayMessage, action, timeout }: IAppMessage) => (
	<Snackbar
		open={true}
		anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
		data-testid="app-message-snackbar"
		autoHideDuration={timeout}
	>
		<Alert severity={severity} action={renderAction(action)}>
			{displayMessage}
		</Alert>
	</Snackbar>
);

const AppMessage: FunctionComponent = () => {
	const { appMessage } = useAuthState();

	return pipe(
		appMessage,
		fromNullable,
		fold(() => null, onSome)
	);
};

export default AppMessage;
