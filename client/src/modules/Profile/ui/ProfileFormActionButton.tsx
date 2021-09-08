import React, { FormEvent, FunctionComponent } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import {
	Box,
	IconButton,
	ListItemSecondaryAction,
	makeStyles,
	Theme,
	Tooltip,
} from '@material-ui/core';
import { Option } from 'fp-ts/lib/Option';

const useStyles = makeStyles((theme: Theme) => ({
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

interface ProfileActionButtonProps {
	editing: boolean;
	error: string | null;
	reset: () => void;
	handleSubmit: (e: FormEvent) => Option<void>;
	setEditing: (b: boolean) => void;
}

const ProfileFormActionButton: FunctionComponent<ProfileActionButtonProps> = ({
	editing,
	error,
	reset,
	handleSubmit,
	setEditing,
}) => {
	const classes = useStyles();

	const setButton = () =>
		editing ? (
			error ? (
				<Tooltip title="clear">
					<IconButton onClick={reset} edge="end" aria-label="clear">
						<ClearIcon className={classes.clearButton} />
					</IconButton>
				</Tooltip>
			) : (
				<Box>
					<Tooltip title="clear">
						<IconButton
							onClick={reset}
							edge="end"
							aria-label="clear"
						>
							<ClearIcon className={classes.clearButton} />
						</IconButton>
					</Tooltip>
					<Tooltip title="keep">
						<IconButton
							onClick={handleSubmit}
							edge="end"
							aria-label="keep"
						>
							<CheckIcon className={classes.successButton} />
						</IconButton>
					</Tooltip>
				</Box>
			)
		) : (
			<Tooltip title="edit">
				<IconButton
					onClick={() => setEditing(true)}
					edge="end"
					aria-label="edit"
				>
					<EditIcon className={classes.editButton} />
				</IconButton>
			</Tooltip>
		);

	return <ListItemSecondaryAction>{setButton()}</ListItemSecondaryAction>;
};

export default ProfileFormActionButton;
