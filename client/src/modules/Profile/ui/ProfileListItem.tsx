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
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import {
	validationTools,
	isConfigurableField,
	MapPropsToHumanLabels,
} from '../helpers';
import { pipe } from 'fp-ts/lib/function';
import {
	IUserFacingProfileProps,
	TConfigurableProfileProps,
} from '../sharedProfileTypes';
import { fold as BFold } from 'fp-ts/boolean';
import { fromPredicate, map } from 'fp-ts/Option';

const useStyles = makeStyles((theme: Theme) => ({
	profileText: {
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		maxWidth: 600,
	},

	successButton: {
		color: theme.palette.success.main,
	},

	clearButton: {
		color: theme.palette.error.main,
	},

	editButton: {
		color: theme.palette.primary.main,
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

	const [error, setError] = React.useState<string | null>(null);

	const [value, setValue] = React.useState(initialValue);

	const reset = () => {
		setValue(initialValue);
		setEditing(false);
		setError(null);
	};

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const { value } = e.target;

		if (value === initialValue || value === '') {
			reset();
		}

		setValue(value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		return pipe(
			fieldName,
			fromPredicate(isConfigurableField),
			map((field) =>
				pipe(
					validationTools[field].pattern.test(
						value as IUserFacingProfileProps[keyof TConfigurableProfileProps]
					),
					BFold(
						() => setError(validationTools[field].failureMessage),
						() => {
							setError(null);
							handleFieldSubmit(value);
							setEditing(false);
						}
					)
				)
			)
		);
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
				error={!!error}
				helperText={error && error}
			/>
		</form>
	);

	const setButtonAction = () =>
		editing ? (error ? reset : handleSubmit) : () => setEditing(true);

	const setButton = () =>
		editing ? (
			error ? (
				<ClearIcon className={classes.clearButton} />
			) : (
				<CheckIcon className={classes.successButton} />
			)
		) : (
			<EditIcon className={classes.editButton} />
		);

	const renderInterior = () => (editing ? inputComponent : typoComponent);

	return (
		<>
			<ListItem>
				<ListItemText primary={renderInterior()} />
				{editable && (
					<ListItemSecondaryAction>
						<IconButton
							onClick={setButtonAction()}
							edge="end"
							aria-label="delete"
						>
							{setButton()}
						</IconButton>
					</ListItemSecondaryAction>
				)}
			</ListItem>
		</>
	);
};

export default ProfileListItem;
