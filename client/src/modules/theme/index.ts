import { createTheme } from '@mui/material/styles';

let theme = createTheme({
	palette: {
		primary: {
			light: '#9162e4',
			main: '#5e35b1',
			dark: '#280680',
		},
		secondary: {
			main: '#c2185b',
			light: '#fa5788',
			dark: '#8c0032',
		},
	},
});

export default theme;
