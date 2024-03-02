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
    // * setErrors to an empty obj
    setErrors({});
    // * dispatch our sessionActions store/ use the login thunk, pass in credential and password in as the parameters that will serve as the payload to our thunk
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      // * this res on line 23 represents the response returned on line 63 of session.js?
      .catch(async (res) => {

        const data = await res.json();
        console.log(data)
        if (data && data.message) {
          setErrors({credential: data.message});
        }
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>

        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button disabled={credential.length < 4 || password.length < 6} type="submit">Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;
