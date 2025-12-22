import { useState } from "react";
import { CompanyList } from "./components/CompanyList";
import { CompanyForm } from "./components/CompanyForm";
import { Company } from "./types/company.types";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddNew = () => {
    setSelectedCompany(null);
    setShowForm(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedCompany(null);
    setRefreshKey((prev) => prev + 1); // Trigger refresh
    window.location.reload(); // Simple reload for now
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedCompany(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Company Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your organization's companies
            </p>
          </div>
          <button onClick={handleAddNew} className="btn-primary">
            <svg
              className="w-5 h-5 inline-block mr-2 -mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
          <CompanyList key={refreshKey} onEdit={handleEdit} />
        </div>

        {/* Company Form Modal */}
        {showForm && (
          <CompanyForm
            company={selectedCompany}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default App;
