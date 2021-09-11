import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { TSavedBreakpoints } from '../../../../../sharedTypes/Breakpoint';
import { TAvailableImageWidths } from '../../../../../sharedTypes/Upload';
import { TUserBreakpointUI } from '../state/imageConfigurationStateTypes';
import { createSrcset } from '../useCases/createSrcset';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

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

	const timerIDs = useRef<ReturnType<typeof setTimeout>[]>([]);

	const doCopy = () => {
		setCopied(true);
		timerIDs.current.push(
			setTimeout(() => {
				setCopied(false);
			}, 3000)
		);
	};

	const handleTooltip = () => {
		return copied ? null : doCopy();
	};

	const componentText = createSrcset('string')(breakpoints)(availableWidths)(
		publicPathPrefix
	) as string;

	useEffect(
		() => () => {
			timerIDs.current.forEach((timer) => clearTimeout(timer));
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
					<CopyToClipboard
						text={componentText}
						onCopy={handleTooltip}
					>
						<IconButton>
							<FileCopyOutlinedIcon />
						</IconButton>
					</CopyToClipboard>
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
