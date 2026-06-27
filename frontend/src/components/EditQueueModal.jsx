function EditQueueModal({
    queue,
    editForm,
    setEditForm,
    onClose,
    onSave,
    isSaving = false
}) {
    if (!queue) return null;

    function handleChange(e) {
        const { name, value } = e.target;

        setEditForm({
            ...editForm,
            [name]: value
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition">

                <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-950">
                    Edit Queue
                </h2>

                <p className="mt-2 text-center text-sm text-slate-500">
                    Update your queue details.
                </p>

                <div className="mt-6 space-y-4">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Queue Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleChange}
                            disabled={isSaving}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={editForm.location}
                            onChange={handleChange}
                            disabled={isSaving}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Average Service Time
                        </label>

                        <input
                            type="number"
                            name="avgServiceTime"
                            value={editForm.avgServiceTime}
                            onChange={handleChange}
                            disabled={isSaving}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />
                    </div>

                </div>

                <div className="mt-8 flex gap-3">

                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default EditQueueModal;
