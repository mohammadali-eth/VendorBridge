import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { resetPasswordSchema } from '../../../validators';
import { resetPassword } from '../services/auth.api';

export default function ResetPassword() {
  const { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await resetPassword(token, data.password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'The reset token is invalid or has expired.');
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
          <h1 className="text-xl font-bold text-[#111827]">Password Updated</h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your password has been reset successfully. You can now log in using your new
            credentials.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/login"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#714B67] hover:bg-[#583b51] transition-colors cursor-pointer"
          >
            Go to login <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Set New Password</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
          Please choose a strong password that meets the security requirements.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#DC2626] font-medium">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1"
          >
            New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="block w-full pl-9 pr-10 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-slate-400 focus:outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-[#DC2626] font-medium leading-relaxed">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="block w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-slate-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-[#DC2626] font-medium">
              {errors.confirmPassword.message}
            </p>
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
              Updating password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
}
