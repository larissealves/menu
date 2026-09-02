/* ==== IMPORTS ==== */
import React, { useEffect, useState } from 'react';
import AddTag from './NewTag';
import BtnDeleteTag from './BtnDeleteTag';

export default function ListTags({ adminKey, showInList, tagControlPopup, onClose }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || import.meta.env.API_URL_PROD;

  
  const TOKEN_FOR_API = import.meta.env.API_SECRET;
  const headers = {
    Authorization: `Bearer ${TOKEN_FOR_API}`
  };

  /* ==== STATES ==== */
  const [filters, setFilters] = useState({ option: 'null' });
  const [listTags, setTags] = useState([]);
  const [tagsEditID, setTagsEditID] = useState(null);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  /* ==== HANDLERS ==== */
  const editTag = (id) => {
    setTagsEditID(id);
    onClose();
  };

  const toggleControlPopup = () => {
    setTagsEditID(null);
    onClose();
  };

  /* ==== FETCH DATA ==== */
  const fetchTag = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/tags?onlyActives=${filters.option}&limitItemsPerPage=${itemsPerPage}&currentPage=${currentPage}`, { headers });
      const data = await res.json();
      setTags(data.data);
      setCurrentPage(data.paginationDetails.currentPage);
      setTotalPages(data.paginationDetails.totalPages);
    } catch (error) {
      console.log('Error fetching tag list:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ==== FILTER ==== */
  /* const filteredList = listTags.filter((item) => {
    const matchIsActive =
      filters.option !== ''
        ? item.isActive === (filters.option === 'true')
        : true;
    return matchIsActive;
  }); */

  /* ==== EFFECT ==== */
  useEffect(() => {
    if (!tagControlPopup) {
      fetchTag();
    }
  }, [tagControlPopup, currentPage, filters]);

  useEffect(() => {
  }, [tagControlPopup])

  /* ==== RENDER ==== */
  return (
    <div>
      {/* ==== TITLE ==== */}
      {!showInList && (
        <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-700">
          Tags
        </h2>
      )}

      {/* ==== FILTER ==== */}
      <div className="mb-4">
        <select
          value={filters.option}
          disabled={loading}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, option: e.target.value }));
            setCurrentPage(1)
          }}
          className="capitalize px-3 py-2 border border-gray-300 rounded-md text-sm  w-full md:w-[30%] "
        >
          <option value="null">All items</option>
          <option value="true">Active items</option>
          <option value="false">Disabled items</option>
        </select>
      </div>

      {/* ==== LIST ==== */}
      <div className="space-y-2">
        {listTags.map((item) => (
          <div
            key={item.id}
            className={`grid grid-cols-1 md:grid-cols-5 items-center border px-4 py-3 rounded-md capitalize gap-2 ${showInList ? 'bg-gray-50' : 'hover:bg-gray-100'
              } transition`}
          >
            <span className="text-sm font-medium break-all text-gray-800">
              {item.name}
            </span>

            <span className="text-sm text-gray-500">
              Created: {new Date(item.createdAt).toLocaleDateString('en-US')}
            </span>
            <span className="text-sm text-gray-500">
              Last update:{' '}
              {new Date(item.updatedAt).toLocaleDateString('en-US')}
            </span>

            <span
              className={`text-sm font-medium px-2.5 py-0.5 rounded-full w-fit ${item.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
                }`}
            >
              {item.isActive ? 'Active' : 'Disabled'}
            </span>

            {/* ==== ACTIONS ==== */}
            {!showInList && (
              <div className="flex gap-2 justify-end mt-2 md:mt-0">
                <button
                  onClick={() => editTag(item.id)}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                >
                  Edit
                </button>
                <BtnDeleteTag  adminKey={adminKey} tagID={item.id} onDelete={fetchTag} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ==== PAGINATION ==== */}
      <div className="flex gap-2 mt-4 justify-center items-center md:justify-end  ">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* ==== POPUP ==== */}
      {tagControlPopup && (
        <AddTag
          adminKey={adminKey}
          propsTagID={tagsEditID}
          handletoggleControlPopup={toggleControlPopup}
          controlPopup={tagControlPopup}
        />
      )}
    </div>
  );
}
