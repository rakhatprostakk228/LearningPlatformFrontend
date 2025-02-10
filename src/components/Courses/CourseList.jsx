import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;
const API_URL = 'https://learningplatformbackend-grqq.onrender.com/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses`);
        console.log('API Response:', response.data);
        
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          setError('Invalid data format received from server');
          console.error('Invalid data format:', response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to enroll');
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}/payment-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status !== 'completed') {
        navigate(`/courses/${courseId}`); // Перенаправляем на страницу с формой оплаты
      } else {
        // Если уже оплачено, перенаправляем на курс
        navigate(`/courses/${courseId}/learn`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to check payment status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative">
              <img 
                src={course.image || '/api/placeholder/400/300'} 
                alt={course.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration}
                </span>
                <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                  {course.level}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <span className="text-2xl font-bold text-gray-800">${course.price}</span>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-gray-700 
                             bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-900 
                             transition-colors duration-150 ease-in-out focus:outline-none 
                             focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                  >
                    View Course
                  </button>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white 
                             bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg 
                             hover:from-blue-600 hover:to-blue-700 transition-all duration-150 
                             ease-in-out shadow-lg hover:shadow-xl focus:outline-none 
                             focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                             transform hover:-translate-y-0.5"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;