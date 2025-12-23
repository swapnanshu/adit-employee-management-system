import { useState, useEffect } from "react";
import { Company } from "../types/company.types";
import { companyService } from "../services/companyService";

interface CompanyListProps {
  onEdit: (company: Company) => void;
}

export function CompanyList({ onEdit }: CompanyListProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError("Failed to load companies. Please try again.");
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await companyService.delete(id);
      setCompanies(companies.filter((c) => c.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete company. It may have associated employees.");
      console.error("Error deleting company:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center py-12"
        role="status"
        aria-label="Loading companies"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
          aria-hidden="true"
        ></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200" role="alert">
        <p className="text-red-600">{error}</p>
        <button onClick={loadCompanies} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="card text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-slate-900">
          No companies yet
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Get started by creating a new company.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="min-w-full bg-white border border-slate-200 rounded-lg"
        aria-label="Companies List"
      >
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
            >
              Company Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
            >
              Industry
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
            >
              Created
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {companies.map((company) => (
            <tr
              key={company.id}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">
                  {company.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-600">{company.industry}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-600">
                  {formatDate(company.created_at)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(company)}
                  className="text-primary-600 hover:text-primary-900 mr-4 focus:outline-none focus:underline"
                  aria-label={`Edit ${company.name}`}
                >
                  Edit
                </button>
                {deleteConfirm === company.id ? (
                  <div className="inline-flex space-x-2">
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                      aria-label="Confirm Deletion"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="text-slate-600 hover:text-slate-900 focus:outline-none focus:underline"
                      aria-label="Cancel Deletion"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(company.id)}
                    className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                    aria-label={`Delete ${company.name}`}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
