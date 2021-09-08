import { TAccessLevel } from 'sharedTypes/User';

export interface IUserFacingProfileProps {
	emailAddress: string;
	uniqueUploads: number;
	uploadUsage: string;
	accessLevel: TAccessLevel;
	userName: string;
	profileImage: string;
}

export type TConfigurableProfileProps = Pick<
	IUserFacingProfileProps,
	'emailAddress' | 'userName' | 'profileImage'
>;
