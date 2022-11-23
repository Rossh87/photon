import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SyncIcon from '@mui/icons-material/Sync';

interface StatusIconProps {
	status: 'populated' | 'preprocessed' | 'processing' | 'success' | 'error';
}

const useSelectedIconStyles = makeStyles({
	successIcon: {
		fill: '#02b033',
	},

	processingIcon: {
		animation: 'rotation 1s infinite linear',
	},
});

const SelectedImageStatusIcon: React.FunctionComponent<StatusIconProps> = ({
	status,
}) => {
	const classes = useSelectedIconStyles();

	const renderIcon = () => {
		switch (status) {
			case 'processing':
				return <SyncIcon className={classes.processingIcon} />;

			case 'success':
				return (
					<CheckCircleOutlineIcon className={classes.successIcon} />
				);

			default:
				return <DeleteIcon />;
		}
	};

	return renderIcon();
};

export default SelectedImageStatusIcon;
