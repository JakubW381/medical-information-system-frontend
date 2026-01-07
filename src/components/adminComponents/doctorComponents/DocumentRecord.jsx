import { useState } from "react";
import { base64ToBlob } from "../../../util/FilesReader.jsx";
import DicomViewer from "../../../util/DicomViewer.jsx";

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
            <h2 className="text-lg font-bold truncate">
              {document.patient.name} {document.patient.lastName}
            </h2>
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