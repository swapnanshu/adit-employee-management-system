import { useState, useEffect } from "react";
import {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
} from "../types/company.types";
import { companyService } from "../services/companyService";

interface CompanyFormProps {
  company: Company | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CompanyForm({
  company,
  onSuccess,
  onCancel,
}: CompanyFormProps) {
  const [formData, setFormData] = useState<CreateCompanyDto>({
    name: "",
    industry: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        industry: company.industry,
      });
    } else {
      setFormData({ name: "", industry: "" });
    }
    setErrors({});
  }, [company]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Company name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Company name must not exceed 100 characters";
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    } else if (formData.industry.length < 2) {
      newErrors.industry = "Industry must be at least 2 characters";
    } else if (formData.industry.length > 50) {
      newErrors.industry = "Industry must not exceed 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      if (company) {
        // Update existing company
        const updateData: UpdateCompanyDto = {};
        if (formData.name !== company.name) updateData.name = formData.name;
        if (formData.industry !== company.industry)
          updateData.industry = formData.industry;

        if (Object.keys(updateData).length > 0) {
          await companyService.update(company.id, updateData);
        }
      } else {
        // Create new company
        await companyService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "An error occurred";
      if (errorMessage.includes("already exists")) {
        setErrors({ name: "A company with this name already exists" });
      } else {
        setErrors({ submit: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 id="modal-title" className="text-xl font-bold text-slate-900">
            {company ? "Edit Company" : "Add New Company"}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
            disabled={loading}
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company Name */}
          <div>
            <label htmlFor="name" className="label">
              Company Name{" "}
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
              <span className="sr-only">required</span>
            </label>
            <input
              id="name"
              type="text"
              className={`input ${
                errors.name ? "border-red-500 focus:ring-red-500" : ""
              }`}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Tech Innovations Inc"
              disabled={loading}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="label">
              Industry{" "}
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
              <span className="sr-only">required</span>
            </label>
            <input
              id="industry"
              type="text"
              className={`input ${
                errors.industry ? "border-red-500 focus:ring-red-500" : ""
              }`}
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
              placeholder="e.g., Technology"
              disabled={loading}
              aria-required="true"
              aria-invalid={!!errors.industry}
              aria-describedby={errors.industry ? "industry-error" : undefined}
            />
            {errors.industry && (
              <p
                id="industry-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.industry}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div
              className="p-3 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
            >
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {company ? "Updating..." : "Creating..."}
                </span>
              ) : company ? (
                "Update Company"
              ) : (
                "Create Company"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
