import { IUserProfileProperties, IUserServiceUsageProperties } from "../../../../sharedTypes/User";
import { TLocalUserCredentials } from "../sharedAuthTypes";

export const signupRequestToProfileProps = (req: TLocalUserCredentials): IUserProfileProperties => 