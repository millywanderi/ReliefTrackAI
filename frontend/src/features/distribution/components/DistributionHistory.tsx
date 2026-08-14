import { ClipboardList } from "lucide-react";

import type { DistributionVerification } from "../types";

interface DistributionHistoryProps {
  verifications: DistributionVerification[];
  isLoading?: boolean;
  isError?: boolean;
  getEventName: (id: number) => string;
  getBeneficiaryName: (id: number) => string;
  getResourceName: (id: number) => string;
}

function DistributionHistory({
  verifications,
  isLoading = false,
  isError = false,
  getEventName,
  getBeneficiaryName,
  getResourceName,
}: DistributionHistoryProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          Loading distribution history...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-red-800">
          Unable to load distribution history.
        </h3>

        <p className="mt-1 text-sm text-red-700">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
            <ClipboardList size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Distribution History
            </h2>

            <p className="text-sm text-slate-500">
              Historical record of resources delivered to beneficiaries.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="border-b bg-slate-50">
            <tr>
              <TableHeader>Distribution Event</TableHeader>
              <TableHeader>Beneficiary</TableHeader>
              <TableHeader>Resource</TableHeader>
              <TableHeader>Quantity</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Verified By</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Notes</TableHeader>
            </tr>
          </thead>

          <tbody className="divide-y">
            {verifications.map((verification) => (
              <tr
                key={verification.id}
                className="hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">
                    {getEventName(
                      verification.distribution_event_id,
                    )}
                  </p>
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
                  <HistoryStatusBadge
                    status={verification.status}
                  />
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  User #{verification.verified_by}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDateTime(
                    verification.verification_date,
                  )}
                </td>

                <td className="px-5 py-4">
                  {verification.notes ? (
                    <p
                      className="max-w-[220px] truncate text-sm text-slate-600"
                      title={verification.notes}
                    >
                      {verification.notes}
                    </p>
                  ) : (
                    <span className="text-sm text-slate-400">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {verifications.length === 0 && (
              <EmptyHistory />
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function HistoryStatusBadge({
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

function EmptyHistory() {
  return (
    <tr>
      <td
        colSpan={8}
        className="px-5 py-12 text-center"
      >
        <div className="mx-auto w-fit text-slate-300">
          <ClipboardList size={36} />
        </div>

        <p className="mt-3 font-medium text-slate-700">
          No distribution history
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Distribution delivery records will appear here
          after deliveries are recorded.
        </p>
      </td>
    </tr>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

export default DistributionHistory;
