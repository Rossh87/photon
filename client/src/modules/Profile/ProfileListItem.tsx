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

const ProfileListItem: React.FunctionComponent<ProfileItemProps> = ({
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
			<Divider variant="middle" component="li" />
		</>
	);
};

export default ProfileListItem;
