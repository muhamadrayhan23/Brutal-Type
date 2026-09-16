import { useForm, usePage } from "@inertiajs/react";
import { ImagePlus, LockKeyhole, Save } from "lucide-react";
import { useState } from "react";
import AppLayout from "../../Layouts/AppLayout";
import Button from "../../Components/Common/Button";

export default function ProfileEdit({ user: profileUser }) {
    const { auth } = usePage().props;
    const user = profileUser || auth?.user || { name: "", email: "" };
    const [avatarFileName, setAvatarFileName] = useState("");
    const { data, setData, post, processing, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        avatar: null,
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    const submit = (event) => {
        event.preventDefault();
        post("/profile/option", { forceFormData: true });
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
                                }}
                            />
                        </span>
                    </label>
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
