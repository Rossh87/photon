import { useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import CredentialsForm from './ui/CredentialsForm';
import { TFormMode } from './sharedLandingTypes';
import Header from '../Header';
import Cardbar from './ui/Cardbar';
import LandingRow from './ui/LandingRow';
import NewCarousel from './ui/Carousel';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';

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

	mainBox: {
		display: 'flex',
		justifyContent: 'space-around',
		flexWrap: 'wrap',
	},

	mainBoxSmall: {
		display: 'block',
		padding: theme.spacing(0, 4),
	},

	carouselContainer: {
		marginTop: '-200px',
		marginLeft: '-200px',
		flexBasis: '70%',
		overflow: 'hidden',
		minHeight: '650px',
	},

	carouselContainerSmall: {
		marginTop: '-175px',
		marginLeft: 'calc(50% - 287.5px)',
		flexBasis: '100%',
		height: '495px',
		minHeight: 'revert',
	},

	carouselContainerTiny: {
		minHeight: 'auto',
		marginLeft: 'calc(50% - 217px)',
		height: '365px',
		marginTop: '-90px',
	},
}));

export default function Landing() {
	const classes = useStyles();

	const theme = useTheme();

	// const bpMatched = useMediaQuery(theme.breakpoints.down('sm'));

	const smallMatched = useMediaQuery(theme.breakpoints.down('md'));
	const tinyMatched = useMediaQuery(theme.breakpoints.down('sm'));

	const [formMode, setFormMode] = useState<TFormMode>('signup');

	const c = clsx(
		tinyMatched
			? classes.carouselContainerTiny
			: smallMatched
			? classes.carouselContainerSmall
			: null
	);

	const renderSignup = () => (
		<>
			<Box
				flexBasis="50%"
				position="relative"
				className={clsx(classes.carouselContainer, c)}
			>
				<NewCarousel />
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
			<LandingRow bg="light">
				<Box
					className={clsx(
						classes.mainBox,
						tinyMatched && classes.mainBoxSmall
					)}
				>
					{formMode === 'signup' ? renderSignup() : renderSignin()}
				</Box>
			</LandingRow>
			<LandingRow bg="dark">
				<Cardbar />
			</LandingRow>
		</>
	);
}
