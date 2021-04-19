import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import SyncIcon from '@material-ui/icons/Sync';

interface StatusIconProps {
	status: 'populated' | 'preprocessed' | 'processing' | 'success' | 'error';
}

const useSelectedIconStyles = makeStyles({
	successIcon: {
		fill: '#02b033'
	},

	processingIcon: {
		animation: 'rotation 1s infinite linear'
	}
});

const SelectedImageStatusIcon: React.FunctionComponent<StatusIconProps> = ({status}) => {
	const classes = useSelectedIconStyles();

	const renderIcon = () => {
		switch(status){
			case 'processing':
				return (<SyncIcon className={classes.processingIcon}/>);

			case 'success':
				return (<CheckCircleOutlineIcon className={classes.successIcon}/>);

			default:
				return (<DeleteIcon />);
		}
	}
	
	return renderIcon();
}

export default SelectedImageStatusIcon;