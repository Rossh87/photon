import React, { FunctionComponent, ReactNode } from 'react';
import { TTabPanelType } from '../state/imageSearchStateTypes';

interface TabPanelProps {
	identifier: TTabPanelType;
	activeValue: TTabPanelType;
	children: ReactNode;
}

const Tabpanel: FunctionComponent<TabPanelProps> = ({
	children,
	identifier,
	activeValue,
	...rest
}) => {
	return (
		<div
			aria-labelledby={`display-${identifier}-tab`}
			role="tabpanel"
			hidden={identifier !== activeValue}
			{...rest}
		>
			{identifier === activeValue && children}
		</div>
	);
};

export default Tabpanel;
