import React, { useState, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types';
import Card from './Card';

const StaffList: React.FC = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const { getStaffMembers } = useUsers();

  useEffect(() => {
    setStaff(getStaffMembers());
  }, [getStaffMembers]);

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4 text-text-primary">Event Staff</h3>
      <div className="space-y-3">
        {staff.length > 0 ? (
          staff.map((member) => (
            <div key={member.username} className="flex items-center space-x-3 bg-secondary p-3 rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-6 h-6 text-highlight"
              >
                <path 
                  fillRule="evenodd" 
                  d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.994 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" 
                  clipRule="evenodd" 
                />
              </svg>
              <p className="font-semibold text-text-primary">{member.username}</p>
            </div>
          ))
        ) : (
          <p className="text-text-secondary text-center py-2">No staff members found.</p>
        )}
      </div>
    </Card>
  );
};

export default StaffList;
