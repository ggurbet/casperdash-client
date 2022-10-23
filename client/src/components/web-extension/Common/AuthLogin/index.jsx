import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import messages from '@cd/shared/formMessages';
import useAuthLogin from '@cd/components/hooks/useAuthLogin';
import { deleteAllUserData } from '@cd/actions/userActions';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const onValidatePassword = (values) => {
	const errors = {};

	if (!values.password) {
		errors.password = messages.passwordRequired;
	}

	return errors;
};

const AuthLogin = ({
	onLoginSuccess = () => {},
	isShowReset = false,
	header = null,
	passwordLabel = 'Enter password',
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { onAuthCredentialSuccess, validateUserCredential } = useAuthLogin({
		onAuthCompleted: onLoginSuccess,
	});
	const [serverErrors, setServerErrors] = useState(undefined);
	const onValidate = useCallback((values) => onValidatePassword(values), []);

	const handleFormSubmit = useCallback(
		async (values) => {
			if (values.password) {
				const result = await validateUserCredential(values.password);

				if (!result) {
					setServerErrors({ message: messages.passwordWrong });
					return;
				}

				result.publicKey && onAuthCredentialSuccess(result);
			}
		},
		[onAuthCredentialSuccess, validateUserCredential],
	);

	const onChangeHandler = useCallback(
		(e, handler) => {
			if (e?.target?.value && serverErrors) {
				setServerErrors(undefined);
			}
			handler('password', e?.target?.value);
		},
		[serverErrors],
	);

	const handleOnReset = useCallback(async () => {
		dispatch(deleteAllUserData());
		navigate('/connectAccount');
	}, [dispatch, navigate]);

	return (
		<Formik
			initialValues={{
				password: '',
			}}
			validate={onValidate}
			onSubmit={handleFormSubmit}
		>
			{({ errors, touched, setFieldValue, handleBlur, handleSubmit }) => {
				return (
					<Form noValidate onSubmit={handleSubmit}>
						{header}
						<Form.Group className="mb-3">
							<Form.Label>{passwordLabel}</Form.Label>
							<FormControl
								onBlur={handleBlur}
								onChange={(e) => onChangeHandler(e, setFieldValue)}
								name="password"
								type="password"
								placeholder="Enter password"
							/>
							{errors.password && touched.password && (
								<Form.Text className="invalid-feedback" id="passwordHelpBlock">
									{errors.password}
								</Form.Text>
							)}
						</Form.Group>
						{serverErrors && (
							<Form.Text className="invalid-feedback" id="passwordHelpBlock">
								{serverErrors.message}
							</Form.Text>
						)}  
						<div className="cd_we_page--bottom">
							<Button type="submit" className="cd_we_btn-next" disabled={false}>
								Unlock
							</Button>
							{isShowReset && (
								<div className="cd_we_welcomeBack--bottom">
									<Button onClick={handleOnReset} variant="link">
										Log in as another user?
									</Button>
								</div>
							)}
						</div>
					</Form>
				);
			}}
		</Formik>
	);
};

AuthLogin.propTypes = {
	header: PropTypes.node,
	isShowReset: PropTypes.bool,
	onLoginSuccess: PropTypes.func,
	passwordLabel: PropTypes.string
}

export default AuthLogin;
