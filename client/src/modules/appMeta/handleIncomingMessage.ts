import { fold as BFold } from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';
import {
	IAppMessage,
	TAppMetaState,
	TSingleNoticeMessage,
} from './appMetaTypes';
import { isSingleNoticeMessage } from './guards';
import { fold as OFold, fromPredicate } from 'fp-ts/lib/Option';

const handleSingleNotice =
	(currState: TAppMetaState) =>
	(message: TSingleNoticeMessage): TAppMetaState => {
		return pipe(
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
	};

// if incoming message is single-notice and user has already viewed, it
// don't display it.  Otherwise, display and update relevant user props
export const handleIncomingMessage = (
	currState: TAppMetaState,
	message: IAppMessage
): TAppMetaState =>
	pipe(
		message,
		fromPredicate(isSingleNoticeMessage),
		OFold(
			() => ({ ...currState, appMessage: message }),
			handleSingleNotice(currState)
		)
	);
