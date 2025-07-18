import React, { useState } from 'react';

export default function BtnDeleteDish({ dishID, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDeleteSubmit = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this dish?");
    if (!confirmDelete) return;

    const endpoint = `${API_BASE_URL}/api/delete/dish/${dishID}`;
    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (res.ok) {
        console.log('Prato deletado com sucesso');
        if (onDelete) onDelete();
      } else {
        console.error('Erro ao deletar prato');
      }
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
