import React from 'react';

export default function ProjectDocumentation() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-gray-800 space-y-8">
      <h1 className="text-3xl font-bold">Project Documentation - "Menu"</h1>

      <section>
        <h2 className="text-2xl font-semibold">📌 Overview</h2>
        <p>
          The <strong>Menu</strong> project is a full-stack application for restaurant menu management. It allows users to create, list, edit, and delete dishes, ingredients, and tags. It includes an admin panel and a public section with filters for name, category, ingredients, and tags.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">🛠️ Technologies Used</h2>
        <ul className="list-disc list-inside">
          <li><strong>Frontend:</strong> React, Tailwind CSS, Framer Motion</li>
          <li><strong>Backend:</strong> Node.js, Express</li>
          <li><strong>Database:</strong> SQLite with Prisma ORM</li>
          <li><strong>File Upload:</strong> Multer</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">📦 Installation and Running</h2>

        <h3 className="text-xl font-semibold mt-4">Requirements:</h3>
        <ul className="list-disc list-inside">
          <li>Node.js 18 or higher</li>
          <li>NPM or Yarn</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4">Steps:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Clone the repository</li>
          <li>Install dependencies:
            <pre><code>npm install</code></pre>
          </li>
          <li>Configure environment variables in the <code>.env</code> file</li>
          <li>Run database migrations:
            <pre><code>npx prisma migrate dev --name init</code></pre>
            <pre><code>npx prisma studio</code></pre>
          </li>
          <li>Start the backend server:
            <pre><code>npm run server</code></pre>
            <pre><code>node server/index.js</code></pre>
          </li>
          <li>Start the frontend:
            <pre><code>npm run dev</code></pre>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">✨ Features</h2>
        <ul className="list-disc list-inside">
          <li>✅ Create dishes with name, price, description, category, images, ingredients, and tags</li>
          <li>✅ General listing with filters by name, category, tags, and ingredients</li>
          <li>✅ Edit dishes with image, tag, and ingredient updates</li>
          <li>✅ Upload and delete images (stored as binary using Prisma)</li>
          <li>✅ Full CRUD for Ingredients and Tags</li>
          <li>✅ Active/Inactive status control for dishes</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">🧩 Directory Structure</h2>
        <ul className="list-disc list-inside">
          <li><code>/client</code>: React frontend</li>
          <li><code>/server</code>: Express API backend</li>
          <li><code>/uploads</code>: stored images</li>
          <li><code>/prisma</code>: database schema and migrations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">📁 Key Components</h2>
        <ul className="list-disc list-inside">
          <li><code>HeroSection.jsx</code>: main page with filters</li>
          <li><code>ListAllDishes.jsx</code>: displays and edits dishes</li>
          <li><code>AddDishes.jsx</code>: modal to create/edit dishes</li>
          <li><code>ListIngredientsByDisheId.jsx</code>: displays ingredients of a dish</li>
          <li><code>ListTagsByDisheId.jsx</code>: displays tags of a dish</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">🚀 Future Improvements</h2>
        <ul className="list-disc list-inside">
          <li>🔒 Authentication for admin panel access</li>
          <li>🖼️ Define a primary image for dishes</li>
          <li>📱 Improved responsive design</li>
          <li>🌐 Production deployment (e.g., Vercel/Render)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">👨‍💻 Author</h2>
        <p>
          Developed by <strong>Larisse Alves</strong> — intended for culinary projects and digital menu management.
          <br></br>
          <a
            className="highlighted-link"
            href="https://linktr.ee/larisseralves"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 Larisse Alves – Linktree
          </a>
          <br></br>
          <a
            className="highlighted-link"
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
