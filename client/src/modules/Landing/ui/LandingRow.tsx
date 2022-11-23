import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import clsx from 'clsx';
import { alpha } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
	backgroundSection: {
		width: '100vw',
		padding: theme.spacing(8, 0),
	},

	backgroundLight: {
		backgroundColor: theme.palette.common.white,
	},

	backgroundColored: {
		backgroundColor: alpha(theme.palette.primary.light, 0.1),
	},
}));

export type TLandingRowVariant = 'light' | 'dark';

interface ILandingRowProps {
	bg: TLandingRowVariant;
}

const LandingRow: React.FunctionComponent<
	PropsWithChildren<ILandingRowProps>
> = ({ bg, children }) => {
	const classes = useStyles();

	const sectionStyles = clsx(
		bg === 'light' ? classes.backgroundLight : classes.backgroundColored,
		classes.backgroundSection
	);

	return (
		<section className={sectionStyles}>
			<Container maxWidth="lg">{children}</Container>
		</section>
	);
};

export default LandingRow;
