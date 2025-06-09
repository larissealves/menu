import React, { useState } from 'react';

export default function BtnDeleteDish({ dishID, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDeleteSubmit = async () => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este prato?");
    if (!confirmDelete) return;

    const endpoint = `http://localhost:5000/api/delete/dish/${dishID}`;
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
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        {loading ? 'Deletando...' : 'Deletar'}
      </button>
    </div>
  );
}
