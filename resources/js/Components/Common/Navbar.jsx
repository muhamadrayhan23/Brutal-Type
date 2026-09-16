import { Link, router, usePage } from "@inertiajs/react";
import { Activity, LogOut, Menu, Settings, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { route } from "ziggy-js";

export default function Navbar() {
    const { auth, flash } = usePage().props;
    const user = auth?.user ?? null;
    const [open, setOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [welcomeOpen, setWelcomeOpen] = useState(Boolean(flash?.success));
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    useEffect(() => {
        setWelcomeOpen(Boolean(flash?.success));
    }, [flash?.success]);

    const close = () => {
        setOpen(false);
        setProfileMenuOpen(false);
    };

    const handleLogout = () => {
        router.post(route("logout"));
        setLogoutConfirmOpen(false);
    };

    const avatarUrl =
        user?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=000&color=fff`;

    return (
        <>
            <header className="border-b-4 border-white bg-void-black">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                        onClick={close}
                    >
                        <span className="grid h-10 w-10 place-items-center border-3 border-white bg-lime-electric font-display text-lg font-black text-black shadow-brutal-white">
                            BT
                        </span>
                        <span className="font-display text-2xl font-black tracking-tight">
                            BRUTAL
                            <span className="text-lime-electric">TYPE</span>
                        </span>
                    </Link>

                    <button
                        className="border-3 border-white p-2 md:hidden"
                        onClick={() => setOpen(!open)}
                        aria-label="Open menu"
                    >
                        {open ? (
                            <X size={22} strokeWidth={2.5} />
                        ) : (
                            <Menu size={22} strokeWidth={2.5} />
                        )}
                    </button>

                    <nav
                        className={`${open ? "flex" : "hidden"} absolute left-5 right-5 top-[78px] z-20 flex-col border-3 border-white bg-surface-dark p-4 shadow-brutal-lime md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
                    >
                        <Link
                            href="/"
                            className="flex items-center gap-2 border-b-2 border-white/30 px-3 py-3 font-bold hover:text-lime-electric md:border-0"
                            onClick={close}
                        >
                            <Activity size={17} strokeWidth={2.5} /> TEST
                        </Link>
                        <Link
                            href="/leaderboard"
                            className="flex items-center gap-2 border-b-2 border-white/30 px-3 py-3 font-bold hover:text-cyan-neon md:border-0"
                            onClick={close}
                        >
                            <Trophy size={17} strokeWidth={2.5} /> LEADERBOARD
                        </Link>

                        {user ? (
                            <div className="relative ml-0 md:ml-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setProfileMenuOpen(
                                            (current) => !current,
                                        )
                                    }
                                    className="flex items-center gap-3 border-3 border-white bg-surface-dark px-3 py-2 font-bold shadow-brutal-white hover:bg-lime-electric hover:text-black"
                                >
                                    <img
                                        src={avatarUrl}
                                        alt={user.name}
                                        className="h-8 w-8 border-2 border-white object-cover"
                                    />
                                    <span className="hidden sm:inline">
                                        {user.name}
                                    </span>
                                </button>

                                {profileMenuOpen && (
                                    <div className="absolute right-0 top-full z-30 mt-3 w-56 border-3 border-white bg-surface-dark p-2 shadow-brutal-lime">
                                        <Link
                                            href="/stats"
                                            onClick={close}
                                            className="flex items-center gap-2 border-b-2 border-white/20 px-3 py-3 font-bold text-white hover:text-lime-electric"
                                        >
                                            <Activity
                                                size={16}
                                                strokeWidth={2.5}
                                            />{" "}
                                            USER STATS
                                        </Link>
                                        <Link
                                            href="/profile/option"
                                            onClick={close}
                                            className="flex items-center gap-2 border-b-2 border-white/20 px-3 py-3 font-bold text-white hover:text-cyan-neon"
                                        >
                                            <Settings
                                                size={16}
                                                strokeWidth={2.5}
                                            />{" "}
                                            OPTION
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                setLogoutConfirmOpen(true);
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-3 text-left font-bold text-white hover:text-red-400"
                                        >
                                            <LogOut
                                                size={16}
                                                strokeWidth={2.5}
                                            />{" "}
                                            LOGOUT
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="border-3 border-white px-4 py-2 font-bold shadow-brutal-white hover:bg-lime-electric hover:text-black"
                                onClick={close}
                            >
                                LOGIN
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <Modal
                open={Boolean(welcomeOpen && flash?.success)}
                onClose={() => setWelcomeOpen(false)}
                title="Success"
                actions={
                    <Button type="button" onClick={() => setWelcomeOpen(false)}>
                        Continue
                    </Button>
                }
            >
                <p>{flash?.success}</p>
            </Modal>

            <Modal
                open={logoutConfirmOpen}
                onClose={() => setLogoutConfirmOpen(false)}
                title="Logout"
                actions={
                    <>
                        <Button
                            type="button"
                            variant="dark"
                            onClick={() => setLogoutConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to log out from BrutalType?</p>
            </Modal>
        </>
    );
}
