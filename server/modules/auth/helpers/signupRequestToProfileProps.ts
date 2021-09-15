import { IUserProfileProperties, IUserServiceUsageProperties } from "../../../../sharedTypes/User";
import { TLocalSignupRequest } from "../sharedAuthTypes";

export const signupRequestToProfileProps = (req: TLocalSignupRequest): IUserProfileProperties => 