import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {SetNewPass} from '../api/auth'
import '../css/SetNewPass.css';

function ResetPasswordPage() {
  const { token } = useParams();                // token dari URL
  const [searchParams] = useSearchParams();     // email dari query string
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    setLoading(true);

    if (!password || !passwordConfirmation) {
      setErrors({ general: 'Please fill in both password fields.' });
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setErrors({ passwordConfirmation: ['Passwords do not match.'] });
      setLoading(false);
      return;
    }

    try {
      const status = await SetNewPass(token,email, password, passwordConfirmation);

      if (status) {
        setMessage(status.status);
        setTimeout(() => navigate('/'), 1500);
      } else {
        setErrors({ general: 'Failed to reset password. Please try again.' });
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: 'Failed to reset password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="set-new-pass-page">
      <div className="set-new-pass-card">
        <h2 className="set-new-pass-title">Reset Password</h2>
        <p className="set-new-pass-subtitle">Enter a new password for your account.</p>
        {message ? (
          <p className="set-new-pass-message">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="set-new-pass-form">
            {errors.general && <p className="set-new-pass-error">{errors.general}</p>}

            <label className="set-new-pass-label">Email</label>
            <input type="email" value={email || ''} disabled className="set-new-pass-input" />

            <label className="set-new-pass-label">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="set-new-pass-input"
            />
            {errors.password && <span className="set-new-pass-error">{errors.password[0]}</span>}

            <label className="set-new-pass-label">Confirm Password</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="set-new-pass-input"
            />

            <button type="submit" disabled={loading} className="set-new-pass-button">
              {loading ? 'Processing...' : 'Change Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;