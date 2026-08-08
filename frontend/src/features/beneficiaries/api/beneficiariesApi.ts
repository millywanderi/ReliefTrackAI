import api from "@/services/api";

import type {
  Beneficiary,
  BeneficiaryCreate,
  BeneficiaryFilters,
  BeneficiaryUpdate,
} from "../types";

export async function getBeneficiaries(
  filters: BeneficiaryFilters = {},
): Promise<Beneficiary[]> {
  const response = await api.get<Beneficiary[]>(
    "/api/v1/beneficiaries/",
    {
      params: {
        search: filters.search || undefined,
        county: filters.county || undefined,
        gender: filters.gender || undefined,
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
      },
    },
  );

  return response.data;
}

export async function getBeneficiary(
  id: number,
): Promise<Beneficiary> {
  const response = await api.get<Beneficiary>(
    `/api/v1/beneficiaries/${id}`,
  );

  return response.data;
}

export async function createBeneficiary(
  data: BeneficiaryCreate,
): Promise<Beneficiary> {
  const response = await api.post<Beneficiary>(
    "/api/v1/beneficiaries/",
    data,
  );

  return response.data;
}

export async function updateBeneficiary(
  id: number,
  data: BeneficiaryUpdate,
): Promise<Beneficiary> {
  const response = await api.put<Beneficiary>(
    `/api/v1/beneficiaries/${id}`,
    data,
  );

  return response.data;
}

export async function deleteBeneficiary(
  id: number,
): Promise<void> {
  await api.delete(`/api/v1/beneficiaries/${id}`);
}
