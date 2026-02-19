
export default function Loading({ loadingIsActive }) {
    if (!loadingIsActive) return null;

    return (
        <div>
            <div className="fixed inset-0 bg-blue-700 opacity-15 flex justify-center items-center z-50">
                <div className="flex gap-2 justify-center items-center mb-4 relative">
                    <div className="animate-pulse bg-repeat min-h-4 min-w-4 bg-white rounded-full">
                    </div>
                    <div className="animate-pulse min-h-4 min-w-4 bg-white rounded-full delay-100">
                    </div>
                    <div className="animate-pulse min-h-4 min-w-4 bg-white rounded-full delay-100">
                    </div>
                    <div className="animate-pulse min-h-4 min-w-4 bg-white rounded-full delay-100">
                    </div>
                </div>
            </div>
        </div>
    )
}