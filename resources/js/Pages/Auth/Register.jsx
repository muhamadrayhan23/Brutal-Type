import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";

import AuthLayout from "@/Components/Auth/AuthLayout";
import AuthCard from "@/Components/Auth/AuthCard";
import PasswordStrengthMeter from "@/Components/Auth/PasswordStrengthMeter";
import Input from "@/Components/Common/Input";
import Button from "@/Components/Common/Button";

/**
 * Register page.
 * Sends optional guest test result fields (wpm, accuracy, etc.)
 * so the first score is synchronized automatically after account creation.
 */
export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        // Field opsional untuk sinkronisasi skor guest
        wpm: null,
        raw_wpm: null,
        accuracy: null,
        consistency: null,
        time_mode: null,
        word_mode: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onSuccess: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Register" />

            <AuthLayout
                title="Create account"
                subtitle="Sign up to save your practice progress and join the leaderboard."
            >
                <AuthCard>
                    <form onSubmit={submit} noValidate>
                        <div className="space-y-5">
                            <Input
                                label="Name"
                                type="text"
                                name="name"
                                placeholder="Your name"
                                icon={
                                    <UserRound
                                        size={18}
                                        strokeWidth={2.5}
                                        aria-hidden="true"
                                    />
                                }
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={errors.name}
                                autoFocus
                                autoComplete="name"
                            />

                            <Input
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
                                autoComplete="email"
                            />

                            <div>
                                <Input
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="At least 8 characters"
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
                                    autoComplete="new-password"
                                />
                                <PasswordStrengthMeter
                                    password={data.password}
                                />
                            </div>

                            <Input
                                label="Confirm password"
                                type={
                                    showPasswordConfirmation
                                        ? "text"
                                        : "password"
                                }
                                name="password_confirmation"
                                placeholder="Repeat password"
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
                                            setShowPasswordConfirmation(
                                                (visible) => !visible,
                                            )
                                        }
                                        className="text-white/70 transition-colors hover:text-cyan-neon focus:outline-none focus-visible:text-cyan-neon"
                                        aria-label={
                                            showPasswordConfirmation
                                                ? "Hide password confirmation"
                                                : "Show password confirmation"
                                        }
                                    >
                                        {showPasswordConfirmation ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                }
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                error={errors.password_confirmation}
                                autoComplete="new-password"
                            />

                            <Button
                                type="submit"
                                loading={processing}
                                className="w-full"
                            >
                                {processing ? "Registering..." : "Register"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 border-t-3 border-white/20 pt-4 text-center">
                        <p className="font-mono text-sm text-white/60">
                            Already have an account?{" "}
                            <Link
                                href={route("login")}
                                className="font-bold text-cyan-neon hover:underline"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </AuthCard>
            </AuthLayout>
        </>
    );
}
