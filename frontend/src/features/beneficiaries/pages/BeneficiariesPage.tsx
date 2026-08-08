import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createBeneficiary,
  deleteBeneficiary,
  getBeneficiaries,
  updateBeneficiary,
} from "../api/beneficiariesApi";

import BeneficiaryForm from "../components/BeneficiaryForm";
import BeneficiaryTable from "../components/BeneficiaryTable";

import type {
  Beneficiary,
  BeneficiaryCreate,
} from "../types";

function BeneficiariesPage() {
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [county, setCounty] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [showForm, setShowForm] =
    useState(false);

  const [editingBeneficiary, setEditingBeneficiary] =
    useState<Beneficiary | null>(null);

  const [viewingBeneficiary, setViewingBeneficiary] =
    useState<Beneficiary | null>(null);

  const limit = 10;

  const {
    data: beneficiaries = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "beneficiaries",
      {
        search,
        county,
        gender,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getBeneficiaries({
        search,
        county,
        gender,
        page,
        limit,
      }),
  });

  const createMutation =
    useMutation({
      mutationFn: createBeneficiary,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["beneficiaries"],
        });

        setShowForm(false);
      },
    });

  const updateMutation =
    useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: number;
        data: BeneficiaryCreate;
      }) =>
        updateBeneficiary(id, data),

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["beneficiaries"],
        });

        setShowForm(false);
        setEditingBeneficiary(null);
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: deleteBeneficiary,

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["beneficiaries"],
        });
      },
    });

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCounty("");
    setGender("");
    setPage(1);
  };

  const handleCreate = () => {
    setEditingBeneficiary(null);
    setShowForm(true);
  };

  const handleEdit = (
    beneficiary: Beneficiary,
  ) => {
    setEditingBeneficiary(beneficiary);
    setShowForm(true);
    setViewingBeneficiary(null);
  };

  const handleDelete = (
    beneficiary: Beneficiary,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${beneficiary.first_name} ${beneficiary.last_name}?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(beneficiary.id);
  };

  const handleSubmit = async (
    data: BeneficiaryCreate,
  ) => {
    if (editingBeneficiary) {
      await updateMutation.mutateAsync({
        id: editingBeneficiary.id,
        data,
      });

      return;
    }

    await createMutation.mutateAsync(data);
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending;

  const canGoNext =
    beneficiaries.length === limit;

  const canGoPrevious =
    page > 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Beneficiaries
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage registered beneficiaries and their
            locations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add Beneficiary
        </button>
      </div>

      {/* Filters */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Search
            </label>

            <div className="flex gap-2">
              <input
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Name, phone or ID..."
                className="input-field"
              />

              <button
                type="button"
                onClick={handleSearch}
                className="rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
              >
                Search
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              County
            </label>

            <input
              value={county}
              onChange={(event) => {
                setCounty(event.target.value);
                setPage(1);
              }}
              placeholder="e.g. Nairobi"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Gender
            </label>

            <select
              value={gender}
              onChange={(event) => {
                setGender(event.target.value);
                setPage(1);
              }}
              className="input-field"
            >
              <option value="">
                All genders
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            Clear filters
          </button>
        </div>
      </section>

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-800">
            Unable to load beneficiaries.
          </p>

          <p className="mt-1 text-sm text-red-700">
            Please check your connection and try
            again.
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading beneficiaries...
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <BeneficiaryTable
            beneficiaries={beneficiaries}
            onView={setViewingBeneficiary}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {page}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={!canGoPrevious}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1),
                  )
                }
                className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={!canGoNext}
                onClick={() =>
                  setPage((current) =>
                    current + 1,
                  )
                }
                className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <Modal
          title={
            editingBeneficiary
              ? "Edit Beneficiary"
              : "Add Beneficiary"
          }
          onClose={() => {
            setShowForm(false);
            setEditingBeneficiary(null);
          }}
        >
          <BeneficiaryForm
            beneficiary={editingBeneficiary}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingBeneficiary(null);
            }}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}

      {/* Details Modal */}
      {viewingBeneficiary && (
        <Modal
          title="Beneficiary Details"
          onClose={() =>
            setViewingBeneficiary(null)
          }
        >
          <BeneficiaryDetails
            beneficiary={viewingBeneficiary}
            onEdit={() =>
              handleEdit(viewingBeneficiary)
            }
          />
        </Modal>
      )}

      {/* Delete Loading */}
      {deleteMutation.isPending && (
        <div className="fixed bottom-5 right-5 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          Deleting beneficiary...
        </div>
      )}
    </div>
  );
}

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({
  title,
  onClose,
  children,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface BeneficiaryDetailsProps {
  beneficiary: Beneficiary;
  onEdit: () => void;
}

function BeneficiaryDetails({
  beneficiary,
  onEdit,
}: BeneficiaryDetailsProps) {
  const details = [
    ["First Name", beneficiary.first_name],
    ["Last Name", beneficiary.last_name],
    ["Gender", beneficiary.gender],
    [
      "Date of Birth",
      beneficiary.date_of_birth || "—",
    ],
    [
      "National ID",
      beneficiary.national_id || "—",
    ],
    ["Phone", beneficiary.phone || "—"],
    ["County", beneficiary.county],
    [
      "Sub County",
      beneficiary.sub_county || "—",
    ],
    ["Ward", beneficiary.ward || "—"],
    ["Village", beneficiary.village || "—"],
    [
      "Latitude",
      beneficiary.latitude?.toString() || "—",
    ],
    [
      "Longitude",
      beneficiary.longitude?.toString() || "—",
    ],
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg bg-slate-50 p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {label}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Edit Beneficiary
        </button>
      </div>
    </div>
  );
}

export default BeneficiariesPage;
