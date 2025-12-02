export default function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 gap-12 p-10">

      <div className="text-center max-w-4xl p-8 bg-base-200 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Medical Information System (HIS)</h1>
        <p className="text-lg text-base-content/80 mb-6">
          A comprehensive system for managing patient information. 
          It provides doctors with quick access to medical history, 
          patients with monitoring of their own health data, 
          laboratories with integration of test results, 
          and secure management of medical documents.
        </p>
      </div>

      <div className="text-center max-w-3xl p-6 bg-base-200 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Course Project – GitHub</h2>
        <p className="mb-6 text-base-content/80">
          The source code for the HIS project is available in two repositories: backend and frontend.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/JakubW381/medical-information-system-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Backend
          </a>
          <a
            href="https://github.com/JakubW381/medical-information-system-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Frontend
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full text-center">
        <div className="p-6 bg-base-200 rounded-lg shadow hover:shadow-lg transition">
          <div className="text-5xl mb-3">🩺</div>
          <h2 className="text-xl font-semibold mb-2">Doctors</h2>
          <p className="text-base-content/70">Quick access to patient history and medical records.</p>
        </div>
        <div className="p-6 bg-base-200 rounded-lg shadow hover:shadow-lg transition">
          <div className="text-5xl mb-3">👨‍⚕️</div>
          <h2 className="text-xl font-semibold mb-2">Patients</h2>
          <p className="text-base-content/70">Monitor your own health data, test results, and documents.</p>
        </div>
        <div className="p-6 bg-base-200 rounded-lg shadow hover:shadow-lg transition">
          <div className="text-5xl mb-3">🧪</div>
          <h2 className="text-xl font-semibold mb-2">Laboratories</h2>
          <p className="text-base-content/70">Integration of test results directly into the HIS system.</p>
        </div>
        <div className="p-6 bg-base-200 rounded-lg shadow hover:shadow-lg transition">
          <div className="text-5xl mb-3">📄</div>
          <h2 className="text-xl font-semibold mb-2">Documents</h2>
          <p className="text-base-content/70">Secure storage and sharing of medical documentation.</p>
        </div>
      </div>

    </div>
  );
}
