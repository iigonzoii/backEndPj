import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    let formErrors = {}
    e.preventDefault();
    if (password !== confirmPassword){
      formErrors.confirmPassword = 'Password and confirm Password must match'
    }
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          console.log("DATA",data)
          if (data?.errors) {
            for (const i in data.errors) {
              formErrors[i] = data.errors[i]
            }
            setErrors(formErrors);
          }
        });
  }

  return (
    <>
      <h1>Sign Up</h1>

      {/* if errors.length greater than one list all the errors */}
      {errors.email && <p className='red'>{errors.email}</p>}
      {errors.firstName && <p className='red'>{errors.firstName}</p>}
      {errors.lastName && <p className='red'>{errors.lastName}</p>}
      {errors.password && <p className='red'>{errors.password}</p>}
      {errors.username && <p className='red'>{errors.username}</p>}
      {errors.confirmPassword && (
        <p className='red'>{errors.confirmPassword}</p>
      )}
      <form className='signup-form' onSubmit={handleSubmit}>
        <input
          placeholder='Email'
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder='Username'
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          placeholder='First Name'
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          placeholder='Last Name'
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          placeholder='Password'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          placeholder='Confirm Password'
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button disabled={!(email && username && username.length > 3 && lastName && password && password.length > 5 && confirmPassword)} type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
