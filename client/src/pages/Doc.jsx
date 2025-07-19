import React from 'react';
import { useNavigate, Link } from "react-router-dom";

import image01 from '../assets/app-images/img-01.png'
import image02 from '../assets/app-images/img-02.png'
import image03 from '../assets/app-images/img-03.png'
import image04 from '../assets/app-images/img-04.png'
import image05 from '../assets/app-images/img-05.png'
import image06 from '../assets/app-images/img-06.png'


export default function ProjectDocumentation() {
  return (
    <div className="prose max-w-4xl mx-auto px-4 py-10">
      <Link to="/" target="_blank" className="text-blue-600 underline font-bold"> ← BACK TO HOME </Link>
      <br></br>
      <h1 className="text-4xl font-bold mb-4">🍽️ Menu - Restaurant Menu Management System</h1>

      <p>
        <strong>Menu</strong> is a full-stack application designed to manage restaurant menus. It supports the creation, listing, editing, and deletion of dishes, ingredients, and tags. The project includes an admin interface and a public-facing view with filtering features.
      </p>
      <br></br>
      <p>
        Complete application for menu management with a <strong>React + Vite</strong> frontend, <strong>Express + Prisma</strong> backend, and <strong>PostgreSQL (NeonDB)</strong> database.
      </p>
      <br></br>
      <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-sm">
        ⚠️ This is a <strong>personal study project</strong> and does <strong>not include any authentication or authorization</strong> flows — neither in the API nor in the admin interface.
      </blockquote>

      <h2 className="text-2xl font-semibold mt-10">📁 Project Structure</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        <code>
          {`menu/
├── client/              # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── Router.jsx
│   │   └── styles/
│   │       └── base.css
│   ├── index.html
│   ├── vite.config.js
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vercel.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── server/
│   ├── routes/
│   ├── uploads/
│   └── index.js
├── .env
├── package.json
└── README.md`}
        </code>
      </pre>

      <h2 className="text-2xl font-semibold mt-10">🧠 Tech Stack</h2>
      <table className="table-auto border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-left">Layer</th>
            <th className="border px-4 py-2 text-left">Stack</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Frontend</td>
            <td className="border px-4 py-2">React 19, Vite, TailwindCSS, React Router</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Backend</td>
            <td className="border px-4 py-2">Express, Prisma ORM, Multer</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Database</td>
            <td className="border px-4 py-2">PostgreSQL (NeonDB)</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Hosting</td>
            <td className="border px-4 py-2">Render (Backend), Vercel (Frontend)</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold mt-10">🛠️ Local Installation</h2>
      <h3 className="text-xl font-medium mt-4">1. Clone the repository</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        <code>{`git clone https://github.com/your-user/menu.git
cd menu`}</code>
      </pre>

      <h3 className="text-xl font-medium mt-4">2. Install dependencies</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        <code>{`# Root
npm install

# Frontend
cd client
npm install`}</code>
      </pre>

      <h2 className="text-2xl font-semibold mt-10">🗃️ Database</h2>
      <p>Uses <strong>Prisma ORM</strong> with <strong>PostgreSQL</strong> (NeonDB)</p>
      <br></br>
      <p><code className="bg-gray-200 px-2 py-1 rounded">.env</code> configuration:</p>
      <br></br>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        <code>{`DATABASE_URL="postgresql://..."`}</code>
      </pre>

      <h3 className="text-xl font-medium mt-4">Useful Prisma commands</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        <code>{`npx prisma generate
npx prisma migrate dev --name init
npx prisma studio`}</code>
      </pre>

      <h2 className="text-2xl font-semibold mt-10">▶️ Running the Project</h2>
      <h3 className="text-xl font-medium mt-4">Backend</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        <code>{`npm run start`}</code>
      </pre>
      <br></br><p>Access: <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:5000/api/categories</code></p>

      <h3 className="text-xl font-medium mt-4">Frontend</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        <code>{`cd client
npm run dev`}</code>
      </pre>
      <br></br>
      <p>Access: <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:5173</code></p>

      <h2 className="text-2xl font-semibold mt-10">🚀 Deployment Overview</h2>

      <h3 className="text-xl font-medium mt-4">🗄️ Online Database (NeonDB)</h3>
      <ul className="list-disc pl-6">
        <li><strong>Type:</strong> PostgreSQL</li>
        <li><strong>Provider:</strong> <a className="text-blue-600 underline" href="https://neon.tech">NeonDB</a></li>
        <li><strong>Env Var:</strong> <code className="bg-gray-200 px-2 py-1 rounded">DATABASE_URL</code></li>
      </ul>

      <h3 className="text-xl font-medium mt-4">🛠️ Backend (Render)</h3>
      <ul className="list-disc pl-6">
        <li><strong>Provider:</strong> <a className="text-blue-600 underline" href="https://render.com">render.com</a></li>
        <li><strong>URL:</strong> https://menu-backend.onrender.com</li>
        <li><strong>Start:</strong> <code className="bg-gray-200 px-2 py-1 rounded">npm run start</code></li>
        <li><strong>Build:</strong> <code className="bg-gray-200 px-2 py-1 rounded">npm install</code></li>
        <li><strong>Env:</strong> <code className="bg-gray-200 px-2 py-1 rounded">DATABASE_URL</code></li>
      </ul>

      <h3 className="text-xl font-medium mt-4">🌐 Frontend (Vercel)</h3>
      <ul className="list-disc pl-6">
        <li><strong>Provider:</strong> <a className="text-blue-600 underline" href="https://vercel.com">vercel.com</a></li>
        <li><strong>URL:</strong> https://menu.vercel.app</li>
        <li><strong>Build:</strong> <code className="bg-gray-200 px-2 py-1 rounded">npm run build</code></li>
        <li><strong>Output:</strong> <code className="bg-gray-200 px-2 py-1 rounded">dist</code></li>
        <li><strong>Env:</strong> <code className="bg-gray-200 px-2 py-1 rounded">VITE_API_URL=https://menu-backend.onrender.com</code></li>
      </ul>

      <h3 className="text-xl font-medium mt-4">Vercel Routing (SPA)</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        <code>{`{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}`}</code>
      </pre>

      <h2 className="text-2xl font-semibold mt-10">✅ Deployment Summary</h2>
      <table className="table-auto border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Layer</th>
            <th className="border px-4 py-2">URL</th>
            <th className="border px-4 py-2">Platform</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Backend</td>
            <td className="border px-4 py-2">https://menu-backend.onrender.com</td>
            <td className="border px-4 py-2">Render</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Frontend</td>
            <td className="border px-4 py-2">https://menu.vercel.app</td>
            <td className="border px-4 py-2">Vercel</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Database</td>
            <td className="border px-4 py-2">PostgreSQL (Neon)</td>
            <td className="border px-4 py-2">NeonDB</td>
          </tr>
        </tbody>
      </table>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">👨‍💻 Author</h2>
        <p>
          Developed by <strong>Larisse Alves</strong> — intended for culinary projects and digital menu management.
          <br />
          <a
            className="text-blue-600 underline"
            href="https://linktr.ee/larisseralves"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 Larisse Alves – Linktree
          </a>
          <br />
          <a
            className="text-blue-600 underline"
            href="https://github.com/larissealves/"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 GitHub
          </a>
        </p>
      </section>
    </div>
  );
}
