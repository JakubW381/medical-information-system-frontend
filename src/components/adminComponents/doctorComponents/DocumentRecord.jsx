import { useState } from "react";
import { base64ToBlob } from "../../../util/FilesReader.jsx";
import DicomViewer from "../../../util/DicomViewer.jsx";
import api from "../../../util/Axios.js";

export default function DocumentRecord({ document, fetchFun }) {
  const [openedFile, setOpenedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    if (openedFile) {
      setIsModalOpen(true);
      return;
    }

    const file = await fetchFun(document.id);
    if (file) {
      const blob = base64ToBlob(file.base64, file.mimeType);
      const blobUrl = URL.createObjectURL(blob);

      setOpenedFile({ ...file, blobUrl });
      setIsModalOpen(true);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      const response = await api.get(`/api/user/document/${document.id}/share`, { withCredentials: true });
      if (response.data) {
        await navigator.clipboard.writeText(response.data);
        alert("Link copied to clipboard!\n" + response.data);
      }
    } catch (err) {
      console.error("Share failed", err);
      alert("Failed to create share link");
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const file = await fetchFun(document.id);
      if (file) {
        let extension = "";
        switch (file.mimeType) {
          case "image/jpeg": extension = ".jpg"; break;
          case "image/png": extension = ".png"; break;
          case "application/pdf": extension = ".pdf"; break;
          case "application/dicom": extension = ".dcm"; break;
          default: extension = "";
        }

        const blob = base64ToBlob(file.base64, file.mimeType);
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `document_${document.id}${extension}`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <>
      <div
        className="card flex flex-row bg-base-300 shadow-md rounded-lg p-4
                   hover:shadow-xl hover:bg-green-600 transition cursor-pointer
                   w-full h-48"
        onClick={handleClick}
      >

        <div className="w-32 h-full mr-4 flex-shrink-0">
          <img
            src={document.thumbnailSignedURL}
            alt="Thumbnail"
            className="w-full h-full object-cover rounded-md"
          />
        </div>


        <div className="flex flex-col overflow-hidden w-full text-left">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold truncate">
              {document.patient.name} {document.patient.lastName}
            </h2>
            <div className="flex gap-1 justify-end">
              <button
                onClick={handleShare}
                className="btn btn-sm btn-circle btn-ghost"
                title="Share (24h)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
              <button
                onClick={handleDownload}
                className="btn btn-sm btn-circle btn-ghost"
                title="Download"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-sm truncate"><strong>Sender:</strong> {document.sender.name}</p>
          <p className="text-sm"><strong>Date:</strong> {new Date(document.dateTime).toLocaleDateString()}</p>

          <div className="flex flex-wrap gap-1 mt-2">
            {document.tags?.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-base-100 rounded text-[10px] border border-base-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>


      {isModalOpen && openedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative bg-base-100 rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">


            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">View Document</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setIsModalOpen(false)}
              >✕</button>
            </div>


            <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
              {openedFile.mimeType.startsWith("image/") && (
                <img src={openedFile.blobUrl} alt="file" className="max-w-full h-auto" />
              )}

              {openedFile.mimeType === "application/pdf" && (
                <iframe src={openedFile.blobUrl} className="w-full h-full" title="pdf-preview" />
              )}

              {openedFile.mimeType === "application/dicom" ? (
                <DicomViewer blobUrl={openedFile.blobUrl} />
              ) : (
                <>
                  {openedFile.mimeType.startsWith("image/") && (
                    <img src={openedFile.blobUrl} alt="file" className="max-w-full h-auto" />
                  )}

                  {openedFile.mimeType === "application/pdf" && (
                    <iframe src={openedFile.blobUrl} className="w-full h-full" title="pdf-preview" />
                  )}
                </>
              )}

              {openedFile.mimeType === "unknown" && <p>Nieznany typ pliku</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}