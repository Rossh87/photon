import React, { ReactElement } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import BackupIcon from '@mui/icons-material/Backup';
import HomeIcon from '@mui/icons-material/Home';

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
