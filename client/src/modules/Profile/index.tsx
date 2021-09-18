import React, { ChangeEventHandler, useRef } from 'react';
import {
	Button,
	Avatar,
	List,
	makeStyles,
	Theme,
	Box,
} from '@material-ui/core';
import { TAuthorizedUserResponse } from '../../../../sharedTypes/User';
import { pipe } from 'fp-ts/lib/function';
import { fromNullable, alt, fold } from 'fp-ts/lib/Option';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { fetchUserData } from '../Auth/http/fetchUserData';
import ProfileListItem from './ui/ProfileListItem';
import { extractViewableProps } from './helpers';
import { chainFirst } from 'fp-ts/Identity';
import { IUserFacingProfileProps } from './sharedProfileTypes';
import {
	useAppActions,
	useAppDispatch,
	useAppState,
} from '../appState/useAppState';

const useStyles = makeStyles((theme: Theme) => ({
	avatar: {
		width: '120px',
		height: '120px',
		margin: theme.spacing(2, 'auto'),
		color: theme.palette.primary.main,
	},

	saveButton: {
		color: theme.palette.success.main,
		margin: theme.spacing(1),
	},

	cancelButton: {
		color: theme.palette.warning.main,
		margin: theme.spacing(1),
	},
}));

export type DisplayValueSource = 'appState' | 'formState';

const Profile: React.FunctionComponent = (props) => {
	// hack for dealing with UI flicker
	const timerIDS = useRef<ReturnType<typeof setTimeout>[]>([]);

	const classes = useStyles();

	const appDispatch = useAppDispatch();

	// state setup
	const user = useAppState().user as TAuthorizedUserResponse;

	const actions = useAppActions();

	// Always display values from HERE, not from localProfileState
	const currentStateFromProps = extractViewableProps(user);

	// This is ONLY for tracking form values--this data is never displayed except in
	// open input fields
	const [localProfileState, setLocalProfileState] =
		React.useState<IUserFacingProfileProps>(currentStateFromProps);

	const [displayValueSource, setDisplayValueSource] =
		React.useState<DisplayValueSource>('appState');

	const handleChange =
		(
			key: keyof typeof localProfileState
		): ChangeEventHandler<HTMLInputElement> =>
		(e) => {
			setLocalProfileState((prev) => ({
				...prev,
				[key]: e.target.value,
			}));
		};

	const buttonDisabilityState = displayValueSource === 'appState';

	// hard-code the props that user can edit for now...
	const editables = ['profileImage', 'emailAddress', 'userName'];

	const handleFieldSubmit = () => setDisplayValueSource('formState');

	const handleFieldReset = (key: keyof IUserFacingProfileProps) =>
		setLocalProfileState({
			...localProfileState,
			[key]: currentStateFromProps[key],
		});

	const handleCancel = () =>
		pipe(
			user,
			chainFirst(() => setDisplayValueSource('appState')),
			extractViewableProps,
			setLocalProfileState
		);

	const handleSave = () => {
		actions.UPDATE_PROFILE_PREFS(localProfileState);
		// small delay to give promise that sets new preferences in application
		// state time to resolve before we switch back to displaying that value
		timerIDS.current.push(
			setTimeout(() => setDisplayValueSource('appState'), 250)
		);
	};

	const renderAvatar = () =>
		pipe(
			user.userPreferences?.preferredThumbnailURL,
			fromNullable,
			alt(() => pipe(user.thumbnailURL, fromNullable)),
			fold(
				() => <AccountCircleIcon className={classes.avatar} />,
				(url) => (
					<Avatar
						className={classes.avatar}
						alt={user.displayName}
						src={url}
					/>
				)
			)
		);

	// refresh user's data whenever this component mounts
	React.useEffect(() => {
		return () => timerIDS.current.forEach((timer) => clearTimeout(timer));
	}, []);

	return (
		<>
			<Box display="flex" justifyContent="center">
				{renderAvatar()}
			</Box>
			<List dense>
				{(
					Object.keys(currentStateFromProps) as [
						keyof IUserFacingProfileProps
					]
				).map((stateKey) => (
					<ProfileListItem
						// okay to just use the property name as a key here,
						// since the contents of this list are never changed/reordered
						key={stateKey}
						fieldName={stateKey}
						actualValue={currentStateFromProps[stateKey]}
						provisionalValue={localProfileState[stateKey]}
						handleChange={handleChange(stateKey)}
						handleFieldSubmit={handleFieldSubmit}
						editable={editables.includes(stateKey)}
						displaySource={displayValueSource}
						handleFieldReset={handleFieldReset}
					/>
				))}
			</List>
			<Box display="flex" justifyContent="flex-end" paddingBottom="2rem">
				<Button
					className={classes.cancelButton}
					variant="outlined"
					onClick={handleCancel}
					disabled={buttonDisabilityState}
				>
					Cancel
				</Button>
				<Button
					className={classes.saveButton}
					variant="outlined"
					onClick={handleSave}
					disabled={buttonDisabilityState}
				>
					Save
				</Button>
			</Box>
		</>
	);
};

export default Profile;
