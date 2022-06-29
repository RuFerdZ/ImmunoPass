const RegistrationConfirmationModal = ({ closeModal }) => {
    return (
        <div className="modal-background">
            <div className="modal-container shadow-sm">
            
                    <div className="modal-header">
                      <h5 className="modal-title">Records</h5>
                    </div>

                    <div className="modal-footer">
                      <div
                        className="button-secondary"
                        onClick={() => closeModal(false)}
                      >Cancel
                      </div>
                    </div>
        
            </div>
        </div>
    )
}

export default RegistrationConfirmationModal;