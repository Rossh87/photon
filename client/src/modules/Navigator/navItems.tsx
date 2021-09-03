import React, { ReactElement } from 'react';
import PeopleIcon from '@material-ui/icons/People';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import BackupIcon from '@material-ui/icons/Backup';

type NavigablePages = 'Profile' | 'Image Search' | 'Upload';

export interface INavItemData {
	pageName: NavigablePages;
	icon: ReactElement;
	matchesRouterPath: string;
}

const navItems: INavItemData[] = [
	{
		pageName: 'Profile',
		icon: <PeopleIcon />,
		matchesRouterPath: '/profile',
	},
	{
		pageName: 'Image Search',
		icon: <ImageSearchIcon />,
		matchesRouterPath: '/image-search',
	},
	{ pageName: 'Upload', icon: <BackupIcon />, matchesRouterPath: '/upload' },
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
