import QRCode from "react-qr-code";
import toast from "react-hot-toast";

function QRModal({ queue, onClose }) {
    if (!queue) return null;

    const joinUrl =
        `${window.location.origin}/join/${queue._id}`;

    async function handleCopy() {
        await navigator.clipboard.writeText(joinUrl);
        toast.success("Join link copied");
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

                <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-950">
                    {queue.name}
                </h2>

                <p className="mt-2 text-center text-sm text-slate-500">
                    Scan to join this queue
                </p>

                <div className="mt-6 flex justify-center rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <QRCode value={joinUrl} size={220} />
                </div>
                <button
                    onClick={handleCopy}
                    className="mt-6 w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                >
                    Copy Join Link
                </button>

                <p className="mt-5 break-all rounded-2xl bg-slate-50 p-3 text-center text-xs text-slate-500">
                    {joinUrl}
                </p>

                <button
                    onClick={onClose}
                    className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                    Close
                </button>

            </div>
        </div>
    );
}

export default QRModal;
