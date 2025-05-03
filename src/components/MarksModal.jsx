import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal, Table, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { addMark, deleteMark, getMarksByStudentId } from "../api";
import EditMarksForm from "./EditMarksForm";

const MarksModal = ({ studentId, show, onHide }) => {
  const [marks, setMarks] = useState([]);
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [editMark, setEditMark] = useState(null);

  const fetchMarks = useCallback(async () => {
    if (!studentId) return;
    try {
      const data = await getMarksByStudentId(studentId);
      setMarks(data || []);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to fetch marks", "error");
    }
  }, [studentId]);

  useEffect(() => {
    if (show && studentId) fetchMarks();
  }, [show, studentId, fetchMarks]);

  useEffect(() => {
    if (!show) {
      setMarks([]);
      setSubject("");
      setScore("");
    }
  }, [show]);

  const handleAddMark = async () => {
    if (!subject || !score) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }
    try {
      await addMark(studentId, subject, score);
      await fetchMarks();
      setSubject("");
      setScore("");
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to add mark", "error");
    }
  };

  const handleDeleteMark = async (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      html: "If you delete this Mark, then this action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMark(id);
          await fetchMarks();
          Swal.fire("Deleted!", "Mark deleted successfully.", "success");
        } catch (error) {
          Swal.fire("Error", error.message || "Failed to delete mark", "error");
        }
      }
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center text-success">
          Student Subjects Marks
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {marks.length > 0 ? (
          <div className="table-responsive mb-4">
            <Table
              striped
              bordered
              hover
              responsive
              className="text-center align-middle"
              style={{ backgroundColor: "#343a40", color: "white" }}
            >
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark) => (
                  <tr key={mark.id}>
                    <td>{mark.subject}</td>
                    <td>{mark.score}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => setEditMark(mark)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteMark(mark.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p className="text-center">No marks available</p>
        )}

        <h5 className="text-center text-success mb-3">Add New Subject Marks</h5>
        <Form>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="formScore">
                <Form.Label>Score</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="Enter score"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="text-center">
            <Button variant="success" onClick={handleAddMark}>
              Add Mark
            </Button>
          </div>
        </Form>

        {/* Edit Marks Modal */}
        {editMark && (
          <EditMarksForm
            show={!!editMark}
            mark={editMark}
            onClose={() => setEditMark(null)}
            onUpdate={fetchMarks}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MarksModal;
