import React, { useState } from 'react';

export default function BtnDeleteDish({ dishID, onDelete }) {
  const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';


  const [loading, setLoading] = useState(false);

  const handleDeleteSubmit = async () => {
    setLoading(true);
    const confirmDelete = window.confirm("Are you sure you want to delete this dish?");
    if (!confirmDelete) return;

    const endpoint = `${API_BASE_URL}/api/delete/dish/${dishID}`;
    

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });

      await onDelete();
      
    } catch (error) {
      console.error('Erro ao deletar prato:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDeleteSubmit}
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 cursor-pointer rounded hover:bg-red-600 transition"
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
