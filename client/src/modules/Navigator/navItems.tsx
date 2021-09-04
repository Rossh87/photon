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

// const navItems = [
// 	{
// 	  id: 'Develop',
// 	  children: [
// 		{
// 		  id: 'Profile',
// 		  icon: <PeopleIcon />,
// 		  active: true,
// 		},
// 		{ id: 'Database', icon: <DnsRoundedIcon /> },
// 		{ id: 'Storage', icon: <PermMediaOutlinedIcon /> },
// 		{ id: 'Hosting', icon: <PublicIcon /> },
// 		{ id: 'Functions', icon: <SettingsEthernetIcon /> },
// 		{
// 		  id: 'ML Kit',
// 		  icon: <SettingsInputComponentIcon />,
// 		},
// 	  ],
// 	},
// 	{
// 	  id: 'Quality',
// 	  children: [
// 		{ id: 'Analytics', icon: <SettingsIcon /> },
// 		{ id: 'Performance', icon: <TimerIcon /> },
// 		{ id: 'Test Lab', icon: <PhonelinkSetupIcon /> },
// 	  ],
// 	},
//   ];

export default navItems;
