import React, { ReactElement } from 'react';
import PeopleIcon from '@material-ui/icons/People';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import BackupIcon from '@material-ui/icons/Backup';
import HomeIcon from '@material-ui/icons/Home';

type NavigablePages = 'Profile' | 'Image Search' | 'Upload' | 'Home';

export interface INavItemData {
	pageName: NavigablePages;
	icon: ReactElement;
	matchesRouterPath: string;
}

const navItems: INavItemData[] = [
	{
		pageName: 'Home',
		icon: <HomeIcon fontSize="large" />,
		matchesRouterPath: '/',
	},
	{
		pageName: 'Profile',
		icon: <PeopleIcon fontSize="large" />,
		matchesRouterPath: '/profile',
	},
	{
		pageName: 'Image Search',
		icon: <ImageSearchIcon fontSize="large" />,
		matchesRouterPath: '/image-search',
	},
	{
		pageName: 'Upload',
		icon: <BackupIcon fontSize="large" />,
		matchesRouterPath: '/upload',
	},
];

export default navItems;
