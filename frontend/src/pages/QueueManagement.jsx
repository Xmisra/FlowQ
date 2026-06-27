import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';


const QueueManagement = () => {

  const { queueId } = useParams();
  const [queue, setQueue] = useState(null);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const emptyStats = {
    currentCustomer: {},
    totalWaiting: 0,
    nextCustomer: {},
    totalCompleted: 0,
    totalSkipped: 0
  };

  const emptyAnalytics = {
    total: 0,
    totalWaiting: 0,
    totalCalled: 0,
    totalCompleted: 0,
    totalSkipped: 0
  };

  function getErrorMessage(err, fallback = "Something went wrong") {
    return err.response?.data?.error || err.response?.data?.message || fallback;
  }

  const hasCurrentCustomer = Boolean(stats?.currentCustomer?.tokenNumber);
  const waitingCustomers = stats?.totalWaiting ?? analytics?.totalWaiting ?? 0;
  const hasWaitingCustomers = waitingCustomers > 0;
  const hasAnyCustomers = (analytics?.total ?? 0) > 0;
  const isQueueActive = Boolean(queue?.isActive);
  const isCalling = actionLoading === "callNext";
  const isCompleting = actionLoading === "complete";
  const isSkipping = actionLoading === "skip";
  const isActionRunning = Boolean(actionLoading);
  const disableCallNext = isActionRunning || !isQueueActive || !hasWaitingCustomers || hasCurrentCustomer;
  const disableComplete = isActionRunning || !isQueueActive || !hasCurrentCustomer;
  const disableSkip = isActionRunning || !isQueueActive || !hasCurrentCustomer;

  async function fetchQueue() {
    try {
      const response = await api.get(`/queue/${queueId}`);
      setQueue(response.data.queue);
    }
    catch (err) {
      toast.error(getErrorMessage(err, "Failed to load queue"));
    }
  }
  async function fetchAnalytics() {
    try {
      const response = await api.get(
        `/queueJoin/${queueId}/analytics`
      );

      setAnalytics(response.data);

    } catch (err) {
      if (err.response?.status === 400) {
        setAnalytics(emptyAnalytics);
        return;
      }

      toast.error(getErrorMessage(err, "Failed to load analytics"));
    }
  }
  async function handleCallNext() {
    if (disableCallNext) return;

    setActionLoading("callNext");
    try {
      await api.post(`/queueJoin/${queueId}/call_next`);
      toast.success("Customer called");
      await fetchStats();
      await fetchAnalytics();

    }
    catch (err) {
      toast.error(getErrorMessage(err, "No waiting customers"));
    } finally {
      setActionLoading(null);
    }
  }
  async function handleComplete() {
    if (disableComplete) return;

    setActionLoading("complete");
    try {
      await api.post(
        `/queueJoin/${queueId}/completed`
      );

      toast.success("Customer completed");

      await fetchStats();
      await fetchAnalytics();
    }
    catch (err) {
      toast.error(getErrorMessage(err, "Could not complete customer"));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSkip() {
    if (disableSkip) return;

    setActionLoading("skip");
    try {
      await api.post(
        `/queueJoin/${queueId}/skipped`
      );

      toast.success("Customer skipped");

      await fetchStats();
      await fetchAnalytics();
    }
    catch (err) {
      toast.error(getErrorMessage(err, "Could not skip customer"));
    } finally {
      setActionLoading(null);
    }
  }
  async function fetchStats() {
    try {
      const response = await api.get(
        `/queueJoin/${queueId}/stats`
      );

      setStats(response.data);
    }
    catch (err) {
      if (err.response?.status === 400) {
        setStats(emptyStats);
        return;
      }

      toast.error(getErrorMessage(err, "Failed to load queue statistics"));
    }
  }
  useEffect(() => {
    fetchQueue();
    fetchStats();
    fetchAnalytics();
  }, []);

  if (!queue) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar title="FlowQ" subtitle="Queue management" />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-10 w-64 animate-pulse rounded bg-slate-100" />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="FlowQ" subtitle="Queue management" />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${queue.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-50 text-slate-600 ring-slate-200"}`}>
                  {queue.isActive ? "Active" : "Inactive"}
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">{queue.location}</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{queue.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">Monitor the live queue and move customers through the service flow.</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[430px]">
              <button
                type="button"
                onClick={handleCallNext}
                disabled={disableCallNext}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                {isCalling ? "Calling..." : "Call Next"}
              </button>
              <button
                type="button"
                onClick={handleComplete}
                disabled={disableComplete}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                {isCompleting ? "Completing..." : "Complete"}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                disabled={disableSkip}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                {isSkipping ? "Skipping..." : "Skip"}
              </button>
            </div>
          </div>
        </section>

        {stats ? (
          <>
            <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <StatsCard
                label="Total"
                value={analytics?.total ?? 0}
                tone="slate"
              />

              <StatsCard
                label="Waiting"
                value={analytics?.totalWaiting ?? 0}
                tone="blue"
              />

              <StatsCard
                label="Called"
                value={analytics?.totalCalled ?? 0}
                tone="purple"
              />

              <StatsCard
                label="Completed"
                value={analytics?.totalCompleted ?? 0}
                tone="green"
              />

              <StatsCard
                label="Skipped"
                value={analytics?.totalSkipped ?? 0}
                tone="red"
              />
            </section>

            {!hasAnyCustomers && (
              <div className="mb-5 rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-soft">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500">
                  0
                </div>
                <h2 className="text-base font-semibold text-slate-950">No customers have joined this queue yet.</h2>
                <p className="mt-1 text-sm text-slate-500">New customer activity will appear here as soon as someone joins.</p>
              </div>
            )}

            <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-soft ring-1 ring-blue-50 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-950">Current Customer</h2>
                    <p className="mt-1 text-sm text-slate-500">The person currently being served.</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                    Now serving
                  </span>
                </div>
                {hasCurrentCustomer ? (
                  <div className="rounded-2xl bg-blue-50/70 p-5 ring-1 ring-blue-100">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Customer</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{stats.currentCustomer?.name}</p>
                    <div className="mt-5 inline-flex items-center rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-blue-100">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Token</span>
                      <span className="ml-3 text-2xl font-semibold text-blue-700">{stats.currentCustomer?.tokenNumber}</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="text-base font-semibold text-slate-950">No customer is currently being served.</p>
                    <p className="mt-1 text-sm text-slate-500">Call the next waiting customer to begin service.</p>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-950">Next Customer</h2>
                    <p className="mt-1 text-sm text-slate-500">First person in the waiting line.</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                    Up next
                  </span>
                </div>
                {stats.nextCustomer?.tokenNumber ? (
                  <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{stats.nextCustomer?.name}</p>
                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Token</span>
                      <span className="text-xl font-semibold text-slate-800">{stats.nextCustomer?.tokenNumber}</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="text-base font-semibold text-slate-950">No upcoming customers.</p>
                    <p className="mt-1 text-sm text-slate-500">Waiting customers will appear here automatically.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft">
            <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-slate-100" />
            <h2 className="text-lg font-semibold text-slate-950">Loading queue statistics</h2>
            <p className="mt-2 text-sm text-slate-500">Live queue data will appear here shortly.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default QueueManagement
