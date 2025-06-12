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
  <div className="">
    {!showInList && (
      <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-700">Tags</h2>
    )}

    <div className="space-y-2">
      {listTags.map((item) => (
        <div
          key={item.id}
          className={`grid grid-cols-1 md:grid-cols-5 items-center border px-4 py-3 rounded-md ${
            showInList ? 'bg-gray-50' : 'hover:bg-gray-100'
          } transition`}
        >
        
          <span className="text-sm font-medium text-gray-800">{item.name}</span>
       
          <span className="text-sm text-gray-500 hidden md:block">
            Created: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </span>
          <span className="text-sm text-gray-500 hidden md:block">
            Last update:  {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
          </span>

          <span
            className={`text-sm font-semibold ${
              item.isActive ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {item.isActive ? 'Active' : 'Disabled'}
          </span>

          {!showInList && (
            <div className="flex gap-2 justify-end mt-2 md:mt-0">
              <button
                onClick={() => editTag(item.id)}
                className="px-3 py-1 cursor-pointer text-sm bg-blue-600 hover:bg-blue-700 text-white cursor-point rounded"
              >
                Edit
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
