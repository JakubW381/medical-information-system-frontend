import { useNavigate } from "react-router-dom";

export default function DocumentRecord({ document }) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("doc click");
  };

  return (
    <div
      className="card flex flex-row bg-base-300 shadow-md rounded-lg p-4 
                 hover:shadow-xl hover:bg-green-600 transition cursor-pointer 
                 w-full h-70"
      onClick={handleClick}
    >
      {/* LEFT SIDE IMAGE */}
      <div className="w-32 h-full mr-4 flex-shrink-0">
        <img
          src={document.thumbnailSignedURL}
          alt="Document thumbnail"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex flex-col overflow-hidden w-full">
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
          <div className="flex flex-col w-full mt-2">
            <strong className="mb-1">Tags:</strong>

            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
              {document.tags.slice(0, 10).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-base-100 rounded-md text-xs font-medium 
                             border border-base-300 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
