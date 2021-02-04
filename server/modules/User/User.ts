import { UserRole, IConstructor } from '../../core/sharedTypes';

interface ILeanUser {
    userName: string;
    identityProvider: string;
    profileImageURL?: string;
    firstName?: string;
    lastName?: string;
    dateJoined: Date;
    role: UserRole;
}

interface IRichUser extends ILeanUser {}

interface IUserConstructor extends IConstructor<IRichUser> {
    createUser(u: ILeanUser): IRichUser;
}

class User implements IRichUser {
    identityProvider: string;
    profileImageURL?: string;
    firstName?: string;
    lastName?: string;
    dateJoined: Date;
    userName: string;
    role: UserRole;

    public static createUser(u: unknown) {
        return new User(u as ILeanUser);
    }

    private constructor(u: ILeanUser) {
        this.userName = u.userName;
        this.role = u.role;
        this.dateJoined = u.dateJoined;
        this.identityProvider = u.identityProvider;

        if (u.firstName) {
            this.firstName = u.firstName;
        }

        if (u.lastName) {
            this.lastName = u.lastName;
        }

        if (u.profileImageURL) {
            this.profileImageURL = u.profileImageURL;
        }
    }
}
