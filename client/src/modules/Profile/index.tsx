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
	Box,
	makeStyles,
	Theme,
	IconButton,
	ListItemSecondaryAction,
} from '@material-ui/core';
import { useAuthDispatch, useAuthState } from '../Auth/state/useAuthState';
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
import ProfileListItem from './ProfileListItem';
import { extractViewableProps } from './helpers';

const useStyles = makeStyles((theme: Theme) => ({
	avatar: {
		width: '20vw',
		height: '20vw',
		margin: theme.spacing(2),
		minWidth: '200px',
		minHeight: '200px',
		maxHeight: '300px',
		maxWidth: '300px',
	},

	list: {
		width: '100%',
	},
}));

export interface IUserFacingProfileProps {
	emailAddress: string;
	uniqueUploads: number;
	uploadUsage: string;
	accessLevel: TAccessLevel;
	userName: string;
	profileImage: string;
}

const Profile: React.FunctionComponent = (props) => {
	const classes = useStyles();

	// cast this since it won't ever be displayed if user isn't logged in
	const user = useAuthState().user as TAuthorizedUserResponse;

	const [localProfileState, setUserState] =
		React.useState<IUserFacingProfileProps>(extractViewableProps(user));

	// hard-code the props that user can edit for now...
	const editables = ['profileImage', 'emailAddress', 'userName'];

	const handleFieldSubmit =
		(fieldName: string) => (newValue: string | number) =>
			setUserState({ ...localProfileState, [fieldName]: newValue });

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

	const authDispatch = useAuthDispatch();

	// refresh user's data whenever this component mounts
	React.useEffect(() => {
		fetchUserData(authDispatch);
	}, []);

	return (
		<Paper>
			<Grid container justifyContent="center">
				<Grid item container xs={12} justifyContent="center">
					{renderAvatar()}
				</Grid>
				<Grid item xs={12} md={10} lg={7} xl={5}>
					<Divider variant="middle" />
					<List className={classes.list}>
						{Object.keys(localProfileState).map((key) => {
							return (
								<ProfileListItem
									fieldName={
										key as keyof IUserFacingProfileProps
									}
									initialValue={
										(localProfileState as any)[key]
									}
									handleFieldSubmit={handleFieldSubmit(key)}
									editable={editables.includes(key)}
								/>
							);
						})}
					</List>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default Profile;
