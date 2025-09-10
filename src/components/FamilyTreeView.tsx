import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Plus, Edit3, UserPlus } from 'lucide-react';

export default function FamilyTreeView() {
  const { user, updateUser } = useAuth();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    age: '',
    gender: ''
  });

  const handleAddMember = () => {
    if (newMember.name && newMember.relation && newMember.age && newMember.gender) {
      const updatedFamilyTree = [
        ...(user?.familyTree || []),
        {
          id: Date.now(),
          ...newMember,
          age: parseInt(newMember.age)
        }
      ];
      
      updateUser({ familyTree: updatedFamilyTree });
      setNewMember({ name: '', relation: '', age: '', gender: '' });
      setIsAddingMember(false);
    }
  };

  const relations = [
    'self', 'spouse', 'son', 'daughter', 'father', 'mother', 
    'brother', 'sister', 'grandfather', 'grandmother', 'grandson', 'granddaughter'
  ];

  const getRelationColor = (relation: string) => {
    switch (relation) {
      case 'self':
        return 'bg-blue-100 text-blue-800';
      case 'spouse':
        return 'bg-pink-100 text-pink-800';
      case 'son':
      case 'daughter':
        return 'bg-green-100 text-green-800';
      case 'father':
      case 'mother':
        return 'bg-purple-100 text-purple-800';
      case 'brother':
      case 'sister':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Family Tree
        </h2>
        <button
          onClick={() => setIsAddingMember(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </button>
      </div>

      {user?.familyTree && user.familyTree.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.familyTree.map((member: any) => (
            <div key={member.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-purple-700">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize ${getRelationColor(member.relation)}`}>
                      {member.relation}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Age:</span>
                  <span className="font-medium">{member.age} years old</span>
                </div>
                <div className="flex justify-between">
                  <span>Gender:</span>
                  <span className="font-medium capitalize">{member.gender}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Family Members Added</h3>
          <p className="text-gray-600 mb-4">Start building your family tree by adding family members.</p>
          <button
            onClick={() => setIsAddingMember(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Add First Member
          </button>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add Family Member
              </h3>
              <button
                onClick={() => setIsAddingMember(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select
                  value={newMember.relation}
                  onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select relationship</option>
                  {relations.map((relation) => (
                    <option key={relation} value={relation} className="capitalize">
                      {relation}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={newMember.age}
                    onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Age"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={newMember.gender}
                    onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsAddingMember(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}