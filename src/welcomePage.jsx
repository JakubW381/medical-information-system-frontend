export default function welcome() {

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row">
                <img
                    src="/public/medical-information-systems-high-resolution-logo-transparent.png"
                    className="max-w-sm rounded-lg shadow-2xl"
                />
                <div>
                    <h1 className="text-5xl font-bold">Innovation is here</h1>
                    <p className="py-6">
                        It's 2025 and new era is coming.
                        Join us to get superior patients data manager and analyzer for your medical facility
                    </p>
                    <button className="btn btn-primary">Get Started</button>
                </div>
            </div>
        </div>
    )
}