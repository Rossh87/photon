import React, { ChangeEventHandler } from 'react';
import {
	Box,
	ListItem,
	ListItemText,
	TextField,
	Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { MapPropsToHumanLabels, isConfigurableField } from '../helpers';
import { pipe } from 'fp-ts/lib/function';
import {
	IUserFacingProfileProps,
	TConfigurableProfileProps,
} from '../sharedProfileTypes';
import { fold as BFold } from 'fp-ts/boolean';
import { fromPredicate, map } from 'fp-ts/Option';
import ProfileFormActionButton from './ProfileFormActionButton';
import { DisplayValueSource } from '..';
import { validationTools } from '../../../core/validationTools';

const useStyles = makeStyles(() => ({
	profileText: {
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		maxWidth: 600,
	},
}));

interface ProfileItemProps {
	fieldName: keyof IUserFacingProfileProps;
	handleFieldSubmit: (a: string | number) => void;
	handleChange: ChangeEventHandler<HTMLInputElement>;
	provisionalValue: string | number;
	actualValue: string | number;
	displaySource: DisplayValueSource;
	editable: boolean;
	handleFieldReset: (k: keyof IUserFacingProfileProps) => void;
}

const ProfileListItem: React.FunctionComponent<ProfileItemProps> = ({
	fieldName,
	handleChange,
	handleFieldSubmit,
	provisionalValue,
	actualValue,
	displaySource,
	editable,
	handleFieldReset,
}) => {
	const classes = useStyles();

	const [editing, setEditing] = React.useState(false);

	const [error, setError] = React.useState<string | null>(null);

	const reset = () => {
		setEditing(false);
		setError(null);
		handleFieldReset(fieldName);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		return pipe(
			fieldName,
			fromPredicate(isConfigurableField),
			map((field) =>
				pipe(
					validationTools[field].pattern.test(
						provisionalValue as IUserFacingProfileProps[keyof TConfigurableProfileProps]
					),
					BFold(
						() => setError(validationTools[field].failureMessage),
						() => {
							setError(null);
							setEditing(false);
							handleFieldSubmit(provisionalValue);
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
			{displaySource === 'formState' ? provisionalValue : actualValue}
		</Typography>
	);

	const inputComponent = (
		<form onSubmit={handleSubmit}>
			<TextField
				size="small"
				value={provisionalValue}
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
