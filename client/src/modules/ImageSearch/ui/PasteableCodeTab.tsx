import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { TSavedBreakpoints } from '../../../../../sharedTypes/Breakpoint';
import { TAvailableImageWidths } from '../../../../../sharedTypes/Upload';
import { createSrcset } from '../useCases/createSrcset';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

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

	const [copied, setCopied] = useState(false);

	const timerID = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleCopyTimer = () => {
		setCopied(true);

		if (timerID.current !== null) {
			clearTimeout(timerID.current);
		}
		timerID.current = setTimeout(() => {
			setCopied(false);
		}, 3000);
	};

	const componentText = createSrcset('string')(breakpoints)(availableWidths)(
		publicPathPrefix
	) as string;

	const handleCopy = () => {
		navigator.clipboard.writeText(componentText).then(handleCopyTimer);
	};

	useEffect(
		() => () => {
			if (timerID.current !== null) {
				clearTimeout(timerID.current);
			}
		},
		[]
	);

	return (
		<div>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Typography>
					Paste the following directly into your HTML:
				</Typography>
				<Tooltip
					placement="left-start"
					title={copied ? 'Copied!' : 'Copy'}
				>
					<IconButton size="large" onClick={handleCopy}>
						<FileCopyOutlinedIcon />
					</IconButton>
				</Tooltip>
			</Box>
			<Box className={classes.codeBox} mt={2} p={1}>
				<code
					data-testid="pasteable-HTML-block"
					style={{ maxWidth: '100%', width: '100%' }}
				>
					{componentText}
				</code>
			</Box>
		</div>
	);
};

export default PasteableCodeTab;
