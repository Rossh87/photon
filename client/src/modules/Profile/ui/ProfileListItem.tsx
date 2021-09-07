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
	profileText: {
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		maxWidth: 600,
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

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
		setValue(e.target.value);

	const handleSubmit = () => {
		handleFieldSubmit(value);
		setEditing(false);
	};

	const typoComponent = (
		<Typography color="textPrimary" classes={{ root: classes.profileText }}>
			<Box component="span" fontWeight="fontWeightBold" pr={1}>
				{MapPropsToHumanLabels[fieldName]}:
			</Box>
			{initialValue}
		</Typography>
	);

	const inputComponent = (
		<form onSubmit={handleSubmit}>
			<TextField
				size="small"
				value={value}
				onChange={handleChange}
				id={`profile-${fieldName}-input`}
				label={MapPropsToHumanLabels[fieldName]}
				variant="outlined"
				// fullWidth
			/>
		</form>
	);

	const renderInterior = () => (editing ? inputComponent : typoComponent);

	return (
		<>
			<ListItem>
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
		</>
	);
};

export default ProfileListItem;
