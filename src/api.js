import axios from "axios";

const API_URL = "http://localhost:5000/api";
export const getStudents = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/students?page=${page}&limit=${limit}`
    );
    return response.data; 
  } catch (error) {
    console.error("Error fetching students:", error);
    return { students: [], totalEntries: 0, totalPages: 0 };
  }
};


export const addStudent = async (student) => {
  try {
    return await axios.post(`${API_URL}/students`, student);
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    return await axios.delete(`${API_URL}/students/${id}`);
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    return await axios.put(`${API_URL}/students/${id}`,studentData);
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};
export const getMarksByStudentId = async (studentId) => {
  try {
    const response = await axios.get(`${API_URL}/students/${studentId}/marks`); // Corrected endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching marks:", error);
    return [];
  }
};
export const addMark = async (studentId, subject, score) => {
  try {
    return await axios.post(`${API_URL}/marks`, { studentId, subject, score });
  } catch (error) {
    console.error("Error adding mark:", error);
    throw error;
  }
};

export const deleteMark = async (id) => {
  try {
    return await axios.delete(`${API_URL}/marks/${id}`);
  } catch (error) {
    console.error("Error deleting mark:", error);
    throw error;
  }
};

export const updateMark = async (id, subject, score) => {
  try {
    return await axios.put(`${API_URL}/marks/${id}`, { subject, score });
  } catch (error) {
    console.error("Error updating mark:", error);
    throw error;
  }
};


