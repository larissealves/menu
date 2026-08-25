import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function DeployDocumentation() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
                <div className="flex flex-wrap items-center gap-2 border-b pb-2 mb-5">
                <Link
                    to="/"
                    className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                >
                    ← Home
                </Link>

                <Link
                    to="/DataBaseSchema"
                    target="_blank"
                    className="px-3 py-1.5 rounded-md text-sm font-medium text-violet-600 hover:bg-violet-50 transition"
                >
                    Data Base Schema↗
                </Link>

                <Link
                    to="/ProjectDocumentation"
                    target="_blank"
                    className="px-4 py-2 rounded-full text-gray-600 font-medium text-sm hover:bg-gray-100 hover:text-gray-900 transition"
                >
                    Project Documentation ↗
                </Link>
            </div>

                {/* Header */}
                <header className="space-y-3">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-700">
                        ⚙️ Basic Deployment Configuration
                    </h1>

                    <p className="text-gray-500 text-lg">
                        Basic configuration required to deploy the Saboré application.
                    </p>
                </header>

                {/* Render */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700">
                            🚀 Render — Backend
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Configuration used to deploy and run the backend application.
                        </p>
                    </div>

                    {/* Render Dashboard */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                            Render Service
                        </h3>

                        <a
                            href="https://dashboard.render.com/web/srv-d1t6oc6r433s73f2cp80/settings"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-600 hover:text-violet-800 font-medium underline"
                        >
                            Open Render Dashboard ↗
                        </a>
                    </div>

                    {/* Build configuration */}
                    <div className="space-y-5">
                        <h3 className="text-xl font-semibold text-gray-700">
                            Build Configuration
                        </h3>

                        <div className="grid gap-4">

                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-sm font-semibold text-gray-500 mb-1">
                                    Source
                                </p>
                                <p className="font-medium text-gray-700">
                                    Git Repository
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-sm font-semibold text-gray-500 mb-1">
                                    Branch
                                </p>
                                <p className="text-gray-700">
                                    Git repository branch containing the version you want to
                                    deploy.
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-sm font-semibold text-gray-500 mb-2">
                                    Build Command
                                </p>

                                <code className="block bg-gray-900 text-gray-100 rounded-lg px-4 py-3 font-mono text-sm">
                                    npm install
                                </code>

                                <p className="text-sm text-gray-500 mt-2">
                                    Installs the dependencies required by the backend.
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-sm font-semibold text-gray-500 mb-2">
                                    Start Command
                                </p>

                                <code className="block bg-gray-900 text-gray-100 rounded-lg px-4 py-3 font-mono text-sm">
                                    npm start
                                </code>

                                <p className="text-sm text-gray-500 mt-2">
                                    Command used to start the backend server.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 rounded-xl bg-gray-50 border border-gray-200 p-4">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">
                                        Auto Deploy
                                    </p>
                                    <p className="font-semibold text-green-600">
                                        On Commit
                                    </p>
                                </div>

                                <div className="flex-1 rounded-xl bg-gray-50 border border-gray-200 p-4">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">
                                        PR Reviews
                                    </p>
                                    <p className="font-semibold text-gray-600">
                                        Off
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Environment variables */}
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700">
                                Environment Variables
                            </h3>

                            <p className="text-gray-500 mt-1">
                                Create each variable and define its corresponding value in
                                Render.
                            </p>
                        </div>

                        <div className="space-y-4">

                            <div className="rounded-xl border border-violet-100 bg-violet-50 p-5">
                                <code className="font-bold text-violet-700">
                                    ADMIN_KEY
                                </code>

                                <p className="text-gray-600 mt-2">
                                    Used to verify permissions before performing CRUD actions.
                                </p>
                            </div>

                            <div className="rounded-xl border border-violet-100 bg-violet-50 p-5">
                                <code className="font-bold text-violet-700">
                                    API_SECRET
                                </code>

                                <p className="text-gray-600 mt-2">
                                    Used by the frontend hosted on Vercel for specific API
                                    endpoints.
                                </p>
                            </div>

                            <div className="rounded-xl border border-violet-100 bg-violet-50 p-5">
                                <code className="font-bold text-violet-700">
                                    DATABASE_URL
                                </code>

                                <p className="text-gray-600 mt-2">
                                    Used to connect the backend application to the database.
                                </p>
                            </div>

                        </div>
                    </div>

                </section>

                {/* Vercel */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700">
                            ▲ Vercel — Frontend
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Configuration required to build and deploy the frontend
                            application.
                        </p>
                    </div>

                    {/* Build configuration */}
                    <div className="space-y-5">
                        <h3 className="text-xl font-semibold text-gray-700">
                            Build Configuration
                        </h3>

                        <div className="grid gap-4">

                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-sm font-semibold text-gray-500 mb-2">
                                    Build Command
                                </p>

                                <code className="block bg-gray-900 text-gray-100 rounded-lg px-4 py-3 font-mono text-sm">
                                    npm run build
                                </code>

                                <p className="text-sm text-gray-500 mt-2">
                                    You can also use:
                                </p>

                                <code className="inline-block mt-2 bg-gray-900 text-gray-100 rounded-lg px-3 py-2 font-mono text-sm">
                                    npm run vercel-build
                                </code>
                            </div>

                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-sm font-semibold text-gray-500 mb-2">
                                    Install Command
                                </p>

                                <code className="block bg-gray-900 text-gray-100 rounded-lg px-4 py-3 font-mono text-sm">
                                    npm install
                                </code>
                            </div>

                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-sm font-semibold text-gray-500 mb-1">
                                    Root Directory
                                </p>

                                <code className="font-semibold text-violet-700">
                                    client
                                </code>

                                <p className="text-sm text-gray-500 mt-2">
                                    Defines the folder containing the frontend's package.json
                                    file.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Vercel environment variables */}
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700">
                                Environment Variables
                            </h3>

                            <p className="text-gray-500 mt-1">
                                Add the backend URL so the frontend knows where to send API
                                requests.
                            </p>
                        </div>

                        <div className="space-y-4">

                            <div className="rounded-xl border border-pink-100 bg-pink-50 p-5">
                                <code className="font-bold text-pink-700">
                                    VITE_API_SECRET
                                </code>

                                <p className="text-gray-600 mt-2">
                                    Defines the API secret used by the frontend when communicating
                                    with the backend.
                                </p>
                            </div>

                            <div className="rounded-xl border border-pink-100 bg-pink-50 p-5">
                                <code className="font-bold text-pink-700">
                                    VITE_API_URL
                                </code>

                                <p className="text-gray-600 mt-2">
                                    Defines the backend URL that the frontend uses to connect to
                                    the API.
                                </p>
                            </div>

                        </div>
                    </div>

                </section>

                {/* Footer note */}
                <div className="rounded-xl bg-violet-50 border border-violet-100 p-5 text-sm text-violet-800">
                    <strong>Note:</strong> Environment variable values should be
                    configured directly in Render and Vercel. Do not commit secrets or
                    sensitive credentials to the repository.
                </div>

            </div>
        </div>
    );
}