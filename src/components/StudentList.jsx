import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Container,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { deleteStudent, getStudents } from "../api";
import StudentForm from "./StudentForm";
import EditStudentForm from "./EditStudentForm";
import MarksModal from "./MarksModal";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(5);
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const handleCloseAdd = () => setShowAddModal(false);
  const handleShowAdd = () => setShowAddModal(true);

  const handleCloseEdit = () => setShowEditModal(false);
  const handleShowEdit = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleShowMarksModal = (studentId) => {
    setSelectedStudentId(studentId);
    setShowMarksModal(true);
  };

  const handleCloseMarksModal = () => {
    setShowMarksModal(false);
    setSelectedStudentId(null);
  };

  const fetchStudents = useCallback(async () => {
    try {
      const data = await getStudents(page, limit);
      setStudents(data.students);
      setFilteredStudents(data.students);
      setTotalPages(data.totalPages);
      setTotalEntries(data.totalEntries);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, page]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleDelete = async (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "If you delete this student, this action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteStudent(id);
          Swal.fire("Deleted!", "Student record has been deleted.", "success");
          fetchStudents();
        } catch (error) {
          Swal.fire("Error", "Failed to delete student", error);
        }
      }
    });
  };

  const handlePagination = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-between align-items-center mb-3">
        <Col xs={12} md={6}>
          <h4>Student List</h4>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
          <Button variant="success" onClick={handleShowAdd}>
            + Add New Member
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs={12} md={6}>
          <Form.Control
            type="text"
            placeholder="Search by Name or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Member Name</th>
              <th>Member Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleShowEdit(student)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowMarksModal(student.id)}
                      >
                        View Marks
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Row className="mt-3 align-items-center">
        <Col xs={12} md={6} className="mb-2 mb-md-0">
          <span className="text-muted">Total Entries: {totalEntries}</span>
        </Col>
        <Col xs={12} md={6} className="text-md-end">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => handlePagination(page - 1)}
          >
            Previous
          </Button>
          <span className="mx-3">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => handlePagination(page + 1)}
          >
            Next
          </Button>
        </Col>
      </Row>

      {/* Modals */}
      <Modal show={showAddModal} onHide={handleCloseAdd} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-success text-center w-100">
            Add New Member
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StudentForm
            refreshStudents={fetchStudents}
            onClose={handleCloseAdd}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-success text-center w-100">
            Edit Member
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <EditStudentForm
              student={selectedStudent}
              refreshStudents={fetchStudents}
              onClose={handleCloseEdit}
            />
          )}
        </Modal.Body>
      </Modal>

      <MarksModal
        show={showMarksModal}
        studentId={selectedStudentId}
        onHide={handleCloseMarksModal}
      />
    </Container>
  );
};

export default StudentList;
