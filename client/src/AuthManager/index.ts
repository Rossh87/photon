import React, { useContext, useEffect, useState } from 'react';
import { requestAuth } from './fetchUserData';
import * as TE from 'fp-ts/lib/TaskEither';
import { IUser, TBlankUser } from './types';
import { defaultState } from './state';

const AuthManager: React.FunctionComponent = (props) => {
    const [user, setState] = useState(defaultState);
};
