import React, { useState, type JSX } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRequestOtpMutation, useVerifyOtpMutation } from "../slices/apiSlice";
import '../css/AuthForm.css';

const Passwordless = (): JSX.Element => {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  const navigate = useNavigate();

  const [requestOtp, { isLoading: isRequesting }] = useRequestOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestOtp({ email }).unwrap();
      toast.success('OTP code sent to your email!');
      setStep(2); 
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp({ email, otp }).unwrap();
      toast.success('Successfully authenticated!');
      navigate('/dashboard'); 
    } catch (err: any) {
      toast.error(err?.data?.message || 'Invalid or expired OTP code.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-visual">
        <h1>Secure Entry</h1>
        <p>No password? No problem. Enter your email to receive a secure login code.</p>
      </div>
      
      <div className="auth-form-container">
        <div className="auth-form">
          <h2>{step === 1 ? 'Request Login Code' : 'Enter Your Code'}</h2>
          
          {step === 1 && (
            <form onSubmit={handleRequestOtp}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={isRequesting}
                  placeholder="Enter your registered email"
                />
              </div>
              <button type="submit" disabled={isRequesting}>
                {isRequesting ? 'Sending Code...' : 'Send Magic Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label>6-Digit OTP Code</label>
                <input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  required 
                  disabled={isVerifying}
                  placeholder="e.g. 111111"
                  maxLength={6}
                />
              </div>
              <button type="submit" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Login'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                disabled={isVerifying}
                className="back-button"
              >
                Go Back
              </button>
            </form>
          )}
          
          <div className="form-footer">
            <Link to="/login">Return to Standard Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passwordless;