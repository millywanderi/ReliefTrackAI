import { useMemo, useState } from "react";
import axios from "axios";

import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Package,
  Plus,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createDistributionEvent,
  createDistributionResource,
  createDistributionVerification,
  deleteDistributionEvent,
  deleteDistributionResource,
  getDistributionEvents,
  getDistributionResources,
  getDistributionVerifications,
} from "../api/distributionApi";

import { getBeneficiaries } from "@/features/beneficiaries/api/beneficiariesApi";
import { getResources } from "@/features/resources/api/resourcesApi";
import { getWarehouses } from "@/features/warehouses/api/warehousesApi";

import type {
  DistributionEvent,
  DistributionEventCreate,
  DistributionResource,
  DistributionResourceCreate,
  DistributionVerification,
  DistributionVerificationCreate,
  DistributionVerificationStatus,
} from "../types";

import DistributionHistory from "../components/DistributionHistory";

type DistributionTab =
  | "events"
  | "allocations"
  | "verification"
  | "history";

function DistributionPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] =
    useState<DistributionTab>("events");

  const [showEventForm, setShowEventForm] =
    useState(false);

  const [showAllocationForm, setShowAllocationForm] =
    useState(false);

  const [showVerificationForm, setShowVerificationForm] =
    useState(false);

  const eventsQuery = useQuery({
    queryKey: ["distribution-events"],
    queryFn: () => getDistributionEvents(),
  });

  const allocationsQuery = useQuery({
    queryKey: ["distribution-resources"],
    queryFn: getDistributionResources,
  });

  const verificationsQuery = useQuery({
    queryKey: ["distribution-verifications"],
    queryFn: getDistributionVerifications,
  });

  const warehousesQuery = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });

  const resourcesQuery = useQuery({
    queryKey: ["resources"],
    queryFn: () =>
      getResources({
        page: 1,
        limit: 100,
      }),
  });

  const beneficiariesQuery = useQuery({
    queryKey: ["beneficiaries", "distribution"],
    queryFn: () =>
      getBeneficiaries({
        page: 1,
        limit: 100,
      }),
  });

  const events = eventsQuery.data ?? [];
  const allocations = allocationsQuery.data ?? [];
  const verifications = verificationsQuery.data ?? [];
  const warehouses = warehousesQuery.data ?? [];
  const resources = resourcesQuery.data ?? [];
  const beneficiaries =
    beneficiariesQuery.data ?? [];

  const createEventMutation = useMutation({
    mutationFn: createDistributionEvent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["distribution-events"],
      });

      setShowEventForm(false);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: deleteDistributionEvent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["distribution-events"],
      });

      queryClient.invalidateQueries({
        queryKey: ["distribution-resources"],
      });

      queryClient.invalidateQueries({
        queryKey: ["distribution-verifications"],
      });
    },
  });

  const createAllocationMutation = useMutation({
    mutationFn: createDistributionResource,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["distribution-resources"],
      });

      setShowAllocationForm(false);
    },

    onError: (error) => {
      console.error(
        "Distribution resource allocation failed:",
        error,
      );

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail ??
          "Unable to allocate resource.";

        window.alert(message);
        return;
      }

      window.alert(
        "Unable to allocate resource. Please try again.",
      );
    }
  });

  const deleteAllocationMutation = useMutation({
    mutationFn: deleteDistributionResource,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["distribution-resources"],
      });
    },
  });

  const createVerificationMutation =
    useMutation({
      mutationFn: createDistributionVerification,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["distribution-verifications"],
        });

        queryClient.invalidateQueries({
          queryKey: ["stock-transactions"],
        });

        queryClient.invalidateQueries({
          queryKey: ["stock-monitoring"],
        });

        setShowVerificationForm(false);
      },
    });

  const getWarehouseName = (id: number) =>
    warehouses.find(
      (warehouse) => warehouse.id === id,
    )?.name ?? `Warehouse #${id}`;

  const getResourceName = (id: number) =>
    resources.find(
      (resource) => resource.id === id,
    )?.name ?? `Resource #${id}`;

  const getBeneficiaryName = (id: number) => {
    const beneficiary = beneficiaries.find(
      (item) => item.id === id,
    );

    if (!beneficiary) {
      return `Beneficiary #${id}`;
    }

    return `${beneficiary.first_name} ${beneficiary.last_name}`;
  };

  const getEventName = (id: number) =>
    events.find((event) => event.id === id)
      ?.name ?? `Event #${id}`;

  const handleDeleteEvent = (
    event: DistributionEvent,
  ) => {
    const confirmed = window.confirm(
      `Delete distribution event "${event.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteEventMutation.mutate(event.id);
  };

  const handleDeleteAllocation = (
    allocation: DistributionResource,
  ) => {
    const confirmed = window.confirm(
      "Delete this resource allocation?",
    );

    if (!confirmed) {
      return;
    }

    deleteAllocationMutation.mutate(
      allocation.id,
    );
  };

  const deliveredCount = useMemo(
    () =>
      verifications.filter(
        (item) => item.status === "Delivered",
      ).length,
    [verifications],
  );

  const pendingCount = useMemo(
    () =>
      verifications.filter(
        (item) => item.status === "Pending",
      ).length,
    [verifications],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Distribution
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Plan distributions, allocate resources,
            and verify deliveries to beneficiaries.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeTab === "events" && (
            <button
              type="button"
              onClick={() =>
                setShowEventForm(true)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus size={18} />
              New Distribution Event
            </button>
          )}

          {activeTab === "allocations" && (
            <button
              type="button"
              onClick={() =>
                setShowAllocationForm(true)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus size={18} />
              Allocate Resource
            </button>
          )}

          {activeTab === "verification" && (
            <button
              type="button"
              onClick={() =>
                setShowVerificationForm(true)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus size={18} />
              Record Delivery
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Distribution Events"
          value={events.length}
          icon={<CalendarDays size={20} />}
        />

        <SummaryCard
          title="Resource Allocations"
          value={allocations.length}
          icon={<Package size={20} />}
        />

        <SummaryCard
          title="Deliveries Verified"
          value={deliveredCount}
          icon={<CheckCircle2 size={20} />}
        />

        <SummaryCard
          title="Pending Verification"
          value={pendingCount}
          icon={<ClipboardList size={20} />}
        />
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6 overflow-x-auto">
          <TabButton
            active={activeTab === "events"}
            onClick={() =>
              setActiveTab("events")
            }
            icon={<CalendarDays size={17} />}
          >
            Distribution Events
          </TabButton>

          <TabButton
            active={activeTab === "allocations"}
            onClick={() =>
              setActiveTab("allocations")
            }
            icon={<Package size={17} />}
          >
            Resource Allocations
          </TabButton>

          <TabButton
            active={activeTab === "verification"}
            onClick={() =>
              setActiveTab("verification")
            }
            icon={<CheckCircle2 size={17} />}
          >
            Delivery Verification
          </TabButton>

          <TabButton
            active={activeTab === "history"}
            onClick={() =>
              setActiveTab("history")
            }
            icon={<ClipboardList size={17} />}
          >
            Distribution History
          </TabButton>
        </div>
      </div>

      {/* Events */}
      {activeTab === "events" && (
        <EventsTable
          events={events}
          isLoading={eventsQuery.isLoading}
          isError={eventsQuery.isError}
          getWarehouseName={getWarehouseName}
          onDelete={handleDeleteEvent}
          deleting={deleteEventMutation.isPending}
        />
      )}

      {/* Allocations */}
      {activeTab === "allocations" && (
        <AllocationsTable
          allocations={allocations}
          isLoading={allocationsQuery.isLoading}
          isError={allocationsQuery.isError}
          getEventName={getEventName}
          getResourceName={getResourceName}
          onDelete={handleDeleteAllocation}
          deleting={
            deleteAllocationMutation.isPending
          }
        />
      )}

      {/* Verification */}
      {activeTab === "verification" && (
        <VerificationTable
          verifications={verifications}
          isLoading={
            verificationsQuery.isLoading
          }
          isError={verificationsQuery.isError}
          getEventName={getEventName}
          getBeneficiaryName={
            getBeneficiaryName
          }
          getResourceName={getResourceName}
        />
      )}

     {/* History */}
     {activeTab === "history" && (
       <DistributionHistory
         verifications={verifications}
         isLoading={
           verificationsQuery.isLoading
         }
         isError={verificationsQuery.isError}
         getEventName={getEventName}
         getBeneficiaryName={
           getBeneficiaryName
         }
         getResourceName={getResourceName}
       />
     )}

      {/* Event form */}
      {showEventForm && (
        <DistributionEventForm
          warehouses={warehouses}
          isSubmitting={
            createEventMutation.isPending
          }
          onClose={() =>
            setShowEventForm(false)
          }
          onSubmit={(data) =>
            createEventMutation.mutate(data)
          }
        />
      )}

      {/* Allocation form */}
      {showAllocationForm && (
        <DistributionAllocationForm
          events={events}
          resources={resources}
          isSubmitting={
            createAllocationMutation.isPending
          }
          onClose={() =>
            setShowAllocationForm(false)
          }
          onSubmit={(data) =>
            createAllocationMutation.mutate(data)
          }
        />
      )}

      {/* Verification form */}
      {showVerificationForm && (
        <DistributionVerificationForm
          events={events}
          resources={resources}
          beneficiaries={beneficiaries}
          isSubmitting={
            createVerificationMutation.isPending
          }
          onClose={() =>
            setShowVerificationForm(false)
          }
          onSubmit={(data) =>
            createVerificationMutation.mutate(data)
          }
        />
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap",
        active
          ? "border-slate-900 text-slate-900"
          : "border-transparent text-slate-500 hover:text-slate-700",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}

function EventsTable({
  events,
  isLoading,
  isError,
  getWarehouseName,
  onDelete,
  deleting,
}: {
  events: DistributionEvent[];
  isLoading: boolean;
  isError: boolean;
  getWarehouseName: (
    id: number,
  ) => string;
  onDelete: (
    event: DistributionEvent,
  ) => void;
  deleting: boolean;
}) {
  if (isLoading) {
    return <LoadingCard text="Loading distribution events..." />;
  }

  if (isError) {
    return (
      <ErrorCard text="Unable to load distribution events." />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="border-b bg-slate-50">
            <tr>
              <TableHeader>Event</TableHeader>
              <TableHeader>Disaster Type</TableHeader>
              <TableHeader>Warehouse</TableHeader>
              <TableHeader>County</TableHeader>
              <TableHeader>Dates</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader align="right">
                Actions
              </TableHeader>
            </tr>
          </thead>

          <tbody className="divide-y">
            {events.map((event) => (
              <tr
                key={event.id}
                className="hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">
                    {event.name}
                  </p>

                  {event.description && (
                    <p className="mt-1 max-w-[240px] truncate text-xs text-slate-400">
                      {event.description}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {event.disaster_type}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {getWarehouseName(
                    event.warehouse_id,
                  )}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {event.county}
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-slate-700">
                    {formatDate(event.start_date)}
                  </p>

                  <p className="text-xs text-slate-400">
                    to {formatDate(event.end_date)}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <EventStatusBadge
                    status={event.status}
                  />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        onDelete(event)
                      }
                      disabled={deleting}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                      title="Delete event"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {events.length === 0 && (
              <EmptyRow
                colSpan={7}
                icon={<CalendarDays size={32} />}
                title="No distribution events"
                text="Create a distribution event to get started."
              />
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AllocationsTable({
  allocations,
  isLoading,
  isError,
  getEventName,
  getResourceName,
  onDelete,
  deleting,
}: {
  allocations: DistributionResource[];
  isLoading: boolean;
  isError: boolean;
  getEventName: (id: number) => string;
  getResourceName: (id: number) => string;
  onDelete: (
    allocation: DistributionResource,
  ) => void;
  deleting: boolean;
}) {
  if (isLoading) {
    return <LoadingCard text="Loading resource allocations..." />;
  }

  if (isError) {
    return (
      <ErrorCard text="Unable to load resource allocations." />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="border-b bg-slate-50">
            <tr>
              <TableHeader>Distribution Event</TableHeader>
              <TableHeader>Resource</TableHeader>
              <TableHeader>Quantity</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader align="right">
                Actions
              </TableHeader>
            </tr>
          </thead>

          <tbody className="divide-y">
            {allocations.map((allocation) => (
              <tr
                key={allocation.id}
                className="hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">
                    {getEventName(
                      allocation.distribution_event_id,
                    )}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {getResourceName(
                    allocation.resource_id,
                  )}
                </td>

                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-900">
                    {allocation.quantity.toLocaleString()}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDateTime(
                    allocation.created_at,
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        onDelete(allocation)
                      }
                      disabled={deleting}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                      title="Delete allocation"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {allocations.length === 0 && (
              <EmptyRow
                colSpan={5}
                icon={<Package size={32} />}
                title="No resource allocations"
                text="Allocate resources to a distribution event."
              />
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function VerificationTable({
  verifications,
  isLoading,
  isError,
  getEventName,
  getBeneficiaryName,
  getResourceName,
}: {
  verifications: DistributionVerification[];
  isLoading: boolean;
  isError: boolean;
  getEventName: (id: number) => string;
  getBeneficiaryName: (id: number) => string;
  getResourceName: (id: number) => string;
}) {
  if (isLoading) {
    return <LoadingCard text="Loading delivery verifications..." />;
  }

  if (isError) {
    return (
      <ErrorCard text="Unable to load delivery verifications." />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="border-b bg-slate-50">
            <tr>
              <TableHeader>Event</TableHeader>
              <TableHeader>Beneficiary</TableHeader>
              <TableHeader>Resource</TableHeader>
              <TableHeader>Quantity</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
            </tr>
          </thead>

          <tbody className="divide-y">
            {verifications.map((verification) => (
              <tr
                key={verification.id}
                className="hover:bg-slate-50"
              >
                <td className="px-5 py-4 text-sm font-medium text-slate-800">
                  {getEventName(
                    verification.distribution_event_id,
                  )}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {getBeneficiaryName(
                    verification.beneficiary_id,
                  )}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {getResourceName(
                    verification.resource_id,
                  )}
                </td>

                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-900">
                    {verification.quantity.toLocaleString()}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <VerificationStatusBadge
                    status={verification.status}
                  />
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDateTime(
                    verification.verification_date,
                  )}
                </td>
              </tr>
            ))}

            {verifications.length === 0 && (
              <EmptyRow
                colSpan={6}
                icon={<CheckCircle2 size={32} />}
                title="No delivery verifications"
                text="Record a delivery after resources have been allocated."
              />
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DistributionEventForm({
  warehouses,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  warehouses: {
    id: number;
    name: string;
  }[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data: DistributionEventCreate,
  ) => void;
}) {
  const [form, setForm] =
    useState<DistributionEventCreate>({
      name: "",
      disaster_type: "",
      warehouse_id: 0,
      county: "",
      start_date: "",
      end_date: "",
      status: "Planned",
      description: "",
    });

  const submit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    onSubmit({
      ...form,
      name: form.name.trim(),
      disaster_type: form.disaster_type.trim(),
      county: form.county.trim(),
      description:
        form.description?.trim() || undefined,
    });
  };

  return (
    <Modal
      title="Create Distribution Event"
      description="Plan a new humanitarian resource distribution."
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Event Name">
            <input
              type="text"
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="e.g. Flood Relief - Tana River"
              className={inputClass}
            />
          </FormField>

          <FormField label="Disaster Type">
            <input
              type="text"
              required
              value={form.disaster_type}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  disaster_type:
                    event.target.value,
                }))
              }
              placeholder="e.g. Flood"
              className={inputClass}
            />
          </FormField>

          <FormField label="Warehouse">
            <select
              required
              value={form.warehouse_id}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  warehouse_id: Number(
                    event.target.value,
                  ),
                }))
              }
              className={inputClass}
            >
              <option value={0}>
                Select warehouse
              </option>

              {warehouses.map((warehouse) => (
                <option
                  key={warehouse.id}
                  value={warehouse.id}
                >
                  {warehouse.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="County">
            <input
              type="text"
              required
              value={form.county}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  county: event.target.value,
                }))
              }
              placeholder="e.g. Tana River"
              className={inputClass}
            />
          </FormField>

          <FormField label="Start Date">
            <input
              type="date"
              required
              value={form.start_date}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  start_date:
                    event.target.value,
                }))
              }
              className={inputClass}
            />
          </FormField>

          <FormField label="End Date">
            <input
              type="date"
              required
              value={form.end_date}
              min={form.start_date || undefined}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  end_date: event.target.value,
                }))
              }
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Status">
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status:
                  event.target
                    .value as DistributionEventCreate["status"],
              }))
            }
            className={inputClass}
          >
            <option value="Planned">
              Planned
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </FormField>

        <FormField label="Description">
          <textarea
            rows={4}
            value={form.description ?? ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description:
                  event.target.value,
              }))
            }
            placeholder="Describe the distribution activity..."
            className={inputClass}
          />
        </FormField>

        <ModalActions
          onClose={onClose}
          isSubmitting={isSubmitting}
          submitLabel="Create Event"
        />
      </form>
    </Modal>
  );
}

function DistributionAllocationForm({
  events,
  resources,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  events: DistributionEvent[];
  resources: {
    id: number;
    name: string;
    unit: string;
  }[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data: DistributionResourceCreate,
  ) => void;
}) {
  const [form, setForm] =
    useState<DistributionResourceCreate>({
      distribution_event_id: 0,
      resource_id: 0,
      quantity: 0,
    });

  const submit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    onSubmit({
      ...form,
      quantity: Number(form.quantity),
    });
  };

  return (
    <Modal
      title="Allocate Resource"
      description="Assign available stock to a distribution event."
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <FormField label="Distribution Event">
          <select
            required
            value={form.distribution_event_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                distribution_event_id:
                  Number(event.target.value),
              }))
            }
            className={inputClass}
          >
            <option value={0}>
              Select distribution event
            </option>

            {events
              .filter(
                (event) =>
                  event.status !== "Cancelled",
              )
              .map((event) => (
                <option
                  key={event.id}
                  value={event.id}
                >
                  {event.name}
                </option>
              ))}
          </select>
        </FormField>

        <FormField label="Resource">
          <select
            required
            value={form.resource_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                resource_id: Number(
                  event.target.value,
                ),
              }))
            }
            className={inputClass}
          >
            <option value={0}>
              Select resource
            </option>

            {resources.map((resource) => (
              <option
                key={resource.id}
                value={resource.id}
              >
                {resource.name} ({resource.unit})
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Quantity">
          <input
            type="number"
            min={1}
            required
            value={form.quantity}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                quantity: Number(
                  event.target.value,
                ),
              }))
            }
            className={inputClass}
          />
        </FormField>

        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
          The backend will verify that enough stock
          is available in the event's warehouse.
        </p>

        <ModalActions
          onClose={onClose}
          isSubmitting={isSubmitting}
          submitLabel="Allocate Resource"
        />
      </form>
    </Modal>
  );
}

function DistributionVerificationForm({
  events,
  resources,
  beneficiaries,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  events: DistributionEvent[];
  resources: {
    id: number;
    name: string;
    unit: string;
  }[];
  beneficiaries: {
    id: number;
    first_name: string;
    last_name: string;
    county: string;
  }[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data: DistributionVerificationCreate,
  ) => void;
}) {
  const [form, setForm] =
    useState<DistributionVerificationCreate>({
      distribution_event_id: 0,
      beneficiary_id: 0,
      resource_id: 0,
      quantity: 0,
      status: "Delivered",
      notes: "",
    });

  const submit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    onSubmit({
      ...form,
      quantity: Number(form.quantity),
      notes: form.notes?.trim() || undefined,
    });
  };

  return (
    <Modal
      title="Record Delivery"
      description="Verify resources delivered to a beneficiary."
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <FormField label="Distribution Event">
          <select
            required
            value={form.distribution_event_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                distribution_event_id:
                  Number(event.target.value),
              }))
            }
            className={inputClass}
          >
            <option value={0}>
              Select distribution event
            </option>

            {events
              .filter(
                (event) =>
                  event.status !== "Cancelled",
              )
              .map((event) => (
                <option
                  key={event.id}
                  value={event.id}
                >
                  {event.name}
                </option>
              ))}
          </select>
        </FormField>

        <FormField label="Beneficiary">
          <select
            required
            value={form.beneficiary_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                beneficiary_id:
                  Number(event.target.value),
              }))
            }
            className={inputClass}
          >
            <option value={0}>
              Select beneficiary
            </option>

            {beneficiaries.map(
              (beneficiary) => (
                <option
                  key={beneficiary.id}
                  value={beneficiary.id}
                >
                  {beneficiary.first_name}{" "}
                  {beneficiary.last_name} —{" "}
                {beneficiary.county}
                </option>
              ),
            )}
          </select>
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Resource">
            <select
              required
              value={form.resource_id}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  resource_id: Number(
                    event.target.value,
                  ),
                }))
              }
              className={inputClass}
            >
              <option value={0}>
                Select resource
              </option>

              {resources.map((resource) => (
                <option
                  key={resource.id}
                  value={resource.id}
                >
                  {resource.name} (
                  {resource.unit})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Quantity">
            <input
              type="number"
              min={1}
              required
              value={form.quantity}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  quantity: Number(
                    event.target.value,
                  ),
                }))
              }
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Delivery Status">
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status:
                  event.target
                    .value as DistributionVerificationStatus,
              }))
            }
            className={inputClass}
          >
            <option value="Delivered">
              Delivered
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Failed">
              Failed
            </option>
          </select>
        </FormField>

        <FormField label="Notes">
          <textarea
            rows={4}
            value={form.notes ?? ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            placeholder="Add delivery notes..."
            className={inputClass}
          />
        </FormField>

        <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
          A Delivered verification automatically
          creates a STOCK_OUT transaction for the
          event's warehouse.
        </p>

        <ModalActions
          onClose={onClose}
          isSubmitting={isSubmitting}
          submitLabel="Record Delivery"
        />
      </form>
    </Modal>
  );
}

function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>

            <p className="text-sm text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({
  onClose,
  isSubmitting,
  submitLabel,
}: {
  onClose: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  return (
    <div className="flex justify-end gap-3 border-t pt-5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-xl border px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isSubmitting ? (
          "Saving..."
        ) : (
          <>
            <Truck size={17} />
            {submitLabel}
          </>
        )}
      </button>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400";

function EventStatusBadge({
  status,
}: {
  status: string;
}) {
  const classes =
    status === "Completed"
      ? "bg-emerald-50 text-emerald-700"
      : status === "In Progress"
        ? "bg-blue-50 text-blue-700"
        : status === "Cancelled"
          ? "bg-red-50 text-red-700"
          : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  );
}

function VerificationStatusBadge({
  status,
}: {
  status: string;
}) {
  const classes =
    status === "Delivered"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Failed"
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  );
}

function TableHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function EmptyRow({
  colSpan,
  icon,
  title,
  text,
}: {
  colSpan: number;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-5 py-12 text-center"
      >
        <div className="mx-auto w-fit text-slate-300">
          {icon}
        </div>

        <p className="mt-3 font-medium text-slate-700">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {text}
        </p>
      </td>
    </tr>
  );
}

function LoadingCard({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-10 text-center">
      <p className="text-sm text-slate-500">
        {text}
      </p>
    </div>
  );
}

function ErrorCard({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h3 className="font-semibold text-red-800">
        {text}
      </h3>

      <p className="mt-1 text-sm text-red-700">
        Please check your connection and try
        again.
      </p>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(
    `${value}T00:00:00`,
  ).toLocaleDateString();
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

export default DistributionPage;
