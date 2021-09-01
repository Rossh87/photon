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

	divider: {
		color: theme.palette.grey[900],
	},

	listItemTypo: {
		padding: theme.spacing(2.75),
	},

	listItemInput: {
		padding: theme.spacing(0.75),
	},
}));

interface ProfileItemProps {
	fieldName: string;
	initialValue: string | number;
	handleFieldSubmit: (a: string | number) => void;
	editable: boolean;
}

interface IUserFacingProfileProps {
	emailAddress: string;
	uniqueUploads: number;
	uploadUsage: string;
	accessLevel: TAccessLevel;
	userName: string;
	profileImage: string | undefined;
}

const ProfileItem: React.FunctionComponent<ProfileItemProps> = ({
	fieldName,
	initialValue,
	handleFieldSubmit,
	editable,
}) => {
	const classes = useStyles();

	const [editing, setEditing] = React.useState(false);

	const [value, setValue] = React.useState(initialValue);
	console.log(value);

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
		setValue(e.target.value);

	const handleSubmit = () => {
		handleFieldSubmit(value);
		setEditing(false);
	};

	const typoComponent = (
		<Typography color="textPrimary">
			<Box component="span" fontWeight="fontWeightBold">
				{`${fieldName}: `}
			</Box>
			<Box component="span" fontWeight="fontWeightRegular">
				{initialValue}
			</Box>
		</Typography>
	);

	const inputComponent = (
		<form onSubmit={handleSubmit}>
			<TextField
				value={value}
				onChange={handleChange}
				id={`profile-${fieldName}-input`}
				label={fieldName}
				variant="outlined"
			/>
		</form>
	);

	const renderInterior = () => (editing ? inputComponent : typoComponent);

	return (
		<>
			<ListItem
				className={
					editing ? classes.listItemInput : classes.listItemTypo
				}
			>
				<ListItemText primary={renderInterior()} />
				{editable && (
					<ListItemSecondaryAction>
						<IconButton
							onClick={() => setEditing(!editing)}
							edge="end"
							aria-label="delete"
						>
							<EditIcon />
						</IconButton>
					</ListItemSecondaryAction>
				)}
			</ListItem>
			<Divider
				className={classes.divider}
				variant="middle"
				component="li"
			/>
		</>
	);
};

const Profile: React.FunctionComponent = (props) => {
	const classes = useStyles();

	// cast this since it won't ever be displayed if user isn't logged in
	const user = useAuthState().user as TAuthorizedUserResponse;

	// TODO: this is disgraceful.
	const [localProfileState, setUserState] =
		React.useState<IUserFacingProfileProps>({
			userName: user.displayName,
			emailAddress: user.userPreferences?.preferredEmail
				? user.userPreferences.preferredEmail
				: user.OAuthEmail,
			uniqueUploads: user.imageCount,
			accessLevel: user.accessLevel,
			profileImage: user.userPreferences?.preferredThumbnailURL
				? user.userPreferences.preferredThumbnailURL
				: user.thumbnailURL,
			uploadUsage: bytesToHumanReadableSize(user.uploadUsage),
		});

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

	// refresh user's data whenever this component mounts
	const authDispatch = useAuthDispatch();

	React.useEffect(() => {
		fetchUserData(authDispatch);
	}, []);

	return (
		<Paper>
			<Grid
				item
				container
				xs={12}
				alignContent="center"
				alignItems="center"
				justifyContent="center"
				direction="column"
			>
				{renderAvatar()}
				<Divider variant="middle" />
				<Grid item sm={12} md={10} lg={8}>
					<List>
						{Object.keys(localProfileState).map((key) => {
							return (
								<ProfileItem
									fieldName={key}
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
