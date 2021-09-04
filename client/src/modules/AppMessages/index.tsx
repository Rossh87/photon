import { Alert, AlertProps } from '@material-ui/lab';
import { pipe, constNull } from 'fp-ts/lib/function';
import { fromArray } from 'fp-ts/lib/NonEmptyArray';
import { map as OMap, fold as OFold } from 'fp-ts/Option';
import React, { FunctionComponent, ReactElement } from 'react';
import { TAppMessages } from '../Auth/state/authStateTypes';
import { useAuthDispatch, useAuthState } from '../Auth/state/useAuthState';
import { IconButton } from '@material-ui/core';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
// NB
const AppMessages: FunctionComponent = () => {
	const { appMessages } = useAuthState();
	const authDispatch = useAuthDispatch();

	return pipe(
		appMessages,
		fromArray,
		OMap((msgs) => msgs[msgs.length - 1]),
		OFold(constNull, ({ severity, action, message, id }) => (
			<Alert
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
