import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const UpdateNameModal = ({ isOpen, onClose }) => {
  const { authUser, updateName, isUpdatingName } = useAuthStore();
  const [newName, setNewName] = useState(authUser?.fullName || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      return;
    }

    if (newName.trim() === authUser?.fullName) {
      onClose();
      return;
    }

    const success = await updateName(newName.trim());
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    setNewName(authUser?.fullName || '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Update Your Name</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter your full name"
              disabled={isUpdatingName}
              maxLength={50}
              required
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                {newName.length}/50 characters
              </span>
            </label>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost"
              disabled={isUpdatingName}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdatingName || !newName.trim() || newName.trim() === authUser?.fullName}
            >
              {isUpdatingName ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                'Update Name'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateNameModal;
