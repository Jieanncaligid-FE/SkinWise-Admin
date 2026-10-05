import { useState, type FormEvent } from 'react';
import logo from '../assets/skinwise-logo.png';
import { FormField } from '../components/FormField';
import { Icon } from '../components/Icons';
import { TextInput } from '../components/TextInput';
import { useAuth } from './context';

export default function Login() {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

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
		await new Promise((resolve) => window.setTimeout(resolve, 450));
		if (login(normalizedEmail, password, rememberMe)) {
			window.location.assign('/dashboard');
			return;
		}
		setError('The email address or password is incorrect.');
		setIsLoading(false);
	}

	return (
		<main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f8f3ed] px-4 py-8 text-[#514238]">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				<span className="absolute -left-[96px] -top-[92px] size-[250px] rounded-full bg-[#f6eee7]" />
				<span className="absolute -bottom-[100px] -right-[65px] size-[210px] rounded-full bg-[#f5ebe2]" />
				<span className="absolute -bottom-[48px] -right-[31px] h-[142px] w-[112px] rotate-[-18deg] rounded-[60%_40%_55%_45%] border border-[#ead9cb]" />
				<span className="absolute bottom-[18px] right-[37px] h-[72px] w-px origin-bottom rotate-[43deg] bg-[#ead9cb]" />
				<span className="absolute bottom-[47px] right-[58px] h-[40px] w-[54px] rotate-[-22deg] rounded-[100%_0_100%_0] border-t border-[#ead9cb]" />
			</div>

			<div className="w-full max-w-[386px]">
				<section className="min-h-[447px] rounded-[14px] border border-[#eee1d6] bg-[#fffdfa] px-[25px] pb-8 pt-0 shadow-[0_12px_28px_rgba(83,59,43,0.07)] sm:px-[25px]">
					<div className="flex h-[84px] justify-center overflow-hidden border-b border-[#f0e6de]">
						<img src={logo} alt="SkinWise" className="mt-[5px] h-auto w-[146px] shrink-0 object-contain" />
					</div>

					<h1 className="mt-[12px] font-serif text-[23px] font-normal leading-[1.2] text-[#493b33]">
						Sign in to SkinWise
					</h1>
					<p className="mt-[7px] text-[9px] leading-[1.5] text-[#806f64]">
						Welcome back. Enter your details to continue to your SkinWise admin.
					</p>

					<form className="mt-[16px]" onSubmit={handleSubmit} noValidate>
						<div className="grid gap-[12px]">
							<FormField id="email" label="Email address">
								<div className="relative">
									<Icon name="mail" aria-hidden="true" className="absolute left-[10px] top-1/2 size-[13px] -translate-y-1/2 text-[#aa9789]" />
									<TextInput
										id="email"
										type="email"
										autoComplete="username"
										value={email}
										onChange={(event) => setEmail(event.target.value)}
										placeholder="appskinwise@gmail.com"
										aria-invalid={Boolean(error && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())))}
										className="h-[33px] rounded-[5px] border-[#eadbd0] bg-[#fffdfa] pl-[29px] pr-3 text-[9px] shadow-none focus:ring-1"
									/>
								</div>
							</FormField>

							<FormField id="password" label="Password">
								<div className="relative">
									<Icon name="lock" aria-hidden="true" className="absolute left-[10px] top-1/2 size-[13px] -translate-y-1/2 text-[#aa9789]" />
									<TextInput
										id="password"
										type={showPassword ? 'text' : 'password'}
										autoComplete="current-password"
										value={password}
										onChange={(event) => setPassword(event.target.value)}
										aria-invalid={Boolean(error && !password)}
										className="h-[33px] rounded-[5px] border-[#eadbd0] bg-[#fffdfa] pl-[29px] pr-9 text-[10px] tracking-[1px] shadow-none focus:ring-1"
									/>
									<button
										type="button"
										aria-label={showPassword ? 'Hide password' : 'Show password'}
										onClick={() => setShowPassword((visible) => !visible)}
										className="absolute right-[9px] top-1/2 grid size-5 -translate-y-1/2 place-items-center text-[#aa9789]"
									>
										<Icon name="eye" className="size-[13px]" />
									</button>
								</div>
							</FormField>
						</div>

						<div className="mt-[11px] flex min-h-[18px] items-center justify-between gap-3 text-[8px]">
							<label className="flex cursor-pointer items-center gap-[6px] text-[#806f64]">
								<input
									type="checkbox"
									checked={rememberMe}
									onChange={(event) => setRememberMe(event.target.checked)}
									className="size-[11px] accent-[#bd7455]"
								/>
								Remember me
							</label>
							<button type="button" className="text-[#a96545] hover:text-[#875239]">
								Forgot password?
							</button>
						</div>

						{error && (
							<p role="alert" className="mt-2 text-[10px] leading-4 text-[#a84d39]">{error}</p>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="mt-[26px] flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[5px] bg-[#bc7354] text-[9px] font-medium text-white shadow-[0_3px_7px_rgba(137,77,52,0.18)] transition-colors hover:bg-[#aa6548] disabled:cursor-wait disabled:opacity-75"
						>
							{isLoading ? 'Signing in...' : 'Sign in to your workspace'}
							{!isLoading && <Icon name="arrow-right" aria-hidden="true" className="size-[11px]" />}
						</button>
					</form>

					<div className="mt-[12px] flex items-center justify-center gap-[7px] text-[8px] text-[#a08e81]">
						<span className="grid size-[17px] place-items-center rounded-full bg-[#f4e6dc] text-[#a96545]">
							<Icon name="shield" aria-hidden="true" className="size-[9px]" />
						</span>
						Secure, encrypted access for your practice
					</div>
				</section>

				<footer className="mt-[27px] flex items-center justify-between text-[7px] text-[#9a897d]">
					<span>© 2026 SkinWise</span>
					<div className="flex items-center gap-[22px]">
						<a href="#privacy" className="hover:text-[#715c4d]">Privacy</a>
						<a href="#terms" className="hover:text-[#715c4d]">Terms</a>
					</div>
				</footer>
			</div>
		</main>
	);
}