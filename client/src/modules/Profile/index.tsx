import React from 'react';
import {
	Paper,
	Button,
	TextField,
	Grid,
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	makeStyles,
	Theme,
	Box,
	IconButton,
	ListItemSecondaryAction,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { bytesToHumanReadableSize } from '../Uploader/useCases/preProcessSelectedFiles/appendMetadata';
import {
	IUserProfilePreferences,
	TAccessLevel,
	TAuthorizedUserResponse,
} from '../../../../sharedTypes/User';
import { pipe } from 'fp-ts/lib/function';
import { fromNullable, map, getOrElse, alt, fold } from 'fp-ts/lib/Option';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { fetchUserData } from '../Auth/http/fetchUserData';
import ProfileListItem from './ui/ProfileListItem';
import { extractViewableProps, userFacingPropsToPreferences } from './helpers';
import DependencyContext from '../../core/dependencyContext';
import { handleUserProfileUpdate } from './useCases/handleUserProfileUpdate';
import { chainFirst } from 'fp-ts/Identity';
import { map as TEMap } from 'fp-ts/TaskEither';
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
		// minWidth: '200px',
		// minHeight: '200px',
		// maxHeight: '300px',
		// maxWidth: '300px',
	},

	list: {
		width: '100%',
	},

	saveButton: {
		color: theme.palette.success.main,
		margin: theme.spacing(1),
	},

	cancelButton: {
		color: theme.palette.warning.main,
		margin: theme.spacing(1),
	},

	myGrid: {
		// flexGrow: 1,
	},

	fixedGrid: {
		minWidth: '100%',
		maxWidth: '100%',
	},
}));

const Profile: React.FunctionComponent = (props) => {
	const classes = useStyles();

	const appDispatch = useAppDispatch();
	const dependencies = React.useContext(DependencyContext)(appDispatch);

	// state setup
	const user = useAppState().user as TAuthorizedUserResponse;

	const actions = useAppActions();

	const currStateProps = extractViewableProps(user);

	const [localProfileState, setLocalProfileState] =
		React.useState<IUserFacingProfileProps>(currStateProps);

	const [hasUpdated, setUpdated] = React.useState(false);

	const buttonDisabilityState = !hasUpdated;

	// hard-code the props that user can edit for now...
	const editables = ['profileImage', 'emailAddress', 'userName'];

	// begin handlers
	const handleFieldSubmit =
		(fieldName: keyof IUserFacingProfileProps) =>
		(newValue: string | number) => {
			if (newValue !== localProfileState[fieldName]) setUpdated(true);
			setLocalProfileState({
				...localProfileState,
				[fieldName]: newValue,
			});
		};

	const handleCancel = () =>
		pipe(
			user,
			chainFirst(() => setUpdated(false)),
			extractViewableProps,
			setLocalProfileState
		);

	const handleSave = () => {
		actions.UPDATE_PROFILE_PREFS(localProfileState);
		setUpdated(false);
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
		fetchUserData(appDispatch);
	}, []);

	return (
		<>
			{renderAvatar()}
			<List dense>
				{Object.keys(localProfileState).map((stateKey) => (
					<ProfileListItem
						// okay to just use the property name as a key here,
						// since the contents of this list are never changed/reordered
						key={stateKey}
						fieldName={stateKey as keyof IUserFacingProfileProps}
						initialValue={
							localProfileState[
								stateKey as keyof IUserFacingProfileProps
							]
						}
						handleFieldSubmit={handleFieldSubmit(
							stateKey as keyof IUserFacingProfileProps
						)}
						editable={editables.includes(stateKey)}
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
