import type { Beneficiary } from "../types";

interface BeneficiaryTableProps {
  beneficiaries: Beneficiary[];
  onView: (beneficiary: Beneficiary) => void;
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (beneficiary: Beneficiary) => void;
}

function BeneficiaryTable({
  beneficiaries,
  onView,
  onEdit,
  onDelete,
}: BeneficiaryTableProps) {
  if (beneficiaries.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <h3 className="font-semibold text-slate-900">
          No beneficiaries found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-5 py-3 font-semibold text-slate-600">
                Name
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Gender
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Phone
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                County
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Sub County
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                National ID
              </th>

              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {beneficiaries.map((beneficiary) => (
              <tr
                key={beneficiary.id}
                className="hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {beneficiary.first_name}{" "}
                      {beneficiary.last_name}
                    </p>

                    <p className="text-xs text-slate-500">
                      ID #{beneficiary.id}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {beneficiary.gender}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {beneficiary.phone || "—"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {beneficiary.county}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {beneficiary.sub_county || "—"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {beneficiary.national_id || "—"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onView(beneficiary)
                      }
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onEdit(beneficiary)
                      }
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(beneficiary)
                      }
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BeneficiaryTable;
