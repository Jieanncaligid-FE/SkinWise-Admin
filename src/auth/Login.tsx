import { useState, type FormEvent } from 'react';
import logo from '../assets/skinwise-logo.png';
import { ApiError } from '../api/client';
import { FormField } from '../components/FormField';
import { Icon } from '../components/Icons';
import { TextInput } from '../components/TextInput';
import { useAuth } from './context';

function formatRetryAfter(retryAfterSec?: number): string {
	if (retryAfterSec === undefined) return 'a little while';
	if (retryAfterSec < 60) return `${retryAfterSec} second${retryAfterSec === 1 ? '' : 's'}`;
	const minutes = Math.ceil(retryAfterSec / 60);
	return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

export default function Login() {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const sessionExpired = new URLSearchParams(window.location.search).get('expired') === '1';

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError('');

		const normalizedEmail = email.trim();
		if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
			setError('Enter a valid email address.');
			return;
		}
		if (!password) {
			setError('Enter your password.');
			return;
		}

		setIsLoading(true);
		try {
			await login(normalizedEmail, password);
			window.location.assign('/dashboard');
		} catch (cause) {
			if (cause instanceof ApiError) {
				if (cause.status === 401) {
					setError('The email address or password is incorrect.');
				} else if (cause.status === 403) {
					setError('This admin account is not allowed from this website.');
				} else if (cause.status === 429) {
					setError(`Too many attempts. Try again in ${formatRetryAfter(cause.retryAfterSec)}.`);
				} else if (cause.status === 0) {
					setError('Cannot reach the server. Check your connection and try again.');
				} else {
					setError('Something went wrong. Please try again.');
				}
			} else {
				setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.');
			}
			setIsLoading(false);
		}
	}

	return (
		<main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FAF5F4] px-4 py-8 text-[#1E0C08]">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				<span className="absolute -left-[96px] -top-[92px] size-[250px] rounded-full bg-[#F5ECE9]" />
				<span className="absolute -bottom-[100px] -right-[65px] size-[210px] rounded-full bg-[#F5ECE9]" />
				<span className="absolute -bottom-[48px] -right-[31px] h-[142px] w-[112px] rotate-[-18deg] rounded-[60%_40%_55%_45%] border border-[#BA867B]/30" />
				<span className="absolute bottom-[18px] right-[37px] h-[72px] w-px origin-bottom rotate-[43deg] bg-[#BA867B]/30" />
				<span className="absolute bottom-[47px] right-[58px] h-[40px] w-[54px] rotate-[-22deg] rounded-[100%_0_100%_0] border-t border-[#BA867B]/30" />
			</div>

			<div className="w-full max-w-[386px]">
				<section className="min-h-[447px] rounded-[14px] border border-[#BA867B]/30 bg-[#ffffff] px-[25px] pb-8 pt-0 shadow-[0_12px_28px_rgba(83,59,43,0.07)] sm:px-[25px]">
					<div className="flex h-[84px] justify-center overflow-hidden border-b border-[#BA867B]/30">
						<img src={logo} alt="SkinWise" className="mt-[5px] h-auto w-[146px] shrink-0 object-contain" />
					</div>

					<h1 className="mt-[12px] font-serif text-[23px] font-normal leading-[1.2] text-[#1E0C08]">
						Sign in to SkinWise
					</h1>
					<p className="mt-[7px] text-[9px] leading-[1.5] text-[#1E0C08]/60">
						Welcome back. Enter your details to continue to your SkinWise admin.
					</p>

					<form className="mt-[16px]" onSubmit={handleSubmit} noValidate>
						<div className="grid gap-[12px]">
							<FormField id="email" label="Email address">
								<div className="relative">
									<Icon name="mail" aria-hidden="true" className="absolute left-[10px] top-1/2 size-[13px] -translate-y-1/2 text-[#1E0C08]/60" />
									<TextInput
										id="email"
										type="email"
										autoComplete="username"
										value={email}
										onChange={(event) => setEmail(event.target.value)}
										placeholder="name@company.com"
										aria-invalid={Boolean(error && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())))}
										className="h-[33px] rounded-[5px] border-[#BA867B]/30 bg-[#ffffff] pl-[29px] pr-3 text-[9px] shadow-none focus:ring-1"
									/>
								</div>
							</FormField>

							<FormField id="password" label="Password">
								<div className="relative">
									<Icon name="lock" aria-hidden="true" className="absolute left-[10px] top-1/2 size-[13px] -translate-y-1/2 text-[#1E0C08]/60" />
									<TextInput
										id="password"
										type={showPassword ? 'text' : 'password'}
										autoComplete="current-password"
										value={password}
										onChange={(event) => setPassword(event.target.value)}
										aria-invalid={Boolean(error && !password)}
										className="h-[33px] rounded-[5px] border-[#BA867B]/30 bg-[#ffffff] pl-[29px] pr-9 text-[10px] tracking-[1px] shadow-none focus:ring-1"
									/>
									<button
										type="button"
										aria-label={showPassword ? 'Hide password' : 'Show password'}
										onClick={() => setShowPassword((visible) => !visible)}
										className="absolute right-[9px] top-1/2 grid size-5 -translate-y-1/2 place-items-center text-[#1E0C08]/60"
									>
										<Icon name="eye" className="size-[13px]" />
									</button>
								</div>
							</FormField>
						</div>

						<p className="mt-[11px] min-h-[18px] text-[8px] leading-[1.5] text-[#1E0C08]/60">
							Forgot your password? Contact the person responsible for managing the backend to reset your admin password.
						</p>

						{sessionExpired && !error && (
							<p role="status" className="mt-2 rounded-[5px] border border-[#BA867B]/30 bg-[#F5ECE9] px-3 py-2 text-[10px] leading-4 text-[#1E0C08]">
								Your session expired. Please log in again.
							</p>
						)}

						{error && (
							<p role="alert" className="mt-2 text-[10px] leading-4 text-[#a84d39]">{error}</p>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="mt-[26px] flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[5px] bg-[#BA867B] text-[9px] font-medium text-white shadow-[0_3px_7px_rgba(30,12,8,0.18)] transition-colors hover:bg-[#BA867B]/85 disabled:cursor-wait disabled:opacity-75"
						>
							{isLoading ? 'Signing in...' : 'Sign in to your workspace'}
							{!isLoading && <Icon name="arrow-right" aria-hidden="true" className="size-[11px]" />}
						</button>
					</form>

					<div className="mt-[12px] flex items-center justify-center gap-[7px] text-[8px] text-[#1E0C08]/60">
						<span className="grid size-[17px] place-items-center rounded-full bg-[#F5ECE9] text-[#BA867B]">
							<Icon name="shield" aria-hidden="true" className="size-[9px]" />
						</span>
						Secure, encrypted access for your practice
					</div>
				</section>

				<footer className="mt-[27px] flex items-center justify-between text-[7px] text-[#1E0C08]/60">
					<span>© 2026 SkinWise</span>
					<div className="flex items-center gap-[22px]">
						<a href="#privacy" className="hover:text-[#1E0C08]">Privacy</a>
						<a href="#terms" className="hover:text-[#1E0C08]">Terms</a>
					</div>
				</footer>
			</div>
		</main>
	);
}