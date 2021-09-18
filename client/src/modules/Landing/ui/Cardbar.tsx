import React from 'react';
import Box from '@material-ui/core/Box';
import LandingCard from './LandingCard';

// blueprint:
// Photo by <a href="https://unsplash.com/@sxoxm?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sven Mieke</a> on <a href="https://unsplash.com/s/photos/blueprint?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// cloud:
// Photo by <a href="https://unsplash.com/@enginakyurt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">engin akyurt</a> on <a href="https://unsplash.com/s/photos/cloud?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// html
// Photo by <a href="https://unsplash.com/@pankajpatel?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Pankaj Patel</a> on <a href="https://unsplash.com/s/photos/html?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

const Cardbar: React.FunctionComponent = () => {
	return (
		<Box
			display="flex"
			gridGap="16px"
			justifyContent="space-around"
			flexWrap="wrap"
		>
			<LandingCard
				alt="single cloud in a blue sky"
				title="single cloud in a blue sky"
				url="https://storage.googleapis.com/photon_user_images/lossy-assets/lossy-cloud.jpg"
				heading="Upload"
			>
				Upload your orginal image. Lossy resizes your image and makes it
				available via CDN.
			</LandingCard>
			<LandingCard
				alt="technical diagram with pencil and ruler"
				url="https://storage.googleapis.com/photon_user_images/lossy-assets/lossy-blueprint.jpg"
				title="technical diagram with pencil and ruler"
				heading="Configure"
			>
				Describe how your image will be used, and set responsive
				breakpoints that match the needs of your user interface.
			</LandingCard>
			<LandingCard
				alt="black computer screen showing lines of HTML"
				url="https://storage.googleapis.com/photon_user_images/lossy-assets/lossy-html.jpg"
				title="black computer screen showing lines of HTML"
				heading="Use it"
			>
				Lossy generates responsive HTML based on your needs. Just paste
				it wherever you need it.
			</LandingCard>
		</Box>
	);
};

export default Cardbar;
