import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  // Apply filter based on the selected speciality
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  // Update the filtered list when `doctors` or `speciality` changes
  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Sidebar */}
      <aside className="w-full sm:w-1/4 p-6 bg-gray-100 border-b sm:border-b-0 sm:border-r">
        <p className="font-semibold mb-4">Browse through doctor specialties</p>
        <button
          className={`py-2 px-4 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filter
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? 'flex' : 'hidden sm:flex'
          }`}
        >
          <button
            onClick={() => setFilterDoc(doctors.filter((doc) => doc.speciality === 'General physician'))}
            className="p-2 bg-white border rounded hover:bg-gray-50"
          >
            General Physician
          </button>
          <button
            onClick={() => setFilterDoc(doctors.filter((doc) => doc.speciality === 'Gynecologist'))}
            className="p-2 bg-white border rounded hover:bg-gray-50"
          >
            Gynecologist
          </button>
          <button
            onClick={() => setFilterDoc(doctors.filter((doc) => doc.speciality === 'Dermatologist'))}
            className="p-2 bg-white border rounded hover:bg-gray-50"
          >
            Dermatologist
          </button>
          <button
            onClick={() => setFilterDoc(doctors.filter((doc) => doc.speciality === 'Pediatricians'))}
            className="p-2 bg-white border rounded hover:bg-gray-50"
          >
            Pediatricians
          </button>
          <button
            onClick={() => setFilterDoc(doctors.filter((doc) => doc.speciality === 'Neurologist'))}
            className="p-2 bg-white border rounded hover:bg-gray-50"
          >
            Neurologist
          </button>
          <button
            onClick={() => setFilterDoc(doctors.filter((doc) => doc.speciality === 'Gastroenterologist'))}
            className="p-2 bg-white border rounded hover:bg-gray-50"
          >
            Gastroenterologist
          </button>
          <button
            onClick={() => setFilterDoc(doctors)}
            className="p-2 bg-blue-100 border rounded hover:bg-blue-200"
          >
            Clear Filter
          </button>
        </div>
      </aside>

      {/* Doctor cards grid */}
      <section className="w-full sm:w-3/4 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition duration-300"
                key={index}
              >
                <img
                  className="w-full h-50 object-cover"
                  src={item.image}
                  alt={item.name}
                />
                <div className="p-4">
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-red-500'} `}>
                            <p className={`w-2 h-2 ${item.available ? 'bg-green-500 rounded-full':'bg-red-500 rounded-full'}  `}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
                        </div>
                  <p className="text-gray-900 text-lg font-semibold">{item.name}</p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No doctors available for the selected specialty.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Doctors;
