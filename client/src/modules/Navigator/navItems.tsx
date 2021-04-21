import PeopleIcon from '@material-ui/icons/People';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import BackupIcon from '@material-ui/icons/Backup';

const navItems = [
	{
		id: 'Profile',
		icon: <PeopleIcon />,
	},
	{ id: 'Image Search', icon: <ImageSearchIcon /> },
	{ id: 'Upload', icon: <BackupIcon /> },
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
