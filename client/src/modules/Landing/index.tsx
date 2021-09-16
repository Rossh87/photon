import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import LandingContent from './ui/LandingContent';
import CredentialsForm from './ui/CredentialsForm';
import LoginBar from '../Header/ui/LoginBar';
import { TFormMode } from './sharedLandingTypes';
import Container from '@material-ui/core/Container';
import Header from '../Header';
import Cardbar from './ui/Cardbar';
import LandingRow from './ui/LandingRow';
const useStyles = makeStyles((theme) => ({
	background: {
		background: 'rgb(255,255,255)',
		height: '100vh',
	},

	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},

	anchor: {
		textDecoration: 'none',
		color: 'inherit',
	},

	container: {
		paddingTop: theme.spacing(2),
	},
}));

export default function Landing() {
	const classes = useStyles();

	const [formMode, setFormMode] = useState<TFormMode>('signup');

	const renderSignup = () => (
		<>
			<Box flexBasis="30%">
				<LandingContent />
			</Box>
			<Box flexBasis="30%">
				<CredentialsForm formMode={formMode} />
			</Box>
		</>
	);

	const renderSignin = () => (
		<Box flexBasis="30%">
			<CredentialsForm formMode={formMode} />
		</Box>
	);

	return (
		<>
			<Header landingMode={formMode} setLandingMode={setFormMode} />
			<LandingRow bg="dark">
				<Box
					display="flex"
					justifyContent="space-around"
					flexWrap="wrap"
				>
					{formMode === 'signup' ? renderSignup() : renderSignin()}
				</Box>
			</LandingRow>
			<LandingRow bg="light">
				<Cardbar />
			</LandingRow>
		</>
	);
}
