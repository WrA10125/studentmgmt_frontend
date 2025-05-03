import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { updateMark } from "../api";

const EditMarksForm = ({ show, mark, onClose, onUpdate }) => {
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    if (mark) {
      setSubject(mark.subject);
      setScore(mark.score);
    }
  }, [mark]);

  const handleUpdateMark = async () => {
    if (!subject || !score) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }
    try {
      await updateMark(mark.id, subject, score);
      Swal.fire("Updated", "Mark updated successfully", "success");
      onUpdate();
      onClose();
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to update mark", "error");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100 text-success">
          Edit Mark
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={12} sm={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Score</Form.Label>
                  <Form.Control
                    type="number"
                    value={score}
                    min="0"
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center">
              <Button variant="success" onClick={handleUpdateMark}>
                Update Mark
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default EditMarksForm;
