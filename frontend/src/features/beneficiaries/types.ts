export interface Beneficiary {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string | null;
  national_id: string | null;
  phone: string | null;
  county: string;
  sub_county: string | null;
  ward: string | null;
  village: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface BeneficiaryCreate {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth?: string | null;
  national_id?: string | null;
  phone?: string | null;
  county: string;
  sub_county?: string | null;
  ward?: string | null;
  village?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface BeneficiaryUpdate {
  first_name?: string;
  last_name?: string;
  gender?: string;
  date_of_birth?: string | null;
  national_id?: string | null;
  phone?: string | null;
  county?: string;
  sub_county?: string | null;
  ward?: string | null;
  village?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface BeneficiaryFilters {
  search?: string;
  county?: string;
  gender?: string;
  page?: number;
  limit?: number;
}
