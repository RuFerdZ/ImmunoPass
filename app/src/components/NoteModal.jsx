import React, { useState } from "react";

export default function NoteModal({ status, onSave, closeModal, resetState }) {
  const [note, setNote] = useState("");

  const handleSave = () => {
    onSave(note);
    closeModal(false);
  };

  const handleClose = () => {
    resetState();
    closeModal(false);
  };

  return (
    <div className="modal-background">
      <div className="modal-container shadow-sm">
        <div className="modal-header">
          <h5 className="modal-title">Add a note</h5>
        </div>
        <div className="modal-body white-color note-modal">
          <textarea
            name="note"
            id="note"
            style={{ height: "100%", width: "100%" }}
            placeholder={
              status === "PENDING"
                ? "Why you removed status of this vaccine?"
                : `Why you ${
                    status === "APPROVED" ? "approved" : "rejected"
                  } this vaccine?`
            }
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <div className="button-secondary" onClick={handleClose}>
            Cancel
          </div>
          <div className="button-secondary" onClick={handleSave}>
            Save
          </div>
        </div>
      </div>
    </div>
  );
}
