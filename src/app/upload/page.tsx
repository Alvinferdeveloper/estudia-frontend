"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadDocument() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setMessage("");
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      return;
    }

    setUploading(true);
    setMessage("Uploading...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/documents/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (response.ok) {
        setMessage("File uploaded successfully!");
        setSelectedFile(null);
        // Optionally redirect or update UI
        // router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setMessage(`Upload failed: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setMessage("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Document</h1>
        <div className="mb-4">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">Select PDF File:</label>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>
        {selectedFile && (
          <p className="text-sm text-gray-600 mb-4">Selected file: {selectedFile.name}</p>
        )}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`w-full px-4 py-2 rounded-md text-white font-semibold ${selectedFile && !uploading ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"}`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {message && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
