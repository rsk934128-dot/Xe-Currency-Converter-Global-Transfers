import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  Fingerprint,
  ScanFace,
  Smartphone,
  Sparkles,
  AlertCircle,
  KeyRound,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import {
  checkBiometricSupport,
  authenticateWithBiometrics,
  registerBiometricPasskey,
  getEnrolledBiometricUser,
  BiometricUser
} from '../utils/biometricAuth';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Alex Morgan');
  const [enableBiometricsOnRegister, setEnableBiometricsOnRegister] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<
    'idle' | 'scanning' | 'success' | 'error'
  >('idle');
  const [biometricError, setBiometricError] = useState<string | null>(null);
  const [enrolledUser, setEnrolledUser] = useState<BiometricUser | null>(null);
  const [biometryType, setBiometryType] = useState<
    'touchID' | 'faceID' | 'windowsHello' | 'generic'
  >('touchID');
  const [isBiometricSupported, setIsBiometricSupported] = useState(true);

  // Sync mode with props
  useEffect(() => {
    setMode(initialMode);
    setBiometricStatus('idle');
    setBiometricError(null);
  }, [initialMode, isOpen]);

  // Check hardware biometric support and enrolled users on mount / open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    checkBiometricSupport().then((support) => {
      if (!isMounted) return;
      setIsBiometricSupported(support.isSupported);
      setBiometryType(support.biometryType);
      const user = support.enrolledUser || getEnrolledBiometricUser();
      setEnrolledUser(user);
      if (user?.email && mode === 'login') {
        setEmail(user.email);
        setName(user.name);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const getBiometricName = () => {
    switch (biometryType) {
      case 'faceID':
        return 'Face ID';
      case 'touchID':
        return 'Touch ID';
      case 'windowsHello':
        return 'Windows Hello';
      default:
        return 'Touch ID / Face ID';
    }
  };

  const getBiometricIcon = (className: string = 'w-5 h-5') => {
    if (biometryType === 'faceID') {
      return <ScanFace className={className} />;
    }
    return <Fingerprint className={className} />;
  };

  // Standard form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBiometricError(null);

    const userName = mode === 'register' ? name : (enrolledUser?.name || 'Alex Morgan');

    // If registering and user opted into biometrics, enroll them
    if (mode === 'register' && enableBiometricsOnRegister) {
      try {
        await registerBiometricPasskey({ name: userName, email });
      } catch (err) {
        console.warn('Biometric registration optional warning:', err);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        name: userName,
        email
      });
      onClose();
    }, 600);
  };

  // Native Biometric Authentication Trigger
  const handleBiometricLogin = async () => {
    setBiometricStatus('scanning');
    setBiometricError(null);

    try {
      // Trigger WebAuthn Biometrics with native prompt
      const result = await authenticateWithBiometrics(email);

      if (result.success && result.user) {
        setBiometricStatus('success');

        // Optional haptic feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([40, 60, 40]);
        }

        setTimeout(() => {
          onSuccess({
            name: result.user!.name,
            email: result.user!.email
          });
          onClose();
        }, 900);
      } else {
        setBiometricStatus('error');
        setBiometricError(result.error || 'Biometric verification was not completed. You can try again or use your password.');
      }
    } catch (err: any) {
      setBiometricStatus('error');
      setBiometricError(err?.message || 'Biometric sensor error. Please use password to sign in.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="auth-modal-container"
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 relative"
      >
        {/* Header */}
        <div className="bg-[#0a146e] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black italic tracking-tight">xe</span>
            <div className="h-5 w-px bg-white/20 mx-2" />
            <span className="font-bold text-base">
              {mode === 'login' ? 'Sign in to Xe' : 'Create Free Xe Account'}
            </span>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Biometric Scanning Overlay Animation */}
        {biometricStatus === 'scanning' && (
          <div
            id="biometric-scanning-screen"
            className="p-8 flex flex-col items-center justify-center text-center space-y-6 bg-gradient-to-b from-blue-50/70 to-white"
          >
            <div className="relative">
              {/* Outer pulsing rings */}
              <div className="w-24 h-24 rounded-full bg-blue-100 animate-ping absolute inset-0 opacity-40" />
              <div className="w-24 h-24 rounded-full bg-[#0071eb]/15 flex items-center justify-center relative border-2 border-[#0071eb] shadow-lg">
                <div className="text-[#0071eb] animate-pulse">
                  {getBiometricIcon('w-12 h-12')}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 max-w-xs">
              <h3 className="text-lg font-black text-slate-900">
                Verifying with {getBiometricName()}
              </h3>
              <p className="text-xs text-slate-500">
                Touch your sensor or look at your camera to securely authenticate your account.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0071eb]" />
              <span>WebAuthn FIDO2 Protected</span>
            </div>

            <button
              onClick={() => setBiometricStatus('idle')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline pt-2"
            >
              Cancel and use password
            </button>
          </div>
        )}

        {/* Biometric Success Overlay */}
        {biometricStatus === 'success' && (
          <div
            id="biometric-success-screen"
            className="p-8 flex flex-col items-center justify-center text-center space-y-4 bg-white"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg border-2 border-emerald-400 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                {getBiometricName()} Verified!
              </h3>
              <p className="text-xs text-emerald-600 font-semibold">
                Logging you into your Xe account securely...
              </p>
            </div>
          </div>
        )}

        {/* Normal Login / Register Form View */}
        {biometricStatus !== 'scanning' && biometricStatus !== 'success' && (
          <div className="p-6 space-y-5">
            {/* Biometric Quick Login Banner (in Login mode) */}
            {mode === 'login' && isBiometricSupported && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0071eb] text-white flex items-center justify-center shadow-xs">
                      {getBiometricIcon('w-5 h-5')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">
                          {getBiometricName()} Login
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                          Device Ready
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {enrolledUser?.email
                          ? `Enrolled for ${enrolledUser.name}`
                          : 'Sign in instantly without entering password'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  id="auth-biometric-signin-btn"
                  onClick={handleBiometricLogin}
                  className="w-full py-2.5 px-4 bg-[#0a146e] hover:bg-[#12249e] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
                >
                  {getBiometricIcon('w-4 h-4 text-blue-300')}
                  <span>Sign in with {getBiometricName()}</span>
                </button>
              </div>
            )}

            {/* Error Message if biometric fails */}
            {biometricError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{biometricError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBiometricError(null)}
                  className="text-rose-500 hover:text-rose-700 font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Divider between biometric and standard credentials */}
            {mode === 'login' && isBiometricSupported && (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  or sign in with password
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      id="auth-input-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0071eb]"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-input-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0071eb]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">
                    Password
                  </label>
                  {mode === 'login' && (
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset link sent to your email.');
                      }}
                      className="text-xs text-[#0071eb] font-semibold hover:underline"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-input-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0071eb]"
                    required
                  />
                </div>
              </div>

              {/* In Register mode: Opt-in to TouchID/FaceID enrollment */}
              {mode === 'register' && isBiometricSupported && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="auth-enable-biometrics-checkbox"
                    checked={enableBiometricsOnRegister}
                    onChange={(e) => setEnableBiometricsOnRegister(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#0071eb] focus:ring-[#0071eb]"
                  />
                  <label
                    htmlFor="auth-enable-biometrics-checkbox"
                    className="text-xs text-slate-700 cursor-pointer select-none"
                  >
                    <span className="font-bold block text-slate-900 flex items-center gap-1.5">
                      {getBiometricIcon('w-3.5 h-3.5 text-[#0071eb]')}
                      Enable {getBiometricName()} on this device
                    </span>
                    Sign in with 1-touch passkey in the future without passwords.
                  </label>
                </div>
              )}

              <button
                type="submit"
                id="auth-submit-btn"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0071eb] hover:bg-[#005ec4] text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : mode === 'login' ? (
                  <span>Sign In & Access Live Rates</span>
                ) : (
                  <span>Create Free Account</span>
                )}
              </button>

              <div className="text-center pt-1">
                {mode === 'login' ? (
                  <p className="text-xs text-slate-500">
                    Don't have an Xe account?{' '}
                    <button
                      type="button"
                      id="auth-toggle-register-btn"
                      onClick={() => setMode('register')}
                      className="text-[#0071eb] font-bold hover:underline"
                    >
                      Register for free
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Already registered?{' '}
                    <button
                      type="button"
                      id="auth-toggle-login-btn"
                      onClick={() => setMode('login')}
                      className="text-[#0071eb] font-bold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </form>

            {/* Security Guarantee Badge */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bank-grade 256-bit encryption & FIDO2 passkeys</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

