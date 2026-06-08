import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema } from '../../../validators';
import { forgotPassword } from '../services/auth.api';

export default function ForgotPassword() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [devResetLink, setDevResetLink] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const response = await forgotPassword(data.email);
      setSuccess(true);
      if (response.devResetLink) {
        setDevResetLink(response.devResetLink);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 border border-green-200">
            <CheckCircle2 className="h-6 w-6 text-[#16A34A]" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#111827]">
            Check your email
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Check your email for reset instructions. We have sent a secure link to your inbox.
          </p>
        </div>

        {devResetLink && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-left space-y-2">
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Developer Visibility (Local Environment Only)
            </p>
            <p className="text-xs text-slate-600 leading-normal">
              Click the generated link below to simulate the email reset token action:
            </p>
            <Link
              to={devResetLink.replace('http://localhost:5173', '')}
              className="block text-xs font-semibold text-[#714B67] break-all hover:underline"
            >
              {devResetLink}
            </Link>
          </div>
        )}

        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-semibold text-[#714B67] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          Reset Password
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
          Enter your email and we will send you instructions to reset your password.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#DC2626] font-medium">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="block w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-slate-400 focus:outline-none"
              placeholder="name@company.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#714B67] hover:bg-[#583b51] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#714B67]/20 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending instructions...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <Link
          to="/login"
          className="inline-flex items-center text-xs font-semibold text-[#714B67] hover:underline"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
