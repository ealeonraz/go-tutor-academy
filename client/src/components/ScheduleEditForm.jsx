import React, { useState } from 'react';

const ScheduleEditForm = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <h2>Edit Schedule</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <label>Start Time</label>
        <input
          type="datetime-local"
          value={formData.start}
          onChange={(e) => setFormData({ ...formData, start: e.target.value })}
        />
        <label>End Time</label>
        <input
          type="datetime-local"
          value={formData.end}
          onChange={(e) => setFormData({ ...formData, end: e.target.value })}
        />
        <button type="submit">Save Schedule</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default ScheduleEditForm;
