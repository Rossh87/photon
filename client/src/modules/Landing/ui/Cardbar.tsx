import React from 'react';
import Box from '@mui/material/Box';
import LandingCard from './LandingCard';

const Cardbar: React.FunctionComponent = () => {
	return (
        <Box
			display="flex"
			gap="16px"
			justifyContent="space-around"
			flexWrap="wrap"
		>
			<LandingCard
				alt="single cloud in a blue sky"
				title="single cloud in a blue sky"
				url="https://cdn.lossy.dev/lossy-assets/lossy-cloud.jpg"
				heading="Upload"
			>
				Upload your orginal image. Lossy resizes your image and makes it
				available via CDN.
			</LandingCard>
			<LandingCard
				alt="technical diagram with pencil and ruler"
				url="https://cdn.lossy.dev/lossy-assets/lossy-blueprint.jpg"
				title="technical diagram with pencil and ruler"
				heading="Configure"
			>
				Describe how your image will be used, and set responsive
				breakpoints that match the needs of your user interface.
			</LandingCard>
			<LandingCard
				alt="black computer screen showing lines of HTML"
				url="https://cdn.lossy.dev/lossy-assets/lossy-html.jpg"
				title="black computer screen showing lines of HTML"
				heading="Use"
			>
				Lossy generates responsive HTML based on your needs. Just paste
				it wherever you need it.
			</LandingCard>
		</Box>
    );
};

export default Cardbar;
