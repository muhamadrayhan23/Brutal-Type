import { useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import AuthLayout from "@/Components/Auth/AuthLayout";
import AuthCard from "@/Components/Auth/AuthCard";
import Input from "@/Components/Common/Input";
import Checkbox from "@/Components/Common/Checkbox";
import Button from "@/Components/Common/Button";

export default function Login() {
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onSuccess: () => reset("password"),
            onError: () => {
                if (errors.email) {
                    emailInput.current?.focus();
                } else if (errors.password) {
                    passwordInput.current?.focus();
                }
            },
        });
    };

    return (
        <>
            <Head title="Login" />

            <AuthLayout
                title="Welcome"
                subtitle="Sign in to practice, save your scores, and climb the leaderboard."
            >
                <AuthCard>
                    <form onSubmit={submit} noValidate>
                        <div className="space-y-5">
                            <Input
                                ref={emailInput}
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                icon={
                                    <Mail
                                        size={18}
                                        strokeWidth={2.5}
                                        aria-hidden="true"
                                    />
                                }
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                error={errors.email}
                                autoFocus
                                autoComplete="email"
                            />

                            <Input
                                ref={passwordInput}
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                icon={
                                    <LockKeyhole
                                        size={18}
                                        strokeWidth={2.5}
                                        aria-hidden="true"
                                    />
                                }
                                endAdornment={
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (visible) => !visible,
                                            )
                                        }
                                        className="text-white/70 transition-colors hover:text-cyan-neon focus:outline-none focus-visible:text-cyan-neon"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                }
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                error={errors.password}
                                autoComplete="current-password"
                            />

                            <Checkbox
                                name="remember"
                                label="Remember me"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />

                            <Button
                                type="submit"
                                loading={processing}
                                className="w-full"
                            >
                                {processing ? "Processing..." : "Login"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 border-t-3 border-white/20 pt-4 text-center">
                        <p className="font-mono text-sm text-white/60">
                            Don&apos;t have an account?{" "}
                            <Link
                                href={route("register")}
                                className="font-bold text-cyan-neon hover:underline"
                            >
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </AuthCard>
            </AuthLayout>
        </>
    );
}
