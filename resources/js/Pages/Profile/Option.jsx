import { useForm, usePage } from "@inertiajs/react";
import { ImagePlus, LockKeyhole, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AppLayout from "../../Layouts/AppLayout";
import Button from "../../Components/Common/Button";
import Modal from "../../Components/Common/Modal";

export default function Option({ user: profileUser }) {
    const { auth } = usePage().props;
    const user = profileUser || auth?.user || { name: "", email: "" };
    const [avatarFileName, setAvatarFileName] = useState("");

    const initialAvatar =
        user.avatar_url ||
        (user.avatar ? `/profile/${user.avatar.split("/").pop()}` : "");

    const [avatarPreview, setAvatarPreview] = useState(initialAvatar);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        avatar: null,
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const deleteAvatarForm = useForm({});

    useEffect(() => {
        return () => {
            if (avatarPreview && avatarPreview.startsWith("blob:")) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const submit = (event) => {
        event.preventDefault();
        post("/profile/option", { forceFormData: true });
    };

    const deleteAvatar = () => {
        deleteAvatarForm.post("/profile/avatar", {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setAvatarPreview("");
                setAvatarFileName("");
                setData("avatar", null);
            },
        });
    };

    return (
        <AppLayout title="Tune your identity.">
            <div>
                <form
                    onSubmit={submit}
                    className="space-y-5 border-3 border-white bg-surface-dark p-6 shadow-brutal-white"
                >
                    <div className="border-b-2 border-white/25 pb-5">
                        <p className="font-mono text-xs uppercase text-lime-electric">
                            ACCOUNT SETTINGS
                        </p>
                        <h2 className="font-display text-4xl font-black uppercase">
                            Edit profile
                        </h2>
                    </div>

                    <Field
                        label="DISPLAY NAME"
                        value={data.name}
                        onChange={(event) =>
                            setData("name", event.target.value)
                        }
                        error={errors.name}
                    />

                    <Field
                        label="EMAIL ADDRESS"
                        type="email"
                        value={data.email}
                        onChange={(event) =>
                            setData("email", event.target.value)
                        }
                        error={errors.email}
                    />

                    <div className="border-3 border-white bg-black p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="h-28 w-28 shrink-0 overflow-hidden border-3 border-white bg-surface-dark">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt={`${user.name || "User"} avatar`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="grid h-full w-full place-items-center font-display text-4xl font-black text-lime-electric">
                                        {user.name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="font-mono text-xs uppercase text-cyan-neon">
                                    PROFILE AVATAR
                                </p>
                                <p className="mt-2 font-display text-2xl font-black uppercase">
                                    {user.name}
                                </p>
                                <p className="mt-1 font-mono text-xs text-white/50">
                                    {avatarFileName ||
                                        (user.avatar
                                            ? "Current profile image"
                                            : "No custom image uploaded")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <label className="block font-mono text-xs font-bold">
                        <span className="mb-2 block">AVATAR IMAGE</span>
                        <span className="flex cursor-pointer items-center gap-3 border-3 border-white bg-black p-4 hover:border-lime-electric">
                            <ImagePlus size={20} strokeWidth={2.5} />
                            <span className="truncate">
                                {avatarFileName || "Choose new image"}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(event) => {
                                    const file =
                                        event.target.files?.[0] || null;
                                    setData("avatar", file);
                                    setAvatarFileName(file?.name || "");
                                    if (file) {
                                        setAvatarPreview(
                                            URL.createObjectURL(file),
                                        );
                                    }
                                }}
                            />
                        </span>
                        {errors.avatar && (
                            <span className="mt-2 block text-xs text-red-400">
                                {errors.avatar}
                            </span>
                        )}
                    </label>

                    {(user.avatar ||
                        (avatarPreview &&
                            !avatarPreview.startsWith("blob:"))) && (
                        <Button
                            type="button"
                            variant="danger"
                            onClick={() => setDeleteModalOpen(true)}
                            disabled={processing || deleteAvatarForm.processing}
                        >
                            <Trash2 size={16} strokeWidth={2.5} /> Delete avatar
                        </Button>
                    )}

                    <div className="border-t-2 border-white/25 pt-5">
                        <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase text-cyan-neon">
                            <LockKeyhole size={16} strokeWidth={2.5} /> Update
                            password
                        </p>
                        <div className="space-y-4">
                            <Field
                                label="CURRENT PASSWORD"
                                type="password"
                                value={data.current_password}
                                onChange={(event) =>
                                    setData(
                                        "current_password",
                                        event.target.value,
                                    )
                                }
                                error={errors.current_password}
                            />
                            <Field
                                label="NEW PASSWORD"
                                type="password"
                                value={data.new_password}
                                onChange={(event) =>
                                    setData("new_password", event.target.value)
                                }
                                error={errors.new_password}
                            />
                            <Field
                                label="CONFIRM NEW PASSWORD"
                                type="password"
                                value={data.new_password_confirmation}
                                onChange={(event) =>
                                    setData(
                                        "new_password_confirmation",
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        loading={processing}
                        className="w-full"
                    >
                        <Save size={16} strokeWidth={2.5} /> Save changes
                    </Button>
                </form>
            </div>

            <Modal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete avatar?"
                actions={
                    <>
                        <Button
                            type="button"
                            variant="dark"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={deleteAvatarForm.processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={deleteAvatar}
                            loading={deleteAvatarForm.processing}
                        >
                            Delete avatar
                        </Button>
                    </>
                }
            >
                This will permanently remove your current profile image. Are you
                sure you want to continue?
            </Modal>
        </AppLayout>
    );
}

function Field({ label, error, ...props }) {
    return (
        <label className="block font-mono text-xs font-bold">
            <span className="mb-2 block">{label}</span>
            <input className="brutal-input w-full px-4 py-3" {...props} />
            {error && (
                <span className="mt-2 block text-xs text-red-400">{error}</span>
            )}
        </label>
    );
}
