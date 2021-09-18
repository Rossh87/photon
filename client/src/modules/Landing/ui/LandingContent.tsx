import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Carousel from './Carousel';

const data = Array(8).fill({});

const LandingContent: React.FunctionComponent = (props) => {
	return (
		<Box width="100%">
			<Carousel />
		</Box>
	);
};

export default LandingContent;
