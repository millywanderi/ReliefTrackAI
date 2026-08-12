import api from "@/services/api";

import type {
  DistributionEvent,
  DistributionEventCreate,
  DistributionEventUpdate,
  DistributionResource,
  DistributionResourceCreate,
  DistributionVerification,
  DistributionVerificationCreate,
} from "../types";

// ----------------------------------
// DISTRIBUTION EVENTS
// ----------------------------------

export async function getDistributionEvents(
  status?: string,
): Promise<DistributionEvent[]> {
  const response = await api.get<DistributionEvent[]>(
    "/api/v1/distribution-events/",
    {
      params: {
        status: status || undefined,
      },
    },
  );

  return response.data;
}

export async function getDistributionEvent(
  id: number,
): Promise<DistributionEvent> {
  const response = await api.get<DistributionEvent>(
    `/api/v1/distribution-events/${id}`,
  );

  return response.data;
}

export async function createDistributionEvent(
  data: DistributionEventCreate,
): Promise<DistributionEvent> {
  const response = await api.post<DistributionEvent>(
    "/api/v1/distribution-events/",
    data,
  );

  return response.data;
}

export async function updateDistributionEvent(
  id: number,
  data: DistributionEventUpdate,
): Promise<DistributionEvent> {
  const response = await api.put<DistributionEvent>(
    `/api/v1/distribution-events/${id}`,
    data,
  );

  return response.data;
}

export async function deleteDistributionEvent(
  id: number,
): Promise<void> {
  await api.delete(
    `/api/v1/distribution-events/${id}`,
  );
}

// ----------------------------------
// RESOURCE ALLOCATIONS
// ----------------------------------

export async function getDistributionResources(): Promise<
  DistributionResource[]
> {
  const response = await api.get<DistributionResource[]>(
    "/api/v1/distribution-resources/",
  );

  return response.data;
}

export async function getDistributionResource(
  id: number,
): Promise<DistributionResource> {
  const response =
    await api.get<DistributionResource>(
      `/api/v1/distribution-resources/${id}`,
    );

  return response.data;
}

export async function createDistributionResource(
  data: DistributionResourceCreate,
): Promise<DistributionResource> {
  const response =
    await api.post<DistributionResource>(
      "/api/v1/distribution-resources/",
      data,
    );

  return response.data;
}

export async function deleteDistributionResource(
  id: number,
): Promise<void> {
  await api.delete(
    `/api/v1/distribution-resources/${id}`,
  );
}

// ----------------------------------
// DELIVERY VERIFICATIONS
// ----------------------------------

export async function getDistributionVerifications(): Promise<
  DistributionVerification[]
> {
  const response =
    await api.get<DistributionVerification[]>(
      "/api/v1/distribution-verifications/",
    );

  return response.data;
}

export async function getDistributionVerification(
  id: number,
): Promise<DistributionVerification> {
  const response =
    await api.get<DistributionVerification>(
      `/api/v1/distribution-verifications/${id}`,
    );

  return response.data;
}

export async function createDistributionVerification(
  data: DistributionVerificationCreate,
): Promise<DistributionVerification> {
  const response =
    await api.post<DistributionVerification>(
      "/api/v1/distribution-verifications/",
      data,
    );

  return response.data;
}
