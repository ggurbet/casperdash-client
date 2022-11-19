import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moteToCspr } from '@cd/helpers/balance';
import { getPendingStakes, getStakesHistory } from '@cd/selectors/stake';
import { getValidators } from '@cd/selectors/validator';
import { getTransferDeploysStatus } from '@cd/actions/deployActions';
import { ENTRY_POINT_UNDELEGATE, STAKING_STATUS } from '@cd/constants/key';
import { fetchValidators, getStakeFromLocalStorage, updateStakeDeployStatus } from '@cd/actions/stakeActions';
import { SEND_ICON_SMALL, RECEIVE_ICON_SMALL } from '@cd/constants/icon';
import { useAutoRefreshEffect } from './useAutoRefreshEffect';

/**
 * Get staked validators and add the pending amount.
 *
 * @param {Array} validators
 * @param {Array} pendingStakes
 * @param {String} publicKey
 * @returns
 */
const getStakedValidators = (validators, pendingStakes, publicKey) => {
	let stakedValidators = [];
	if (!publicKey || !validators.length) {
		return stakedValidators;
	}
	validators.forEach((validator) => {
		if (!validator.bidInfo) {
			return;
		}
		const foundDelegator = validator.bidInfo.bid.delegators.find(
			(delegator) => delegator.public_key && delegator.public_key.toLowerCase() === publicKey.toLowerCase(),
		);

		if (!foundDelegator) {
			return;
		}

		const { public_key: validatorPublicKey } = validator;
		const pendingStake = pendingStakes.find((pendingStake) => pendingStake.validator === validatorPublicKey);
		let stakedValidator = {
			validator: validatorPublicKey,
			stakedAmount: moteToCspr(foundDelegator.staked_amount),
			icon: RECEIVE_ICON_SMALL,
		};
		if (pendingStake) {
			stakedValidator.pendingAmount =
				pendingStake.entryPoint === ENTRY_POINT_UNDELEGATE ? -pendingStake.amount : pendingStake.amount;
			stakedValidator.icon = stakedValidator.pendingAmount > 0 ? RECEIVE_ICON_SMALL : SEND_ICON_SMALL;
		}

		stakedValidators.push(stakedValidator);
	});

	pendingStakes
		.filter((stake) => stakedValidators.findIndex((item) => item.validator === stake.validator) < 0)
		.forEach((newStakedValidator) =>
			stakedValidators.push({
				validator: newStakedValidator.validator,
				pendingAmount: newStakedValidator.amount,
			}),
		);

	return stakedValidators;
};

export const useStakeFromValidators = (publicKey) => {
	const dispatch = useDispatch();

	const validators = useSelector(getValidators());
	const pendingStakes = useSelector(getPendingStakes());
	useEffect(() => {
		dispatch(getStakeFromLocalStorage(publicKey));
	}, [dispatch, publicKey]);

	useAutoRefreshEffect(() => {
		if (!pendingStakes.length) {
			return;
		}
		(async () => {
			if (!publicKey) return;
			const { data } = await dispatch(getTransferDeploysStatus(pendingStakes.map((stake) => stake.deployHash)));
			if (
				data &&
				data.some(
					(item) => item.status !== STAKING_STATUS.pending && item.status !== STAKING_STATUS.undelegating,
				)
			) {
				dispatch(fetchValidators(publicKey));
				dispatch(updateStakeDeployStatus(publicKey, 'deploys.stakes', data));
			}
		})();
	}, [JSON.stringify(pendingStakes), dispatch]);

	const stakedValidators = getStakedValidators(validators, pendingStakes, publicKey);
	return stakedValidators;
};

export const useStakedHistory = () => {
	const stakesHistory = useSelector(getStakesHistory());
	return stakesHistory.map((item) => {
		return {
			validator: item.validator,
			stakedAmount: item.entryPoint === ENTRY_POINT_UNDELEGATE ? -item.amount : item.amount,
			icon: item.entryPoint === ENTRY_POINT_UNDELEGATE ? SEND_ICON_SMALL : RECEIVE_ICON_SMALL,
			status: item.status,
			type: item.entryPoint,
			...item,
		};
	});
};
