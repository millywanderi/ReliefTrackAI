import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type {
  Beneficiary,
  BeneficiaryCreate,
} from "../types";

const beneficiarySchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters"),

  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters"),

  gender: z
    .string()
    .min(1, "Please select a gender"),

  date_of_birth: z
    .string()
    .optional(),

  national_id: z
    .string()
    .optional(),

  phone: z
    .string()
    .optional(),

  county: z
    .string()
    .min(2, "County is required"),

  sub_county: z
    .string()
    .optional(),

  ward: z
    .string()
    .optional(),

  village: z
    .string()
    .optional(),

  latitude: z
    .string()
    .optional(),

  longitude: z
    .string()
    .optional(),
});

type BeneficiaryFormValues = z.infer<
  typeof beneficiarySchema
>;

interface BeneficiaryFormProps {
  beneficiary?: Beneficiary | null;
  onSubmit: (data: BeneficiaryCreate) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function BeneficiaryForm({
  beneficiary,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BeneficiaryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: "",
      date_of_birth: "",
      national_id: "",
      phone: "",
      county: "",
      sub_county: "",
      ward: "",
      village: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    if (beneficiary) {
      reset({
        first_name: beneficiary.first_name,
        last_name: beneficiary.last_name,
        gender: beneficiary.gender,
        date_of_birth:
          beneficiary.date_of_birth ?? "",
        national_id:
          beneficiary.national_id ?? "",
        phone: beneficiary.phone ?? "",
        county: beneficiary.county,
        sub_county:
          beneficiary.sub_county ?? "",
        ward: beneficiary.ward ?? "",
        village:
          beneficiary.village ?? "",
        latitude:
          beneficiary.latitude?.toString() ?? "",
        longitude:
          beneficiary.longitude?.toString() ?? "",
      });
    } else {
      reset({
        first_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        national_id: "",
        phone: "",
        county: "",
        sub_county: "",
        ward: "",
        village: "",
        latitude: "",
        longitude: "",
      });
    }
  }, [beneficiary, reset]);

  const submitForm = async (
    values: BeneficiaryFormValues,
  ) => {
    const data: BeneficiaryCreate = {
      first_name: values.first_name,
      last_name: values.last_name,
      gender: values.gender,
      date_of_birth:
        values.date_of_birth || null,
      national_id:
        values.national_id || null,
      phone:
        values.phone || null,
      county: values.county,
      sub_county:
        values.sub_county || null,
      ward:
        values.ward || null,
      village:
        values.village || null,
      latitude:
        values.latitude
          ? Number(values.latitude)
          : null,
      longitude:
        values.longitude
          ? Number(values.longitude)
          : null,
    };

    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="First Name"
          error={errors.first_name?.message}
        >
          <input
            {...register("first_name")}
            className="input-field"
            placeholder="Enter first name"
          />
        </FormField>

        <FormField
          label="Last Name"
          error={errors.last_name?.message}
        >
          <input
            {...register("last_name")}
            className="input-field"
            placeholder="Enter last name"
          />
        </FormField>

        <FormField
          label="Gender"
          error={errors.gender?.message}
        >
          <select
            {...register("gender")}
            className="input-field"
          >
            <option value="">
              Select gender
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
        </FormField>

        <FormField
          label="Date of Birth"
          error={errors.date_of_birth?.message}
        >
          <input
            type="date"
            {...register("date_of_birth")}
            className="input-field"
          />
        </FormField>

        <FormField
          label="National ID"
          error={errors.national_id?.message}
        >
          <input
            {...register("national_id")}
            className="input-field"
            placeholder="Enter national ID"
          />
        </FormField>

        <FormField
          label="Phone"
          error={errors.phone?.message}
        >
          <input
            {...register("phone")}
            className="input-field"
            placeholder="e.g. 0712345678"
          />
        </FormField>

        <FormField
          label="County"
          error={errors.county?.message}
        >
          <input
            {...register("county")}
            className="input-field"
            placeholder="Enter county"
          />
        </FormField>

        <FormField
          label="Sub County"
          error={errors.sub_county?.message}
        >
          <input
            {...register("sub_county")}
            className="input-field"
            placeholder="Enter sub county"
          />
        </FormField>

        <FormField
          label="Ward"
          error={errors.ward?.message}
        >
          <input
            {...register("ward")}
            className="input-field"
            placeholder="Enter ward"
          />
        </FormField>

        <FormField
          label="Village"
          error={errors.village?.message}
        >
          <input
            {...register("village")}
            className="input-field"
            placeholder="Enter village"
          />
        </FormField>

        <FormField
          label="Latitude"
          error={errors.latitude?.message}
        >
          <input
            {...register("latitude")}
            className="input-field"
            placeholder="e.g. -1.286389"
          />
        </FormField>

        <FormField
          label="Longitude"
          error={errors.longitude?.message}
        >
          <input
            {...register("longitude")}
            className="input-field"
            placeholder="e.g. 36.817223"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : beneficiary
              ? "Update Beneficiary"
              : "Add Beneficiary"}
        </button>
      </div>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({
  label,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default BeneficiaryForm;
