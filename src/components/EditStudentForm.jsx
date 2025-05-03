import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { updateStudent } from "../api";

const EditStudentForm = ({ student, refreshStudents, onClose }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    age: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        id: student.id,
        name: student.name,
        email: student.email,
        age: student.age,
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(formData.id, {
        name: formData.name,
        email: formData.email,
        age: formData.age,
      });

      Swal.fire("Updated", "Student details updated successfully", "success");
      refreshStudents();
      onClose();
    } catch (error) {
      Swal.fire("Error", "Failed to update student", error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Form.Group className="mb-3">
              <Form.Label>Member Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6}>
            <Form.Group className="mb-3">
              <Form.Label>Member Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6}>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button variant="success" type="submit" className="mt-2">
            Update Student
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditStudentForm;
