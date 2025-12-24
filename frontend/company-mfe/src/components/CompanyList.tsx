import { useState, useEffect } from "react";
import { Company } from "../types/company.types";
import { companyService } from "../services/companyService";

interface CompanyListProps {
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

export function CompanyList({ onEdit, onDelete }: CompanyListProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ASC" | "DESC";
  }>({ key: "created_at", direction: "DESC" });

  useEffect(() => {
    loadCompanies();
  }, [searchTerm, sortConfig]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll({
        search: searchTerm,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
      });
      setCompanies(data);
    } catch (err) {
      setError("Failed to load companies. Please try again.");
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "ASC" ? "DESC" : "ASC",
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column)
      return <span className="ml-1 opacity-20">↕</span>;
    return (
      <span className="ml-1 text-primary-600">
        {sortConfig.direction === "ASC" ? "↑" : "↓"}
      </span>
    );
  };

  if (loading && companies.length === 0) {
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

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by company name..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {error ? (
        <div className="card bg-red-50 border-red-200" role="alert">
          <p className="text-red-600">{error}</p>
          <button onClick={loadCompanies} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      ) : companies.length === 0 ? (
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
            {searchTerm ? "No companies found" : "No companies yet"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchTerm
              ? "Try adjusting your search term."
              : "Get started by creating a new company."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="min-w-full bg-white border border-slate-200 rounded-lg"
            aria-label="Companies List"
          >
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  Company Name <SortIcon column="name" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort("industry")}
                >
                  Industry <SortIcon column="industry" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  Created <SortIcon column="created_at" />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
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
                    <div className="text-sm text-slate-600">
                      {company.industry}
                    </div>
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
                    <button
                      onClick={() => onDelete(company.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                      aria-label={`Delete ${company.name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
