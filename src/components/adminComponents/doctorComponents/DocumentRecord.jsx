import { useNavigate } from "react-router-dom";

export default function DocumentRecord({ document }) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("doc click");
    // navigate(`/documents/${document.documentId}`); // jak chcesz routing
  };

  return (
    <div
      className="card flex flex-row bg-base-300 shadow-md rounded-lg p-4 
                 hover:shadow-xl hover:bg-green-600 transition cursor-pointer 
                 w-full h-60"
      onClick={handleClick}
    >
      <div className="w-32 h-50 mr-4 flex-shrink-0">
        <img
          src={document.thumbnailSignedURL}
          alt="Document thumbnail"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="flex flex-col  overflow-hidden">
        <h2 className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {document.patient.name} {document.patient.lastName}
        </h2>

        <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          <strong>Sender:</strong> {document.sender.name} {document.sender.lastName}
        </p>

        <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          <strong>Date:</strong> {new Date(document.dateTime).toLocaleString()}
        </p>

        {document.tags && document.tags.length > 0 && (
          <p className="text-sm  text-ellipsis">
            <strong>Tags:</strong> {document.tags.slice(0, 10).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
