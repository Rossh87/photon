import React, {
	ChangeEventHandler,
	FocusEventHandler,
	FormEventHandler,
	useState,
} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { GOOGLE_OAUTH_ENDPOINT } from '../../../CONSTANTS';
import GoogleButton from 'react-google-button';
import GithubOAuthButton from '../../GithubOAuthButton';
import { validationTools } from '../../../core/validationTools';
import axios from 'axios';
import { SIGNIN_ENDPOINT, SIGNUP_ENDPOINT } from '../http/endpoints';
import {
	ILocalUserCredentials,
	TAuthorizedUserResponse,
} from '../../../../../sharedTypes/User';
import { useAppDispatch } from '../../appState/useAppState';
import { handleSigninOrSignupFailure } from '../helpers';
import { TFormMode } from '../sharedLandingTypes';

const useStyles = makeStyles((theme) => ({
	form: {
		display: 'flex',
		width: '100%',
		gap: theme.spacing(2),
		flexDirection: 'column',
		justifyContent: 'space-around',
		padding: theme.spacing(2),
	},

	buttonGrid: {
		paddingTop: theme.spacing(5),
	},

	anchor: {
		textDecoration: 'none',
		color: 'inherit',
	},

	errMessage: {
		color: theme.palette.error.main,
		padding: theme.spacing(1),
		textAlign: 'center',
	},

	signinButton: {
		alignSelf: 'flex-start',
		flexBasis: '20%',
		fontWeight: theme.typography.fontWeightBold,
	},
}));

interface ICredentialsFormProps {
	formMode: TFormMode;
}

const CredentialsForm: React.FunctionComponent<ICredentialsFormProps> = ({
	formMode,
}) => {
	const classes = useStyles();

	const dispatch = useAppDispatch();

	const pw = useState('');
	const pwErr = useState<string | null>(null);
	const email = useState('');
	const emailErr = useState<string | null>(null);
	const [componentErrMessage, setComponentErr] = useState<string | null>(
		null
	);

	const getControls = (stateKey: 'passwordState' | 'emailState') => {
		const { pattern, failureMessage } =
			stateKey === 'passwordState'
				? validationTools.password
				: validationTools.emailAddress;

		const stateAndSetter = stateKey === 'passwordState' ? pw : email;

		const errAndSetter = stateKey === 'passwordState' ? pwErr : emailErr;

		const [state, setState] = stateAndSetter;

		const [err, setErr] = errAndSetter;

		return {
			pattern,
			failureMessage,
			state,
			setState,
			err,
			setErr,
		};
	};

	const handleChange =
		(
			stateKey: 'passwordState' | 'emailState'
		): ChangeEventHandler<HTMLInputElement> =>
		(e) => {
			const { setState, setErr, err } = getControls(stateKey);

			const { value } = e.target;

			setState(value);

			if (value === '' && err) setErr(null);
		};

	const handleBlur =
		(
			stateKey: 'passwordState' | 'emailState'
		): FocusEventHandler<HTMLInputElement> =>
		(e) => {
			const { pattern, setErr, failureMessage, state } =
				getControls(stateKey);

			if (state === '') return;

			return pattern.test(state) ? setErr(null) : setErr(failureMessage);
		};

	const hasValidationErrs = pwErr[0] !== null || emailErr[0] !== null;

	const isPopulated = pw[0].length > 0 && email[0].length > 0;

	const OAuthButtonText = formMode === 'signin' ? 'Sign in' : 'Sign up';

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		if (hasValidationErrs) return;

		const endpoint =
			formMode === 'signin' ? SIGNIN_ENDPOINT : SIGNUP_ENDPOINT;

		const submissionData: ILocalUserCredentials = {
			registeredEmailAddress: email[0],
			password: pw[0],
		};

		const handleSigninOrSignupSuccess = (
			userData: TAuthorizedUserResponse
		) => dispatch({ type: 'AUTH/ADD_USER', payload: userData });

		axios
			.post<TAuthorizedUserResponse>(endpoint, submissionData, {
				withCredentials: true,
			})
			.then((res) => res.data)
			.then(handleSigninOrSignupSuccess)
			.catch(handleSigninOrSignupFailure(setComponentErr));
	};

	return (
		<div>
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
			>
				<Typography component="h1" variant="h5">
					{formMode === 'signin'
						? 'Sign In'
						: 'Start serving fast, responsive images.'}
				</Typography>
			</Grid>
			<Grid
				container
				direction="column"
				alignItems="center"
				className={classes.buttonGrid}
				spacing={2}
			>
				<form onSubmit={handleSubmit} className={classes.form}>
					<TextField
						size={'small'}
						variant="outlined"
						placeholder="Email"
						error={emailErr[0] !== null}
						helperText={emailErr[0]}
						onChange={handleChange('emailState')}
						fullWidth
						onBlur={handleBlur('emailState')}
						id="signin-email-input"
						label="Email Address"
					></TextField>
					<TextField
						size={'small'}
						fullWidth
						variant="outlined"
						placeholder="Password"
						error={pwErr[0] !== null}
						helperText={pwErr[0]}
						onChange={handleChange('passwordState')}
						onBlur={handleBlur('passwordState')}
						type="password"
						label="Password"
						id="signin-password-input"
					></TextField>
					<Button
						className={classes.signinButton}
						type="submit"
						disabled={hasValidationErrs || !isPopulated}
						variant="contained"
						color="primary"
					>
						Sign {formMode === 'signin' ? 'In' : 'Up'}
					</Button>
				</form>
				{componentErrMessage && (
					<Typography display="block" className={classes.errMessage}>
						{componentErrMessage}
					</Typography>
				)}
				<Grid item>
					<a className={classes.anchor} href={GOOGLE_OAUTH_ENDPOINT}>
						<GoogleButton
							label={`${OAuthButtonText} with Google`}
						/>
					</a>
				</Grid>
				<Grid item>
					<GithubOAuthButton label={OAuthButtonText} />
				</Grid>
			</Grid>
		</div>
	);
};

export default CredentialsForm;
