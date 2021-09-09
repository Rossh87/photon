import { fold as BFold } from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';
import {
	IAppMessage,
	IAuthState,
	TSingleNoticeMessage,
} from '../state/authStateTypes';
import { isSingleNoticeMessage } from '../state/guards';
import { fromPredicate, fold as OFold } from 'fp-ts/lib/Option';

const handleSingleNotice =
	(currState: IAuthState) =>
	(message: TSingleNoticeMessage): IAuthState =>
		pipe(
			currState[message.displayTrackingProp],
			BFold(
				() => ({
					...currState,
					[message.displayTrackingProp]: true,
					appMessage: message,
				}),
				() => ({ ...currState })
			)
		);

// if incoming message is single-notice and user has already viewed, it
// don't display it.  Otherwise, display and update relevant user props
export const handleIncomingMessage = (
	currState: IAuthState,
	message: IAppMessage
): IAuthState =>
	pipe(
		message,
		fromPredicate(isSingleNoticeMessage),
		OFold(
			() => ({ ...currState, appMessage: message }),
			handleSingleNotice(currState)
		)
	);
