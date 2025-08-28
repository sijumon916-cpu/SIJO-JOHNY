import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.67.111 2.458.318M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 2.458c-.373.992-.857 1.92-1.428 2.762M3.98 8.223A10.02 10.02 0 002.458 12c1.274 4.057 5.064 7 9.542 7a10.02 10.02 0 003.78-1.223M1.5 1.5l21 21" />
    </svg>
);

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        countryCode: '+971',
        mobile: '',
        username: '',
        password: '',
        confirmPassword: '',
        referralCode: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { register } = useAppContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!termsAccepted) {
            setError('You must agree to the Terms and Conditions to create an account.');
            return;
        }

        if (!formData.referralCode) {
            setError('A referral code is required.');
            return;
        }

        try {
            const { confirmPassword, countryCode, mobile, ...restOfData } = formData;
            const registerData = {
                ...restOfData,
                mobile: `${countryCode}${mobile}`
            };
            
            const newUser = await register(registerData);
            if (newUser) {
                setSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold text-center text-neutral mb-6">Create Account</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
                <input name="name" placeholder="Full Name" aria-label="Full Name" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
                <input name="email" type="email" placeholder="Email Address" aria-label="Email Address" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
                
                <div className="flex">
                    <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        aria-label="Country Code"
                        className="px-3 py-2 border border-r-0 border-gray-600 rounded-l-md focus:outline-none focus:ring-primary focus:border-primary bg-black text-white appearance-none"
                    >
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+92">🇵🇰 +92</option>
                        <option value="+63">🇵🇭 +63</option>
                        <option value="+880">🇧🇩 +880</option>
                        <option value="+1">🇺🇸 +1</option>
                    </select>
                    <input
                        name="mobile"
                        placeholder="501234567"
                        aria-label="Mobile Number"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>

                <input name="username" placeholder="Choose a Username" aria-label="Choose a Username" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
                <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" aria-label="Password" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary pr-10"/>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                </div>
                <div className="relative">
                    <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" aria-label="Confirm Password" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary pr-10"/>
                     <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                </div>
                <input name="referralCode" placeholder="Referral Code" aria-label="Referral Code" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
                
                <div className="flex items-center space-x-2 pt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        required
                        aria-required="true"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Terms and Conditions</Link>
                    </label>
                </div>

                <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition font-semibold disabled:bg-indigo-300 disabled:cursor-not-allowed" disabled={!!success || !termsAccepted}>
                    {success ? 'Registered!' : 'Create Account'}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Login here</Link>
            </p>
        </>
    );
};

export default RegisterPage;