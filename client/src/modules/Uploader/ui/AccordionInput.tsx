import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccordionInput: React.FunctionComponent = (props) => {
	return (
		<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-label="Expand"
				aria-controls="additional-actions3-content"
				id="additional-actions3-header"
			>
				<FormControlLabel
					aria-label="Acknowledge"
					onClick={(event) => event.stopPropagation()}
					onFocus={(event) => event.stopPropagation()}
					control={<Checkbox />}
					label="I acknowledge that I should provide an aria-label on each action that I add"
				/>
			</AccordionSummary>
		</Accordion>
	);
};

export default AccordionInput;
