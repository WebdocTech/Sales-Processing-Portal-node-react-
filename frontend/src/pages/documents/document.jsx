import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  CircleCheck,
  Clock,
  FileText,
  Ellipsis,
  ChevronLeft,
  ChevronRight,
  Loader,
} from "lucide-react";
import { formatTo12Hour } from "../../helpers/date-formatter";
import { BASE_URL } from "../../config";
import { getAllCompanies, getAllServices } from "../../helpers/apis-helper";
export default function UploadedFilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [center, setCenter] = useState("");
  const [initial, setInitial] = useState(true); // to prevent auto-fetch on first load
  const [serviceId, setserviceId] = useState();
  const [companyName, setCompanyName] = useState("");
  const [companies, setCompanies] = useState([]);
  const [services, setServices] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await getAllCompanies();
      console.log("Companies fetched:", response);
      if (response.success) {
        setCompanies(response.data);
      } else {
        toast.error("Failed to fetch companies ");
      }
    };
    fetchCompanies();
  }, []);

  const fetchServices = useCallback(
    async (id) => {
      const response = await getAllServices(id);
      console.log("Services fetched:", response);
      if (response.success) {
        setServices(response.data);
      } else {
        toast.error("Failed to fetch services");
      }
    },
    [companyId],
  );
  useEffect(() => {
    if (companyId) {
      fetchServices(companyId);
    } else {
      setServices([]);
    }
  }, [companyId]);
  const fetchFiles = async () => {
    if (!companyId) {
      setFiles([]);
      return toast.error("Please select a company first");
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/upload?center=${center}&company_id=${companyId}&service_id=${serviceId}`,
      );

      const data = await response.json();

      if (data.success) {
        const sorted = data.uploads.sort((a, b) => {
          return new Date(b.uploaded_at) - new Date(a.uploaded_at); // latest first
        });
        setFiles(sorted);
        setCurrentPage(1); // Reset to first page when new data loads
      } else {
        setFiles([]);
        toast.error(data.message || "Failed to fetch uploaded files.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching files.");
    } finally {
      setLoading(false);
    }
  };

  // Only fetch when companyId changes (not on first page load)
  useEffect(() => {
    if (initial) {
      setInitial(false);
      return;
    }
    if (center) {
      fetchFiles();
    }
  }, [center, companyId, serviceId]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(files.length / itemsPerPage);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getServiceName = (serviceid) => {
    switch (serviceid) {
      case "API_MIS":
        return "MIS";
      case "API_HIS":
        return "HIS";
      case "API_HBS":
        return "HBS";
      default:
        return "Unknown";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-5 h-5 text-white bg-red-600 rounded-full" />;
      case "completed":
        return (
          <CircleCheck className="w-5 h-5 text-white bg-green-600 rounded-full" />
        );
      case "processing":
        return <Loader className="w-5 h-5 text-blue-800 animate-spin" />;
      default:
        return null;
    }
  };

  // const handleFileProcessing = async (file) => {
  //   if (!center) {
  //     toast.error("Please select a center before starting the process.");
  //     return;
  //   }

  //   const apiUrl = `https://digital.webdoc.com.pk/Promotion/api/process-file/${
  //     file.id
  //   }/${file.serviceid}?center_name=${encodeURIComponent(center)}`;

  //   try {
  //     setProcessingFiles((prev) => [...prev, file.id]);
  //     const response = await fetch(apiUrl, {
  //       method: "GET", // Assuming it's a GET request
  //     });
  //     const data = await response.json();

  //     if (response.ok) {
  //       toast.success(`File ${file.filename} processing completed!`);
  //       console.log("Processing response:", data);
  //       fetchFiles();
  //     } else {
  //       toast.error(
  //         data.message || `Failed to start processing ${file.filename}`
  //       );
  //       console.error("Processing error:", data);
  //     }
  //   } catch (err) {
  //     toast.error("Something went wrong during file processing.", {
  //       id: "process",
  //     });
  //     console.error(err);
  //   } finally {
  //     // Remove file.id from processingFiles
  //     setProcessingFiles((prev) => prev.filter((id) => id !== file.id));
  //   }
  // };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-3xl gap-3 flex items-center font-semibold text-gray-800 mb-4">
          <FileText className="w-8 h-8 text-teal-100" />
          Uploaded Files
        </h1>
        {center && (
          <button
            onClick={fetchFiles}
            className="bg-teal-100 text-black cursor-pointer font-semibold px-6 py-2 rounded-md"
          >
            Refresh
          </button>
        )}
      </div>
      {/* Company Selection */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Select Company
        </label>
        <select
          value={companyId}
          onChange={(e) => {
            setCompanyId(e.target.value);
            setCompanyName(e.target.options[e.target.selectedIndex].text);
          }}
          className="w-full p-3 border rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-100"
        >
          <option value="">-- Choose a company --</option>
          {/* <option value="4">Telo</option>
            <option value="1">Sybrid</option> */}
          {companies.map((company) => (
            <option key={company.id} value={company.id} name={company.name}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Select Service
        </label>
        <select
          value={serviceId}
          onChange={(e) => setserviceId(e.target.value)}
          className="w-full p-3 border rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-100"
        >
          <option value="">-- Choose a service --</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Select Center
        </label>
        <select
          value={center}
          onChange={(e) => setCenter(e.target.value)}
          className="w-full p-3 border rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-100"
        >
          <option value="">-- Choose Call center --</option>
          <option value="Telo">Telo</option>
          <option value="Sybrid">Sybrid</option>
          <option value="Whatsapp">Whatsapp</option>
          {/* Conditional centers for Ufone */}
          {companies.find((c) => c.id == companyId)?.name === "Ufone" && (
            <>
              <option value="Technologist">Technologist</option>
              <option value="Apexsolutions">Apexsolutions</option>
            </>
          )}
        </select>
      </div>
      {/* <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Select Center
        </label>
        <select
          value={companyId}
          onChange={(e) => {
            setCompanyId(e.target.value);
            setCenter(e.target.options[e.target.selectedIndex].text);
          }}
          className="w-full p-3 border rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-100"
        >
          <option value="">-- Choose Call Center --</option>
          <option value="Telo">Telo</option>
          <option value="Sybrid">Sybrid</option>
          <option value="Whatsapp">Whatsapp</option>
          <option value="Technologist">Technologist</option>
          <option value="Apexsolutions">Apexsolutions</option>
        </select>
      </div> */}

      {/* No company selected */}
      {!companyId ? (
        <p className="text-gray-600 mt-4">
          Please select a company to view uploaded files.
        </p>
      ) : loading ? (
        <p className="text-gray-500">Loading files...</p>
      ) : files.length === 0 ? (
        <p className="text-gray-500">No files uploaded for this company.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-lg border border-teal-100 mb-4">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-teal-100 text-black">
                <tr>
                  <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Service
                  </th>
                  <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Uploaded At
                  </th>
                  <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Completion At
                  </th>
                  <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Status
                  </th>
                  <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Total Count
                  </th>
                  {/* <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Processed Count
                  </th> */}
                  <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Charging Success Count
                  </th>
                  <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Charging Failed Count
                  </th>
                  <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Subscription Success Count
                  </th>
                  <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Subscription Failed Count
                  </th>
                  <th className="p-2 md:px-6 md:py-3 text-center text-xs md:text-md xl:text-base font-semibold">
                    Processed Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 md:px-4 md:py-3 text-xs md:text-md xl:text-base text-center text-gray-700">
                      {getServiceName(file.service_api_key)}
                    </td>
                    <td className="p-3 md:px-4 md:py-3 text-xs md:text-md xl:text-base text-center text-gray-700">
                      {formatTo12Hour(file.uploaded_at)}
                    </td>
                    <td className="p-3 md:px-4 md:py-3 text-xs md:text-md xl:text-base text-center text-gray-700">
                      {formatTo12Hour(file.completed_at)}
                    </td>
                    <td className="p-3 md:px-4 md:py-3 text-xs md:text-md xl:text-base">
                      <div className="flex items-center justify-center gap-1">
                        {getStatusIcon(file.status)}
                        <span>{file.status}</span>
                      </div>
                    </td>
                    <td className="p-3 md:px-4 md:py-3 font-medium text-xs md:text-md xl:text-base text-center text-gray-600">
                      {file.total_count}
                    </td>
                    <td className="p-3 md:px-4 md:py-3 font-medium text-xs md:text-md xl:text-base text-center text-gray-600">
                      {file.charging_success_count}
                    </td>
                    <td className="p-3 md:px-4 md:py-3 font-medium text-xs md:text-md xl:text-base text-center text-gray-600">
                      {file.charging_failed_count}
                    </td>
                    <td className="p-3 md:px-4 md:py-3 font-medium text-xs md:text-md xl:text-base text-center text-gray-600">
                      {file.subscription_success_count}
                    </td>
                    <td className="p-3 md:px-4 md:py-3 font-medium text-xs md:text-md xl:text-base text-center text-gray-600">
                      {file.subscription_failed_count}
                    </td>
                    <td className="p-3 md:px-4 md:py-3 font-medium text-xs md:text-md xl:text-base text-center text-gray-600">
                      {file.processed_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200 rounded-lg">
              {/* Page Info */}
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, files.length)}
                </span>{" "}
                of <span className="font-medium">{files.length}</span> results
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${
                    currentPage === 1
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300 cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                      currentPage === pageNumber
                        ? "bg-teal-100 text-teal-700 border-teal-200"
                        : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300 cursor-pointer"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${
                    currentPage === totalPages
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300 cursor-pointer"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
