import { useEffect, useState } from "react";
import { CompanyList } from "./components/CompanyList";
import { CompanyForm } from "./components/CompanyForm";
import { Company } from "./types/company.types";
import { companyService } from "./services/companyService";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddNew = () => {
    setSelectedCompany(null);
    setShowForm(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setShowForm(true);
  };

  const handleConfirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await companyService.delete(deleteConfirmId);
      setRefreshKey((prev) => prev + 1);
      setDeleteConfirmId(null);
    } catch (err) {
      alert("Failed to delete company. It may have associated employees.");
      console.error("Error deleting company:", err);
      setDeleteConfirmId(null);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedCompany(null);
    setRefreshKey((prev) => prev + 1); // Trigger refresh
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedCompany(null); // Corrected from setSelectedEmployee to setSelectedCompany
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDeleteConfirmId(null);
    };
    if (deleteConfirmId) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [deleteConfirmId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Company Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your organization's companies
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="btn-primary w-full md:w-fit px-8"
          >
            <svg
              className="w-5 h-5 inline-block mr-2 -mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Company
          </button>
        </div>

        {/* Company List */}
        <div className="card">
          <CompanyList
            key={refreshKey}
            onEdit={handleEdit}
            onDelete={handleConfirmDelete}
          />
        </div>

        {/* Company Form Modal */}
        {showForm && (
          <CompanyForm
            company={selectedCompany}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this company? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
