import { useEffect } from 'react'
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from '../components/Navbar';
import QueueCard from '../components/QueueCard';
import QRModal from '../components/QRModal';
import EditQueueModal from '../components/EditQueueModal';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [editingQueue, setEditingQueue] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingQueueId, setDeletingQueueId] = useState(null);
  const [togglingQueueId, setTogglingQueueId] = useState(null);

  const navigate = useNavigate();

  function getErrorMessage(err, fallback = "Something went wrong") {
    return err.response?.data?.error || err.response?.data?.message || fallback;
  }

  async function fetchQueues() {
    try {
      const response = await api.get("/queue/");
      setQueues(response.data.queues)
    }
    catch (err) {
      toast.error(getErrorMessage(err, "Failed to load queues"));
    }
  }
  async function handleToggleQueue(queue) {
    if (togglingQueueId || deletingQueueId) return;

    setTogglingQueueId(queue._id);
    try {
      if (queue.isActive) {
        await api.patch(`/queue/${queue._id}/close`);
        toast.success("Queue closed");
      } else {
        await api.patch(`/queue/${queue._id}/open`);
        toast.success("Queue opened");
      }

      await fetchQueues();
    } catch (err) {
      toast.error(getErrorMessage(err, queue.isActive ? "Could not close queue" : "Could not open queue"));
    } finally {
      setTogglingQueueId(null);
    }
  }

  async function handleDeleteQueue(queueId) {
    if (deletingQueueId || togglingQueueId) return;

    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this queue?"
      );

      if (!confirmDelete) return;

      setDeletingQueueId(queueId);
      await api.delete(`/queue/${queueId}`);
      toast.success("Queue deleted");

      await fetchQueues();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete queue"));
    } finally {
      setDeletingQueueId(null);
    }
  }

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    avgServiceTime: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isCreating) return;

    setIsCreating(true);
    try {
      await api.post("/queue/create", formData);
      toast.success("Queue created");

      await fetchQueues();

      setFormData({
        name: "",
        location: "",
        avgServiceTime: ""
      });
    }
    catch (err) {
      toast.error(getErrorMessage(err, "Could not create queue"));
    } finally {
      setIsCreating(false);
    }
  }
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
    avgServiceTime: ""
  });
  async function handleUpdateQueue() {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await api.put(
        `/queue/${editingQueue._id}`,
        editForm
      );
      toast.success("Queue updated");

      await fetchQueues();

      setEditingQueue(null);

    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update queue"));
    } finally {
      setIsUpdating(false);
    }
  }
  function handleEdit(queue) {

    setEditingQueue(queue);

    setEditForm({
      name: queue.name,
      location: queue.location,
      avgServiceTime: queue.avgServiceTime
    });

  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQueues();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="FlowQ" subtitle="Admin dashboard" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-medium text-blue-600">Welcome back</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Dashboard</h1>
              <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              {queues.length} {queues.length === 1 ? "queue" : "queues"}
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-950">Create queue</h2>
              <p className="mt-1 text-sm text-slate-500">Add a service desk or location for customers to join.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                  Queue Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="Main counter"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label htmlFor="location" className="mb-2 block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="Lobby, floor 1"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label htmlFor="avgServiceTime" className="mb-2 block text-sm font-medium text-slate-700">
                  Average Service Time
                </label>
                <input
                  id="avgServiceTime"
                  type="text"
                  name="avgServiceTime"
                  value={formData.avgServiceTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="5"
                  disabled={isCreating}
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                {isCreating ? "Creating..." : "Create Queue"}
              </button>
            </form>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">Queues</h2>
              <p className="text-sm text-slate-500">Manage live customer flow</p>
            </div>

            {queues.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-soft">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500">
                  0
                </div>
                <h3 className="text-lg font-semibold text-slate-950">No queues yet</h3>
                <p className="mt-2 text-sm text-slate-500">Create your first queue to start accepting customers.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {queues.map((queue) => (
                  <QueueCard
                    key={queue._id}
                    queue={queue}
                    onManage={() => navigate(`/queue/${queue._id}`)}
                    onShowQR={() => setSelectedQueue(queue)}
                    onToggleQueue={() => handleToggleQueue(queue)}
                    onDelete={() => handleDeleteQueue(queue._id)}
                    onEdit={() => handleEdit(queue)}
                    isToggling={togglingQueueId === queue._id}
                    isDeleting={deletingQueueId === queue._id}
                  />

                ))}
              </div>

            )}
          </section>
        </div>
      </main>
      <QRModal
        queue={selectedQueue}
        onClose={() => setSelectedQueue(null)}
      />
      <EditQueueModal
        queue={editingQueue}
        editForm={editForm}
        setEditForm={setEditForm}
        onClose={() => setEditingQueue(null)}
        onSave={handleUpdateQueue}
        isSaving={isUpdating}
      />
    </div>


  )
}

export default Dashboard;
