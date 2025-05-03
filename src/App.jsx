import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import StudentList from "./components/StudentList";
import { getStudents } from "./api";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    const data = await getStudents();
    setStudents(data.students);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <Container className="mt-3 h-100 w-100">
      <h2 className="text-center text-success opacity-100">Student Management System</h2>
      <StudentList students={students} refreshStudents={fetchStudents} />
      <></>
    </Container>
  );
}

export default App;
