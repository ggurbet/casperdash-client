import { EncryptionType } from 'casper-storage';
import { CREATE_WALLET } from '../actionTypes';

const initialState = {
	currentStep: 0,
	keyPhrase: null,
	keyPhraseAsMap: [],
	answerSheet: undefined,
	encryptionType: EncryptionType.Ed25519,
};

function reducer(state = initialState, { payload, type } = {}) {
	switch (type) {
		case CREATE_WALLET.NEXT_STEP:
			return {
				...state,
				currentStep: state.currentStep + 1,
			};
		case CREATE_WALLET.PREVIOUS_STEP:
			return {
				...state,
				currentStep: state.currentStep - 1,
			};
		case CREATE_WALLET.RESET_STEP:
			return {
				...state,
				currentStep: 0,
			};
		case CREATE_WALLET.CREATE_KEYPHRASE:
			return {
				...state,
				keyPhrase: payload.keyphrase,
				keyPhraseAsMap: payload.map ?? {},
			};
		case CREATE_WALLET.RESET:
			return initialState;
		case CREATE_WALLET.SET_ANSWER_SHEET:
			return {
				...state,
				answerSheet: payload,
			};
		case CREATE_WALLET.UPDATE_ANSWER_SHEET:
			return {
				...state,
				answerSheet: {
					...state.answerSheet,
					[payload.groupIdx]: payload.value,
				},
			};
		case CREATE_WALLET.UPDATE_ENCRYPTION_TYPE:
			return {
				...state,
				encryptionType: payload.encryptionType,
			};
		default:
			return state;
	}
}

export { initialState };
export default reducer;
