import { NETWORK_NAME } from '@cd/constants/key';
import { NFTS } from '../store/actionTypes';
import { setLocalStorageValue, getLocalStorageValue, getNetworkStorageKey } from '../services/localStorage';

/**
 * @param {string} publicKey
 * @returns {object}
 */
export const fetchNFTInfo = (publicKey, nftContracts) => ({
	type: NFTS.FETCH_NFTS_INFO,
	request: {
		url: '/nfts/getNFTsInfo',
		params: {
			publicKey,
			nftContracts,
		},
	},
});

/**
 * @param {string} publicKey
 * @returns {object}
 */
export const fetchAllNTFContractInfoByPublicKey = (publicKey) => ({
	type: NFTS.FETCH_NFTS_CONTRACT_INFO,
	request: {
		url: `/nfts/${publicKey}/NFTContracts`,
	},
});

export const fetchNFTContractInfo = (contractAddress) => ({
	type: NFTS.FETCH_NFTS_CONTRACT_INFO,
	request: {
		url: `/nfts/contract/${contractAddress}`,
	},
});

export const addCustomNFTAddressToLocalStorage = (tokenAddress, publicKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const network = state.settings.network || NETWORK_NAME;
		const { nfts } = setLocalStorageValue(
			publicKey,
			getNetworkStorageKey('nfts.address', network),
			tokenAddress,
			'push',
		);
		dispatch({
			type: NFTS.SET_ADDRESS_LOCAL_STORAGE,
			payload: nfts.address || [],
		});
	};
};

/**
 * @param {string} publicKey
 * @returns
 */
export const getNFTAddressesFromLocalStorage = (publicKey) => {
	return (dispatch, getState) => {
		const network = getState().settings.network;
		const localStorageValue = getLocalStorageValue(publicKey, getNetworkStorageKey('nfts.address', network));
		dispatch({
			type: NFTS.GET_FROM_LOCAL_STORAGE,
			payload: localStorageValue || [],
		});
	};
};

/**
 *
 * @param {string} publicKey
 * @param {string} patch
 * @param {object} value
 * @param {string} action
 */
export const updateNFTLocalStorage = (publicKey, patch, value, action) => {
	return (dispatch, getState) => {
		const network = getState().settings.network;
		const { nfts } = setLocalStorageValue(publicKey, getNetworkStorageKey(patch, network), value, action);
		dispatch({
			type: NFTS.UPDATE_LOCAL_STORAGE,
			payload: nfts,
		});
	};
};

/**
 *	get nft deploys from local storage
 * @param {string} publicKey
 */
export const getNFTDeploysFromLocalStorage = (publicKey) => {
	return (dispatch, getState) => {
		const network = getState().settings.network;
		const item = getLocalStorageValue(publicKey, getNetworkStorageKey('nfts', network));
		dispatch({
			type: NFTS.GET_DEPLOY_FROM_LOCAL_STORAGE,
			payload: item ? item : { deploys: {} },
		});
	};
};

/**
 * get pending NFT deploy status
 * @param {string} deployHash
 */
export const getNFTPendingDeploysStatus = (deployHash) => ({
	type: NFTS.GET_DEPLOYS_STATUS,
	request: {
		url: '/deploysStatus',
		params: {
			deployHash,
		},
	},
});

/**
 * Update NFT deploy status
 * @param {string} publicKey
 * @param {string} path
 * @param {array} listHash
 */
export const updateNFTDeploysStatus = (publicKey, path, listHash = []) => {
	return (dispatch) => {
		const deployStorageValue = getLocalStorageValue(publicKey, path);
		const updatedValue = Object.keys(deployStorageValue).reduce((out, key) => {
			out[key] = deployStorageValue[key].map((value) => {
				const deployStatus = listHash.find(
					(h) => h.hash && value.hash && h.hash.toLowerCase() === value.hash.toLowerCase(),
				);
				return { ...value, status: deployStatus ? deployStatus.status : value.status };
			});
			return out;
		}, {});
		dispatch(updateNFTLocalStorage(publicKey, path, updatedValue, 'set'));
	};
};
