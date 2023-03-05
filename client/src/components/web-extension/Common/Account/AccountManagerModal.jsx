import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WalletDescriptor } from 'casper-storage';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import isNil from 'lodash-es/isNil';
import clsx from 'clsx';
import useGetWallets from '@cd/hooks/useGetWallets';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import { addWalletAccount, setSelectedWallet, getPrivateKey } from '@cd/hooks/useServiceWorker';
import Divider from '@cd/components/Common/Divider';
import { formatAccountName } from '@cd/helpers/format';
import CloseIcon from '@cd/assets/image/close-icon.svg';
import PlusIcon from '@cd/assets/image/plus-icon.svg';
import './AccountManagerModal.scss';
import { getSelectedWallet } from '@cd/selectors/user';
import ImportAccount from '@cd/assets/image/ic-import-account.svg';
import Key from '@cd/assets/image/ic-key.svg';
import { useNavigate } from 'react-router-dom';
import EnterPasswordModal from '@cd/web-extension/Common/LoginModal/EnterPasswordModal';

export const AccountManagerModal = ({ isOpen, onClose, isUserExisting, ...restProps }) => {
	const dispatch = useDispatch();
	const selectedWallet = useSelector(getSelectedWallet);
	const navigate = useNavigate();
	const [showEnterPassword, setShowEnterPassword] = useState(false);

	const [wallets, loadWallets, isLoading] = useGetWallets();

	useEffect(() => {
		if (isOpen && isUserExisting) {
			loadWallets();
		}
		// isExistUser here because we should reload list wallets if lose session and login again
	}, [isOpen, loadWallets, isUserExisting]);

	const handleAddNewWallet = () => {
		addWalletAccount(wallets.length, new WalletDescriptor(formatAccountName(wallets.length))).then(() => {
			return loadWallets();
		});
	};

	const handleOnSelectWallet = (uid) => {
		setSelectedWallet(uid).then((result) => {
			const { publicKey, userDetails } = result;
			dispatch(onBindingAuthInfo({ publicKey, user: userDetails }));

			onClose();
		});
	};

	const onViewPrivateKey = useCallback(
		async (password) => {
			try {
				const privateKey = await getPrivateKey(password);
				navigate('/viewPrivateKey', {
					state: { name: 'Private Key', privateKey: privateKey, accountName: selectedWallet.descriptor.name },
				});
			} catch (error) {
				throw Error('Wrong password provided. Please try again');
			}
		},
		[navigate, selectedWallet],
	);

	return (
		<Modal
			show={isOpen}
			onHide={onClose}
			backdropClassName="cd_we_accounts-modal--backdrop"
			className="cd_we_accounts-modal"
			centered
			{...restProps}
		>
			<Modal.Header>
				<button className="cd_we_accounts-modal__btn-close" onClick={onClose}>
					<CloseIcon />
				</button>
			</Modal.Header>
			<Modal.Body>
				<ul className="cd_we_accounts-modal__list">
					{wallets.map((wallet) => (
						<li
							key={wallet.uid}
							className={clsx('cd_we_accounts-modal__list-item', {
								selected: wallet.uid === selectedWallet.uid,
							})}
							onClick={() => handleOnSelectWallet(wallet.uid)}
						>
							<div>{wallet.descriptor.name}</div>
							<div className="cd_we_accounts-modal__list-item-balance">
								{isNil(wallet.balance) ? (
									<Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
										className="cd_we_accounts-modal__list-item-loading"
									/>
								) : (
									wallet.balance
								)}
								<span>CSPR</span>
							</div>
						</li>
					))}
				</ul>
			</Modal.Body>
			<Divider className="cd_we_accounts-modal__divider" />
			<Modal.Footer>
				<Button
					variant="link"
					className="cd_we_accounts-modal__btn-action"
					disabled={isLoading}
					onClick={handleAddNewWallet}
				>
					<span className="btn-icon">
						<PlusIcon />
					</span>
					<span className="btn-text">Create New Account</span>
				</Button>

				<Button
					variant="link"
					onClick={() => {
						onClose();
						navigate('/importAccount', { state: { name: 'Import Account' } });
					}}
					className="cd_we_accounts-modal__btn-action import-account"
				>
					<span className="btn-icon">
						<ImportAccount />
					</span>
					<span className="btn-text">Import Account</span>
				</Button>
				<Button
					variant="link"
					onClick={() => {
						setShowEnterPassword(true);
					}}
					className="cd_we_accounts-modal__btn-action import-account"
				>
					<span className="btn-icon">
						<Key />
					</span>
					<span className="btn-text">View PrivateKey</span>
				</Button>
			</Modal.Footer>
			{showEnterPassword && (
				<EnterPasswordModal
					isOpen={showEnterPassword}
					onCloseModal={() => setShowEnterPassword(false)}
					title="View Private Key"
					description="Enter password to continue"
					onSubmitPassword={onViewPrivateKey}
				/>
			)}
		</Modal>
	);
};
