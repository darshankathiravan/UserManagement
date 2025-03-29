import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      let allUsers = [];
      let currentPage = 1;
      let response;
      do {
        response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`);
        allUsers = [...allUsers, ...response.data.data];
        currentPage++;
      } while (currentPage <= response.data.total_pages);
      setUsers(allUsers);
      setTotalPages(Math.ceil(allUsers.length / 6));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const filtered = users.filter(user =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / 6));
    setPage(1);
  }, [searchQuery, users]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://reqres.in/api/users/${editingUser.id}`, {
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
      });
      setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const displayedUsers = filteredUsers.slice((page - 1) * 6, page * 6);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-4">User List</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-fadeIn">
          <span className="font-semibold">✔</span>
          {successMessage}
        </div>
      )}
      {editingUser && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6 max-w-lg mx-auto">
          <h3 className="text-xl font-semibold mb-2">Edit User</h3>
          <form onSubmit={handleUpdate} className="flex flex-col gap-2">
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={editingUser.first_name}
              onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={editingUser.last_name}
              onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
            />
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />
            <div className="flex justify-between">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
              <button onClick={() => setEditingUser(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayedUsers.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={user.avatar} alt={user.first_name} className="w-16 h-16 rounded-full" />
              <div>
                <p className="font-semibold text-center sm:text-left">{user.first_name} {user.last_name}</p>
                <p className="text-gray-600 text-sm text-center sm:text-left">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg ${page === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg ${page === totalPages || totalPages === 0 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;
