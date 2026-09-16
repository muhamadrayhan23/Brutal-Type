import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, actions }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(event) =>
                event.target === event.currentTarget && onClose?.()
            }
        >
            <div className="w-full max-w-lg border-4 border-white bg-surface-dark p-6 shadow-brutal-lime">
                <div className="flex items-start justify-between gap-4 border-b-2 border-white/25 pb-4">
                    <h2
                        id="modal-title"
                        className="font-display text-3xl font-black uppercase"
                    >
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="border-2 border-white p-1 hover:bg-lime-electric hover:text-black"
                        aria-label="Close"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="py-6 font-mono text-sm leading-6 text-white/75">
                    {children}
                </div>
                {actions && (
                    <div className="flex flex-wrap justify-end gap-3 border-t-2 border-white/25 pt-4">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
