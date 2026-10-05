import { useState, useEffect } from "react";
import axios from "axios";

// Uses the deployed backend on Vercel/production, localhost during development
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE}/api/students`;

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", course: "" });
  const [editingId, setEditingId] = useState(null);

  // GET all students
  useEffect(() => {
    axios
      .get(API_URL)
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", email: "", course: "" });
    setEditingId(null);
  };

  // POST (add) or PUT (update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId === null) {
      axios
        .post(API_URL, form)
        .then(response => {
          setStudents(prev => [...prev, response.data]);
          resetForm();
        })
        .catch(error => console.error("Error:", error));
    } else {
      axios
        .put(`${API_URL}/${editingId}`, form)
        .then(response => {
          setStudents(prev =>
            prev.map(s => (s._id === response.data._id ? response.data : s))
          );
          resetForm();
        })
        .catch(error => console.error("Error:", error));
    }
  };

  // DELETE
  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setStudents(prev => prev.filter(s => s._id !== id));
        if (editingId === id) resetForm();
      })
      .catch(error => console.error("Error:", error));
  };

  // Load student into the form for editing
  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      name: student.name,
      email: student.email,
      course: student.course
    });
  };

  return (
    <div>
      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId === null ? "Add Student" : "Update Student"}
        </button>
        {editingId !== null && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <br />

      <table border="1">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button onClick={() => handleDelete(student._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
