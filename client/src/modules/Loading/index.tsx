import React from 'react';
import Modal from '@material-ui/core/Modal';

const Loading: React.FunctionComponent = () => {
	const openState: boolean = status === 'pending';

	return (
		<Modal open={openState}>
			<h2>Loading...</h2>
		</Modal>
	);
};

export default Loading;
