import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Building, Landmark, ChevronRight, ChevronLeft } from 'lucide-react';
import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
} from '@vendorbridge/validators';
import { useAuthStore } from '../../../store/auth.store';

export default function Register() {
  const registerAction = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Consolidated form state values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    industry: '',
    role: 'SUPPLIER', // Default
  });

  // Step 1 Form
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = useForm({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: formData,
  });

  // Step 2 Form
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: formData,
  });

  // Step 3 Form
  const {
    handleSubmit: handleSubmit3,
  } = useForm({
    resolver: zodResolver(registerStep3Schema),
    defaultValues: { role: formData.role },
  });

  const redirectForRole = (role) => {
    return '/dashboard';
  };

  const onStep1Submit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStep2Submit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const onStep3Submit = () => {
    setStep(4);
  };

  const handleFinalSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const submitData = { ...formData };
      delete submitData.confirmPassword;
      const user = await registerAction(submitData);
      navigate(redirectForRole(user.role));
    } catch (err) {
      setError(err || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const renderProgress = () => {
    const steps = ['Personal', 'Organization', 'Role', 'Review'];
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
          <span>Step {step} of 4</span>
          <span>{steps[step - 1]}</span>
        </div>
        <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#714B67] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          Create Account
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Join the VendorBridge procurement network
        </p>
      </div>

      {renderProgress()}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#DC2626] font-medium">
          {error}
        </div>
      )}

      {/* STEP 1: Personal Details */}
      {step === 1 && (
        <form className="space-y-4" onSubmit={handleSubmit1(onStep1Submit)}>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register1('name')}
              className="block w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none"
              placeholder="John Doe"
            />
            {errors1.name && (
              <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors1.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register1('email')}
              className="block w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none"
              placeholder="john@company.com"
            />
            {errors1.email && (
              <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors1.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register1('password')}
                className="block w-full pl-3 pr-10 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none"
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
            {errors1.password && (
              <p className="mt-1 text-xs text-[#DC2626] font-medium leading-relaxed">{errors1.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register1('confirmPassword')}
              className="block w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none"
              placeholder="••••••••"
            />
            {errors1.confirmPassword && (
              <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors1.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#714B67] hover:bg-[#583b51] transition-colors cursor-pointer"
          >
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </form>
      )}

      {/* STEP 2: Organization Info */}
      {step === 2 && (
        <form className="space-y-4" onSubmit={handleSubmit2(onStep2Submit)}>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Company Name
            </label>
            <input
              type="text"
              {...register2('companyName')}
              className="block w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none"
              placeholder="Acme Global Inc"
            />
            {errors2.companyName && (
              <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors2.companyName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              {...register2('phone')}
              className="block w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none"
              placeholder="+15550199"
            />
            {errors2.phone && (
              <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors2.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Industry
            </label>
            <input
              type="text"
              {...register2('industry')}
              className="block w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none"
              placeholder="Manufacturing / Logistics"
            />
            {errors2.industry && (
              <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors2.industry.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/2 flex justify-center items-center py-2 px-4 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </button>
            <button
              type="submit"
              className="w-1/2 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#714B67] hover:bg-[#583b51] transition-colors cursor-pointer"
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Role Selection */}
      {step === 3 && (
        <form className="space-y-4" onSubmit={handleSubmit3(onStep3Submit)}>
          <span className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 text-center">
            Choose Your Platform Role
          </span>

          <div className="space-y-3">
            {/* Buyer Card */}
            <div
              onClick={() => selectRole('BUYER')}
              className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                formData.role === 'BUYER'
                  ? 'border-[#714B67] bg-[#F5EEF4]'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white border border-[#E5E7EB] rounded-lg">
                  <User className="h-5 w-5 text-[#714B67]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Buyer</p>
                  <p className="text-xs text-slate-500">Search products and publish RFQs</p>
                </div>
              </div>
              <input
                type="radio"
                name="role"
                checked={formData.role === 'BUYER'}
                onChange={() => {}}
                className="text-[#714B67] focus:ring-[#714B67]/20"
              />
            </div>

            {/* Supplier Card */}
            <div
              onClick={() => selectRole('SUPPLIER')}
              className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                formData.role === 'SUPPLIER'
                  ? 'border-[#714B67] bg-[#F5EEF4]'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white border border-[#E5E7EB] rounded-lg">
                  <Building className="h-5 w-5 text-[#714B67]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Supplier</p>
                  <p className="text-xs text-slate-500">Submit quotes and process orders</p>
                </div>
              </div>
              <input
                type="radio"
                name="role"
                checked={formData.role === 'SUPPLIER'}
                onChange={() => {}}
                className="text-[#714B67] focus:ring-[#714B67]/20"
              />
            </div>

            {/* Procurement Manager Card */}
            <div
              onClick={() => selectRole('PROCUREMENT_MANAGER')}
              className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                formData.role === 'PROCUREMENT_MANAGER'
                  ? 'border-[#714B67] bg-[#F5EEF4]'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white border border-[#E5E7EB] rounded-lg">
                  <Landmark className="h-5 w-5 text-[#714B67]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Procurement Manager</p>
                  <p className="text-xs text-slate-500">Oversee RFQs, vendors, and policies</p>
                </div>
              </div>
              <input
                type="radio"
                name="role"
                checked={formData.role === 'PROCUREMENT_MANAGER'}
                onChange={() => {}}
                className="text-[#714B67] focus:ring-[#714B67]/20"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/2 flex justify-center items-center py-2 px-4 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </button>
            <button
              type="submit"
              className="w-1/2 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#714B67] hover:bg-[#583b51] transition-colors cursor-pointer"
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Review & Submit */}
      {step === 4 && (
        <div className="space-y-4">
          <span className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 text-center">
            Review Your Account Details
          </span>

          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
              <span className="text-slate-500">Name</span>
              <span className="font-semibold text-[#111827]">{formData.name}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
              <span className="text-slate-500">Email</span>
              <span className="font-semibold text-[#111827]">{formData.email}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
              <span className="text-slate-500">Company</span>
              <span className="font-semibold text-[#111827]">{formData.companyName}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
              <span className="text-slate-500">Phone</span>
              <span className="font-semibold text-[#111827]">{formData.phone}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
              <span className="text-slate-500">Industry</span>
              <span className="font-semibold text-[#111827]">{formData.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Role Option</span>
              <span className="font-semibold text-[#714B67]">
                {formData.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={loading}
              className="w-1/2 flex justify-center items-center py-2 px-4 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading}
              className="w-1/2 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#714B67] hover:bg-[#583b51] transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registering...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      )}

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#714B67] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
