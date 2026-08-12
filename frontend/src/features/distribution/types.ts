export type DistributionEventStatus =
  | "Planned"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export interface DistributionEvent {
  id: number;
  name: string;
  disaster_type: string;
  warehouse_id: number;
  county: string;
  start_date: string;
  end_date: string;
  status: DistributionEventStatus | string;
  description?: string | null;
  created_by: number;
  created_at: string;
}

export interface DistributionEventCreate {
  name: string;
  disaster_type: string;
  warehouse_id: number;
  county: string;
  start_date: string;
  end_date: string;
  status?: DistributionEventStatus;
  description?: string;
}

export interface DistributionEventUpdate {
  name?: string;
  disaster_type?: string;
  warehouse_id?: number;
  county?: string;
  start_date?: string;
  end_date?: string;
  status?: DistributionEventStatus;
  description?: string;
}

export interface DistributionResource {
  id: number;
  distribution_event_id: number;
  resource_id: number;
  quantity: number;
  created_at: string;
}

export interface DistributionResourceCreate {
  distribution_event_id: number;
  resource_id: number;
  quantity: number;
}

export type DistributionVerificationStatus =
  | "Pending"
  | "Delivered"
  | "Failed";

export interface DistributionVerification {
  id: number;
  distribution_event_id: number;
  beneficiary_id: number;
  resource_id: number;
  quantity: number;
  status: DistributionVerificationStatus | string;
  notes?: string | null;
  verified_by: number;
  verification_date: string;
}

export interface DistributionVerificationCreate {
  distribution_event_id: number;
  beneficiary_id: number;
  resource_id: number;
  quantity: number;
  status?: DistributionVerificationStatus;
  notes?: string;
}
