import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api'; // Using fetchWithAuth
import { isAuthenticated, decodeAccessToken } from '../utils/auth';

// Define the Student interface directly in this file
interface Student {
  _id: string;
  fullName: string; // Matches schema: fullName
  whatsapp: string; // Matches schema: whatsapp
  dob: string; // Stored as Date in backend, but handled as string (YYYY-MM-DD) in form
  role: 'user' | 'admin'; // Matches schema: role (though not editable on this form)
  Address: string; // Matches schema: Address
  Course: string; // Matches schema: Course
  Fname: string; // Matches schema: Fname
  Mname: string; // Matches schema: Mname
  religion: 'Hinduism' | 'Islam' | 'Christianity' | 'Sikhism' | 'Buddhism' | 'Jainism' | 'Other' | 'Prefer not to say' | ''; // Matches schema enum
  session: string; // Matches schema: session
  createdAt?: string;
  updatedAt?: string;
}

// Define a type for a successful delete response (e.g., a message)
interface DeleteSuccessResponse {
  message: string;
}

// Removed: const BACKEND_URL = 'http://localhost:5000'; // No longer needed here

const ManageStudents: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  // State for edit form fields
  const [editForm, setEditForm] = useState<Omit<Student, '_id' | 'role' | 'createdAt' | 'updatedAt'>>({
    fullName: '',
    whatsapp: '',
    dob: '',
    Address: '',
    Course: '',
    Fname: '',
    Mname: '',
    religion: '',
    session: '',
  });

  // Refs for modals to handle clicks outside
  const editModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  // Authorization check
  useEffect(() => {
    const user = decodeAccessToken();
    if (!isAuthenticated() || user?.role !== 'admin') {
      navigate('/login'); // Redirect to login if not authenticated or not admin
    }
  }, [navigate]);

  // Fetch students function
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use fetchWithAuth with relative path
      const data = await fetchWithAuth<Student[]>(`/api/students`); 
      if (data) {
        setStudents(data);
      } else {
        // fetchWithAuth returns null on error, and handles messages/redirects internally.
        // This means an error occurred and was already handled (e.g., by redirecting to login).
        setError('Failed to fetch students. Please check your network or server status, or log in again.');
      }
    } catch (err: unknown) {
      console.error('Error fetching students:', err);
      if (err instanceof Error) {
        setError(`An unexpected error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred while fetching students.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle edit button click
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setEditForm({
      fullName: student.fullName,
      whatsapp: student.whatsapp,
      dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
      Address: student.Address,
      Course: student.Course,
      Fname: student.Fname,
      Mname: student.Mname,
      religion: student.religion,
      session: student.session,
    });
  };

  // Handle input changes in edit form
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle update submission
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...editForm,
        dob: editForm.dob ? new Date(editForm.dob).toISOString() : '',
      };

      // Use fetchWithAuth with relative path
      const updatedStudent = await fetchWithAuth<Student>(`/api/students/${editingStudent._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      if (updatedStudent) {
        setStudents(prev => prev.map(s => (s._id === updatedStudent._id ? updatedStudent : s)));
        setEditingStudent(null);
        alert('Student updated successfully!'); // Replace with custom modal later
      } else {
        setError('Failed to update student. Please check server response or log in again.');
      }
    } catch (err: unknown) {
      console.error('Error updating student:', err);
      if (err instanceof Error) {
        setError(`An unexpected error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred while updating student.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete button click (opens confirmation modal)
  const handleDeleteClick = (studentId: string) => {
    setStudentToDelete(studentId);
    setIsDeleteModalOpen(true);
  };

  // Confirm and execute delete
  const confirmDelete = async () => {
    if (!studentToDelete) return;

    setLoading(true);
    setError(null);
    try {
      // Use fetchWithAuth with relative path
      const response = await fetchWithAuth<DeleteSuccessResponse>(`/api/students/${studentToDelete}`, {
        method: 'DELETE',
      });

      if (response && response.message) { 
        setStudents(prev => prev.filter(s => s._id !== studentToDelete));
        alert('Student deleted successfully!'); // Replace with custom modal later
      } else {
        setError('Failed to delete student. Server might not have responded as expected or indicated success, or log in again.');
      }
    } catch (err: unknown) {
      console.error('Error deleting student:', err);
      if (err instanceof Error) {
        setError(`An unexpected error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred while deleting student.');
      }
    } finally {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      setLoading(false);
    }
  };

  // Close modals on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (editModalRef.current && !editModalRef.current.contains(event.target as Node)) {
        setEditingStudent(null);
      }
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        setIsDeleteModalOpen(false);
      }
    };

    if (editingStudent || isDeleteModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [editingStudent, isDeleteModalOpen]);


  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading students...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button onClick={fetchStudents} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Manage Students</h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No students found. Add some students first!</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>{/* Ensure no whitespace immediately after <tr> */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Father's Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mother's Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Religion</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id}>{/* Ensure no whitespace immediately after <tr> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.whatsapp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.Address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.Course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.Fname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.Mname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.religion || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.session}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(student)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(student._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Student Modal/Form */}
      {editingStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div ref={editModalRef} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Student: {editingStudent.fullName}</h2>
            <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={editForm.fullName}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp No</label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  value={editForm.whatsapp}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date" // Use type="date" for date input
                  name="dob"
                  id="dob"
                  value={editForm.dob}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              {/* Religion */}
              <div>
                <label htmlFor="religion" className="block text-sm font-medium text-gray-700">Religion</label>
                <select
                  name="religion"
                  id="religion"
                  value={editForm.religion}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select Religion</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Islam">Islam</option>
                  <option value="Christianity">Christianity</option>
                  <option value="Sikhism">Sikhism</option>
                  <option value="Buddhism">Buddhism</option>
                  <option value="Jainism">Jainism</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="Address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="Address"
                  id="Address"
                  rows={3}
                  value={editForm.Address}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                ></textarea>
              </div>
              {/* Course */}
              <div>
                <label htmlFor="Course" className="block text-sm font-medium text-gray-700">Course</label>
                <input
                  type="text"
                  name="Course"
                  id="Course"
                  value={editForm.Course}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              {/* Father's Name */}
              <div>
                <label htmlFor="Fname" className="block text-sm font-medium text-gray-700">Father's Name</label>
                <input
                  type="text"
                  name="Fname"
                  id="Fname"
                  value={editForm.Fname}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              {/* Mother's Name */}
              <div>
                <label htmlFor="Mname" className="block text-sm font-medium text-gray-700">Mother's Name</label>
                <input
                  type="text"
                  name="Mname"
                  id="Mname"
                  value={editForm.Mname}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              {/* Session */}
              <div>
                <label htmlFor="session" className="block text-sm font-medium text-gray-700">Session</label>
                <input
                  type="text"
                  name="session"
                  id="session"
                  value={editForm.session}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="md:col-span-2 flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)} // Cancel edit
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div ref={deleteModalRef} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-red-600 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this student? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;