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
import EditIcon from '@material-ui/icons/Edit';
import { MapPropsToHumanLabels } from '../helpers';
import { IUserFacingProfileProps } from '..';

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		width: '100%',
	},
	listItemTypo: {
		padding: theme.spacing(2.75),
		paddingRight: theme.spacing(8),
	},

	listItemInput: {
		padding: theme.spacing(0.75),
	},

	typography: {
		overflow: 'hidden',
	},
}));

interface ProfileItemProps {
	fieldName: keyof IUserFacingProfileProps;
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
		<Typography color="textPrimary" className={classes.typography}>
			<Box component="span" fontWeight="fontWeightBold">
				{`${MapPropsToHumanLabels[fieldName]}: `}
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
				label={MapPropsToHumanLabels[fieldName]}
				variant="outlined"
				fullWidth
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
