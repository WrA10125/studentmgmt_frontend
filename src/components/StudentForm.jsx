import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { addStudent } from "../api";

const StudentForm = ({ refreshStudents, onClose }) => {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    age: "",
    id: "",
  });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStudent(student);
      Swal.fire("Success", "Student added!", "success");
      setStudent({ name: "", email: "", age: "", id: "" });
      refreshStudents();
      onClose();
    } catch (error) {
      Swal.fire("Error", "Failed to add student", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col sm={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Member Name*</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter Member Name"
              value={student.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col sm={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Member Email*</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter Member Email"
              value={student.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col sm={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Member Age*</Form.Label>
            <Form.Control
              type="number"
              name="age"
              placeholder="Enter Age"
              value={student.age}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col sm={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Member Parent ID*</Form.Label>
            <Form.Control
              type="number"
              name="id"
              placeholder="Enter Parent ID"
              value={student.id}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <div className="text-end">
        <Button className="mt-3" variant="success" type="submit">
          Add Member
        </Button>
      </div>
    </Form>
  );
};

export default StudentForm;
