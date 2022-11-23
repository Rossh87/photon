import { FormEvent, FunctionComponent } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
	Box,
	IconButton,
	ListItemSecondaryAction,
	Theme,
	Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
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
					<IconButton
						onClick={reset}
						edge="end"
						aria-label="clear"
						size="large"
					>
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
							size="large"
						>
							<ClearIcon className={classes.clearButton} />
						</IconButton>
					</Tooltip>
					<Tooltip title="keep">
						<IconButton
							onClick={handleSubmit}
							edge="end"
							aria-label="keep"
							size="large"
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
					size="large"
				>
					<EditIcon className={classes.editButton} />
				</IconButton>
			</Tooltip>
		);

	return <ListItemSecondaryAction>{setButton()}</ListItemSecondaryAction>;
};

export default ProfileFormActionButton;
