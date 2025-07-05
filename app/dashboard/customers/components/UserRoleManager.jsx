"use client";

import React, { useState } from "react";
import { Shield, User, Crown, Save, X } from "lucide-react";
import { updateResource } from "@/app/utils/api";
import toast from "react-hot-toast";

const UserRoleManager = ({ user, onRoleUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: "user", label: "User", icon: User, color: "text-gray-600" },
    { value: "admin", label: "Admin", icon: Shield, color: "text-blue-600" },
    { value: "super_admin", label: "Super Admin", icon: Crown, color: "text-purple-600" },
  ];

  const currentRole = roles.find(role => role.value === user.role);
  const Icon = currentRole?.icon || User;

  const handleSave = async () => {
    if (selectedRole === user.role) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating user role...");

    try {
      await updateResource("user", `${user._id}/role`, { role: selectedRole });
      
      toast.success("User role updated successfully!", { id: toastId });
      onRoleUpdate(user._id, selectedRole);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update user role", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedRole(user.role);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={loading}
        >
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleSave}
          disabled={loading}
          className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
        >
          <Save size={16} />
        </button>
        
        <button
          onClick={handleCancel}
          disabled={loading}
          className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-1 ${currentRole?.color}`}>
        <Icon size={16} />
        <span className="text-sm font-medium">{currentRole?.label}</span>
      </div>
      
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-gray-400 hover:text-gray-600"
        title="Edit role"
      >
        <Shield size={14} />
      </button>
    </div>
  );
};

export default UserRoleManager; 