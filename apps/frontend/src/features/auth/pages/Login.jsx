import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { loginSchema } from '@vendorbridge/validators';
import { useAuthStore } from '../../../store/auth.store';

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const redirectForRole = (role) => {
    switch (role) {
      case 'BUYER':
        return '/buyer/dashboard';
      case 'SUPPLIER':
        return '/supplier/dashboard';
      case 'PROCUREMENT_MANAGER':
        return '/manager/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      
      // If remember me is set, we could write to localStorage, but refreshes are cookie based.
      // We can handle local storage flag if desired, but session cookies do the heavy lifting.
      
      navigate(redirectForRole(user.role));
    } catch (err) {
      setError(err || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          Welcome Back
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to VendorBridge
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

        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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
            <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-[#E5E7EB] text-[#714B67] focus:ring-[#714B67]/20"
            />
            <span className="text-xs font-medium text-slate-600">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-[#714B67] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#714B67] hover:bg-[#583b51] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#714B67]/20 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          New to VendorBridge?{' '}
          <Link to="/register" className="font-semibold text-[#714B67] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
