import React, { useEffect, useState } from 'react';
import AddTag from './NewTag';
import BtnDeleteTag from './BtnDeleteTag';

export default function ListTags({ showInList }) {
  const [listTags, setTags] = useState([]);
  const [tagsEditID, setTagsEditID] = useState(null);
  const [controlPopup, setControlPopup] = useState(false);

  const toggleControlPopup = () => setControlPopup(!controlPopup);

  const editTag = (id) => {
    setTagsEditID(id);
    setControlPopup(true);
  };

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/get/tagList');
        const data = await res.json();
        setTags(data);
      } catch (error) {
        console.log('Erro ao buscar a lista de tags', error);
      }
    };
    fetchTag();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      {!showInList && (
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Tags</h2>
      )}

      <div className="space-y-2">
        {listTags.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between border p-2 rounded ${
              showInList ? 'bg-gray-50' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-sm">{item.name}</span>

            {!showInList && (
              <div className="flex gap-2">
                <button
                  onClick={() => editTag(item.id)}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <BtnDeleteTag tagID={item.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      {controlPopup && (
        <AddTag
          propsTagID={tagsEditID}
          handletoggleControlPopup={toggleControlPopup}
          controlPopup={controlPopup}
        />
      )}
    </div>
  );
}
