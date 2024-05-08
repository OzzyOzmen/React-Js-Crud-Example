import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './UserForm';

function FetchingData() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Fetch users and roles data on mount
    useEffect(() => {
        // Fetch users data
        axios.get('http://localhost:8000/user/')
            .then(response => setUsers(response.data))
            .catch(err => console.error('Failed to fetch users:', err));

        // Fetch roles data
        axios.get('http://localhost:8000/roles/')
            .then(response => setRoles(response.data))
            .catch(err => console.error('Failed to fetch roles:', err));
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const isNewUser = selectedUser === null;
        const url = isNewUser ? 'http://localhost:8000/user/' : `http://localhost:8000/user/${selectedUser.id}/`;
        const method = isNewUser ? 'post' : 'put';

        // Prepare data for the request
        const data = {
            ...formData,
            id: isNewUser ? Math.max(0, ...users.map(user => user.id)) + 1 : selectedUser.id
        };

        // Send request to the server
        axios({
            method,
            url,
            data,
        })
            .then(response => {
                const updatedUser = response.data;

                if (isNewUser) {
                    console.log('New user added:', updatedUser);
                    setUsers(prevUsers => [...prevUsers, updatedUser]);
                } else {
                    console.log('User updated:', updatedUser);
                    setUsers(prevUsers => prevUsers.map(user => user.id === selectedUser.id ? updatedUser : user));
                }

                // Reset form data and form visibility
                setSelectedUser(null);
                setFormData({});
                setIsFormVisible(false);
            })
            .catch(err => console.error(`Failed to ${method === 'post' ? 'add' : 'update'} user:`, err));
    };

    // Handle user deletion
    const deleteUser = (userId) => {
        axios.delete(`http://localhost:8000/user/${userId}/`)
            .then(() => {
                console.log(`User with ID ${userId} deleted.`);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            })
            .catch(err => console.error(`Failed to delete user with ID ${userId}:`, err));
    };

    // Handle editing a user
    const handleEditButtonClick = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            username: user.username,
            password: user.password,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            zipcode: user.zipcode,
            company: user.company,
            website: user.website,
            role: user.role,
            created_at: user.created_at? user.created_at : null,
            updated_at:  new Date().toISOString(),
        });
        setIsFormVisible(true);
    };

    // Handle adding a new user
    const handleAddUserButtonClick = () => {
        // Reset selectedUser since we're adding a new user
        setSelectedUser(null);
        
        // Initialize form data for a new user with blank/default values
        setFormData({
            name: '',
            username: '',
            password: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            zipcode: '',
            company: '',
            website: '',
            role: '',
            created_at: new Date().toISOString(),
            updated_at: '',
        });

        // Make the form visible
        setIsFormVisible(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center' }}>React-JS CRUD Data Process</h1>
            
            {/* User list */}
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.id} - {user.username} - {user.name} - {user.password} - {user.email} - {user.phone} - {user.address}, {user.city}, {user.zipcode} - {user.company} - {user.website} - {user.role}
                        - Created At: {user.created_at} - Updated At: {user.updated_at}
                        <button onClick={() => handleEditButtonClick(user)}>Edit</button>
                        <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            
            {/* "Add New User" button */}
            <button onClick={handleAddUserButtonClick} style={{ marginBottom: '20px' }}>
                Add New User
            </button>

            {/* User form */}
            {isFormVisible && (
                <UserForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    selectedUser={selectedUser}
                    roles={roles}
                />
            )}
        </div>
    );
}

export default FetchingData;
