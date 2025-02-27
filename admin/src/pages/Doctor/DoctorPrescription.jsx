// components/DoctorPrescription.js
import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImSpinner8 } from 'react-icons/im';

const DoctorPrescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dToken } = useContext(DoctorContext);
  const appointment = location.state?.appointment;

  const [report, setReport] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Show file preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (report.split(' ').length < 30) {
      toast.error('The report should have at least 30 words.');
      return;
    }

    if (!file) {
      toast.error('Please upload a prescription file.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('appointmentId', appointment._id);
    formData.append('report', report);
    formData.append('prescriptionFile', file);

    try {
      const response = await axios.post('http://localhost:4000/api/prescription/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          dToken,
        },
      });
      console.log('Response from server:', response.data);
      toast.success('Prescription added successfully!');
      setTimeout(() => navigate(-1), 2000); // Navigate back after 2 seconds
    } catch (error) {
      console.error('Error uploading prescription:', error);
      toast.error('Error uploading prescription.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto p-5 bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:shadow-xl'>
      <ToastContainer />
      <h2 className='text-3xl font-bold mb-6 text-blue-600'>Prescription</h2>
      <div className='mb-6'>
        <p className='text-lg font-semibold text-gray-700'>
          <span className='text-blue-500'>Patient Name:</span> {appointment.userData.name}
        </p>
        <p className='text-lg font-semibold text-gray-700'>
          <span className='text-blue-500'>Age:</span> {appointment.userData.dob}
        </p>
        <p className='text-lg font-semibold text-gray-700'>
          <span className='text-blue-500'>Date & Time:</span> {appointment.slotDate}, {appointment.slotTime}
        </p>
      </div>

      <textarea
        className='w-full h-40 border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300'
        placeholder='Write the patient’s report here (minimum 30 words)...'
        value={report}
        onChange={(e) => setReport(e.target.value)}
      ></textarea>

      <div className='mt-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          Upload Prescription (PDF or Image)
        </label>
        <input
          type='file'
          onChange={handleFileChange}
          className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-300'
          accept='.pdf,.jpg,.jpeg,.png'
        />
        {filePreview && (
          <div className='mt-4'>
            <p className='text-sm font-semibold text-gray-600'>File Preview:</p>
            {file.type.startsWith('image/') ? (
              <img
                src={filePreview}
                alt='File Preview'
                className='mt-2 w-48 h-48 object-cover rounded-lg shadow-md'
              />
            ) : (
              <div className='mt-2 p-4 bg-gray-100 rounded-lg'>
                <p className='text-sm text-gray-700'>PDF file uploaded: {file.name}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className='mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center'
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ImSpinner8 className='animate-spin mr-2' />
        ) : (
          'Add Prescription'
        )}
      </button>
    </div>
  );
};

export default DoctorPrescription;