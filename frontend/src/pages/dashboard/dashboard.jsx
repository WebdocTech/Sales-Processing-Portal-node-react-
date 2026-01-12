import { UploadCloud, FileText, X } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { getAllCompanies, getAllServices } from "../../helpers/apis-helper";
import { BASE_URL } from "../../config";

export default function UploadFilePage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [serviceId, setserviceId] = useState();
  const [companyId, setCompanyId] = useState("");
  const [center, setCenter] = useState("");
  const [companies, setCompanies] = useState([]);
  const [services, setServices] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const isXlsx = selectedFile.name.toLowerCase().endsWith(".xlsx");

      if (isXlsx) {
        setFile(selectedFile);
        console.log("File selected:", selectedFile.name);
      } else {
        toast.error("Error: Only .xlsx files are allowed.");
        e.target.value = null;
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!serviceId) {
      toast.error("Please select a service before uploading.");
      return;
    }
    if (!companyId) {
      toast.error("Please select a company.");
      return;
    }
    if (!center) {
      toast.error("Please select a call center.");
      return;
    }
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    const selectedService = services.find(
      (service) => service.id === Number(serviceId)
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("center", center);
    formData.append("service_api_id", selectedService.service_api_id);
    formData.append("service_api_key", selectedService.service_api_key);
    formData.append("service_id", serviceId);
    try {
      setIsUploading(true);

      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("File uploaded successfully!");
        setFile(null);
        setserviceId();
        console.log("Upload response:", data);
      } else {
        toast.error(data.message || "Upload failed. Try again.");
        console.error("Upload error:", data);
      }
    } catch (err) {
      toast.error("Something went wrong during upload.");
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // reset input
      }
    }
  };

  const clearFile = () => setFile(null);
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

  const fetchServices = useCallback(async (id) => {
    const response = await getAllServices(id);
    console.log("Services fetched:", response);
    if (response.success) {
      setServices(response.data);
    } else {
      toast.error("Failed to fetch services");
    }
  }, []);
  useEffect(() => {
    if (companyId) {
      fetchServices(companyId);
    } else {
      setServices([]);
    }
  }, [companyId]);
  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        📁 Document Upload
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {/* Dropdown for Service Name */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Select Company
          </label>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-100"
          >
            <option value="">-- Choose a company --</option>
            {/* <option value="4">Telo</option>
            <option value="1">Sybrid</option> */}
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
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
          </select>
        </div>
        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition duration-300 ${
            isDragging
              ? "border-teal-400 bg-teal-50"
              : "border-gray-300 hover:border-teal-400 hover:bg-gray-50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <UploadCloud className="w-12 h-12 text-teal-500 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">
            Drag and drop your file here, or{" "}
            <span className="text-teal-600 font-semibold">click to browse</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">(.xlsx only)</p>

          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
            accept=".xlsx"
            ref={fileInputRef}
          />
        </div>

        {/* Selected File */}
        {file && (
          <div className="mt-6 flex items-center justify-between p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-teal-600" />
              <span className="font-medium text-gray-800">{file.name}</span>
              <span className="text-sm text-gray-500">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <button
              onClick={clearFile}
              className="text-gray-500 hover:text-red-600 transition"
              title="Remove file"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-8">
          <button
            onClick={handleUpload}
            disabled={!file || !serviceId || !companyId || isUploading}
            className={`w-full py-3 cursor-pointer rounded-lg text-white font-semibold transition duration-300 ${
              file && serviceId && companyId
                ? "bg-teal-500 hover:bg-teal-600 shadow-md"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </div>
    </div>
  );
}
