import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { TSavedBreakpoints } from '../../../../../sharedTypes/Breakpoint';
import { TAvailableImageWidths } from '../../../../../sharedTypes/Upload';
import { TUserBreakpointUI } from '../state/imageConfigurationStateTypes';
import { createSrcset } from '../useCases/createSrcset';

const useStyles = makeStyles((theme) => ({
	codeBox: {
		backgroundColor: theme.palette.background.default,
		overflow: 'auto',
	},
}));

interface CodeDisplayProps {
	breakpoints: TSavedBreakpoints;
	availableWidths: TAvailableImageWidths;
	publicPathPrefix: string;
}

const PasteableCodeTab: FunctionComponent<CodeDisplayProps> = ({
	breakpoints,
	availableWidths,
	publicPathPrefix,
}) => {
	const classes = useStyles();

	return (
		<div>
			<Typography>
				Paste the following directly into your HTML:
			</Typography>
			<Box className={classes.codeBox} mt={2} p={1}>
				<code
					data-testid="pasteable-HTML-block"
					style={{ maxWidth: '100%', width: '100%' }}
				>
					{
						createSrcset('string')(breakpoints)(availableWidths)(
							publicPathPrefix
						) as string
					}
				</code>
			</Box>
		</div>
	);
};

export default PasteableCodeTab;
