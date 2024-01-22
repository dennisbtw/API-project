import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div id='login-modal-main-container'>
      <h1 id='login-modal-header'>Log In</h1>
      {errors.credential && (
        <p className='login-credential-validation-error' style={{ color: "red" }}>{errors.credential}</p>
      )}
      <form onSubmit={handleSubmit} id="login-modal-form-container">
        <label className='login-modal-label'>
          <input
            placeholder='Username or Email'
            className='login-modal-input-field'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='login-modal-label'>
          <input
            placeholder='Password'
            className='login-modal-input-field'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className={(credential.length < 4 || password.length < 6) ? 'login-modal-button' : 'enabled-login-button'} type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>
        <button className='enabled-login-button' onClick={() => {
          setCredential("Demo-lition");
          setPassword("password")
        }}>Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;