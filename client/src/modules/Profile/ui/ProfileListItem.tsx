import React from 'react';
import {
	TextField,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	Box,
	makeStyles,
	Theme,
} from '@material-ui/core';
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
import ProfileFormActionButton from './ProfileFormActionButton';

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

	const renderInterior = () => (editing ? inputComponent : typoComponent);

	return (
		<>
			<ListItem>
				<ListItemText primary={renderInterior()} />
				{editable && (
					<ProfileFormActionButton
						editing={editing}
						error={error}
						reset={reset}
						handleSubmit={handleSubmit}
						setEditing={setEditing}
					/>
				)}
			</ListItem>
		</>
	);
};

export default ProfileListItem;
