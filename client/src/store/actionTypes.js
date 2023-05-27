export const CONFIGURATIONS = {
	FETCH_CONFIGURATIONS: 'CONFIGURATIONS.FETCH_CONFIGURATIONS',
};
export const DEPLOY = {
	PUT_DEPLOY: 'DEPLOY.PUT_DEPLOY',
	DEPLOY_CONTRACT: 'DEPLOY.DEPLOY_CONTRACT',
	GET_LATEST_BLOCK_HASH: 'DEPLOY.GET_LATEST_BLOCK_HASH',
	PUSH_TRANSFER_TO_LOCAL_STORAGE: 'DEPLOY.PUSH_TRANSFER_TO_LOCAL_STORAGE',
	GET_TRANSFERS_FROM_LOCAL_STORAGE: 'DEPLOY.GET_TRANSFERS_FROM_LOCAL_STORAGE',
	UPDATE_TRANSFER_LOCAL_STORAGE: 'DEPLOY.UPDATE_TRANSFER_LOCAL_STORAGE',
	GET_DEPLOYS_STATUS: 'DEPLOY.GET_DEPLOYS_STATUS',
};

export const STAKE = {
	PUSH_STAKE_TO_LOCAL_STORAGE: 'STAKE.PUSH_STAKE_TO_LOCAL_STORAGE',
	GET_STAKES_FROM_LOCAL_STORAGE: 'STAKE.GET_STAKE_FROM_LOCAL_STORAGE',
	UPDATE_STAKES_LOCAL_STORAGE: 'STAKE.UPDATE_STAKES_LOCAL_STORAGE',
};

export const USERS = {
	SET_USER_ADDRESS: 'USERS.SET_USER_ADDRESS',
	FETCH_USER_DETAILS: 'USERS.FETCH_USER_DETAILS',
	FETCH_BATCH_USER_DETAILS: 'USERS.FETCH_BATCH_USER_DETAILS',
	SET_KEY_PATH: 'USER.SET_KEY_PATH',
	SET_SELECTED_WALLET: 'USER.SET_SELECTED_WALLET',
	RESET: 'RESET',
	FETCH_BATH_USERS_DETAIL: 'USER.FETCH_BATH_USERS_DETAIL',
	FETCH_STAKING_REWARDS: 'USER.FETCH_STAKING_REWARDS',
};

export const SIGNER = {
	UPDATE_CONNECT_STATUS: 'SIGNER.UPDATE_CONNECT_STATUS',
	UPDATE_LOCK_STATUS: 'SIGNER.UPDATE_LOCK_STATUS',
	SET_CONNECT_ERROR: 'SIGNER.SET_CONNECT_ERROR',
	CLEAR_CONNECT_ERROR: 'SIGNER.CLEAR_CONNECT_ERROR',
};

export const KEY_MANAGER = {
	FETCH_KEY_MANAGER_DETAILS: 'KEY_MANAGER.FETCH_KEY_MANAGER_DETAILS',
	PUT_WEIGHT_DEPLOY: 'KEY_MANAGER.PUT_WEIGHT_DEPLOY',
	DEPLOY_KEY_MANAGER_CONTRACT: 'KEY_MANAGER.DEPLOY_KEY_MANAGER_CONTRACT',
	UPDATE_LOCAL_STORAGE: 'KEY_MANAGER.UPDATE_LOCAL_STORAGE',
	GET_LOCAL_STORAGE: 'KEY_MANAGER.GET_LOCAL_STORAGE',
	GET_DEPLOYS_STATUS: 'KEY_MANAGER.GET_DEPLOYS_STATUS',
};

export const PRICE = {
	FETCH_PRICE_HISTORY: 'PRICE.FETCH_PRICE_HISTORY',
	FETCH_CSPR_MARKET_INFO: 'PRICE.FETCH_CSPR_MARKET_INFO',
};

export const TOKENS = {
	FETCH_TOKENS_INFO_WITH_BALANCE: 'TOKENS.FETCH_TOKENS_INFO_WITH_BALANCE',
	FETCH_TOKEN_INFO: 'TOKENS.FETCH_TOKEN_INFO',
	GET_FROM_LOCAL_STORAGE: 'TOKENS.GET_FROM_LOCAL_STORAGE',
	SET_LOCAL_STORAGE: 'TOKENS.SET_LOCAL_STORAGE',
};

export const REQUEST = {
	ADD_REQUEST_LOADING_STATUS: 'REQUEST.ADD_REQUEST_LOADING_STATUS',
	REMOVE_REQUEST_LOADING_STATUS: 'REQUEST.REMOVE_REQUEST_LOADING_STATUS',
};

export const NFTS = {
	FETCH_NFTS_INFO: 'NFTS.FETCH_NFTS_INFO',
	FETCH_NFTS_CONTRACT_INFO: 'NFTS.FETCH_NFTS_CONTRACT_INFO',
	SET_ADDRESS_LOCAL_STORAGE: 'NFTS.SET_ADDRESS_LOCAL_STORAGE',
	GET_FROM_LOCAL_STORAGE: 'NFTS.GET_FROM_LOCAL_STORAGE',
	UPDATE_LOCAL_STORAGE: 'NFTS.UPDATE_LOCAL_STORAGE',
	GET_DEPLOY_FROM_LOCAL_STORAGE: 'NFTS.GET_DEPLOY_FROM_LOCAL_STORAGE',
	GET_DEPLOYS_STATUS: 'NFTS.GET_DEPLOYS_STATUS',
};

export const VALIDATORS = {
	FETCH_ACTIVE_VALIDATORS: 'VALIDATORS.FETCH_ACTIVE_VALIDATORS',
	FETCH_VALIDATORS_DETAIL: 'VALIDATORS.FETCH_VALIDATORS_DETAIL',
};

export const SETTINGS = {
	SWITCH_THEME: 'SETTINGS.SWITCH_THEME',
	SET_AUTO_LOCK_TIME: 'SETTINGS.SET_AUTO_LOCK_TIME',
	SET_NETWORK: 'SETTINGS.SET_NETWORK',
};

export const FILES = {
	STORE_FILE: 'FILES.STORE_FILE',
	DELETE_FILE: 'FILES.DELETE_FILE',
};

export const CREATE_WALLET = {
	CREATE_KEYPHRASE: 'CREATE_WALLET.CREATE_KEYPHRASE',
	NEXT_STEP: 'CREATE_WALLET.NEXT_STEP',
	PREVIOUS_STEP: 'CREATE_WALLET.PREVIOUS_STEP',
	RESET: 'CREATE_WALLET.RESET',
	RESET_STEP: 'CREATE_WALLET.RESET_STEP',
	SET_ANSWER_SHEET: 'CREATE_WALLET.SET_ANSWER_SHEET',
	UPDATE_ANSWER_SHEET: 'CREATE_WALLET.UPDATE_ANSWER_SHEET',
	UPDATE_ENCRYPTION_TYPE: 'CREATE_WALLET.UPDATE_ENCRYPTION_TYPE',
};

export const LOGIN_MODAL = {
	SET_IS_OPEN: 'SET_IS_OPEN',
};

export const SWAP = {
	UPDATE_SWAP_FROM: 'SWAP.UPDATE_SWAP_FROM',
	UPDATE_SWAP_TO: 'SWAP.UPDATE_SWAP_TO',
	UPDATE_SETTINGS: 'SWAP.UPDATE_SETTINGS',
	UPDATE_IS_RECEIVE_EXACT: 'SWAP.UPDATE_IS_RECEIVE_EXACT',
	RESET: 'SWAP.RESET',
}

export const LIQUIDITY = {
	UPDATE_LIQUIDITY_X: 'LIQUIDITY.UPDATE_LIQUIDITY_X',
	UPDATE_LIQUIDITY_Y: 'LIQUIDITY.UPDATE_LIQUIDITY_Y',
	RESET : 'LIQUIDITY.RESET',
}