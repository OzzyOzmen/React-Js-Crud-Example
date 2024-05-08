import React from 'react';

const UserForm = ({ formData, handleInputChange, handleSubmit, selectedUser, roles }) => {
    const formFields = [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'username', label: 'Username', type: 'text' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'zipcode', label: 'Zipcode', type: 'text' },
        { name: 'company', label: 'Company', type: 'text' },
        { name: 'website', label: 'Website', type: 'url' }

    ];

    return (
        <form onSubmit={handleSubmit}>
            {formFields.map(({ name, label, type }) => (
                <div key={name}>
                    <label>{label}:</label>
                    <input
                        type={type}
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleInputChange}
                    />
                </div>
            ))}
            {/* Dropdown list for role selection */}
            <div>
                <label>Role:</label>
                <select
                    name="role"
                    value={formData.role || ''}
                    onChange={handleInputChange}
                >
                    <option value="">--Select a role--</option>
                    {roles.map(({ id, role }) => (
                        <option key={id} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">{selectedUser ? 'Update User' : 'Add User'}</button>
        </form>
    );
};

export default UserForm;
