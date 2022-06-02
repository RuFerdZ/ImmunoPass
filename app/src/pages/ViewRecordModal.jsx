const ViewRecordModal = ({ closeVaccine }) => {
    return (
        <div className="modal-background">
            <div className="modal-container shadow-sm">
            
                    <div className="modal-header">
                      <h5 className="modal-title">Records</h5>
                    </div>
                    <div className="modal-body white-color">
                        <div className="light-black-card p-4 mt-2">
                            Record 01
                        </div>
                        <div className="light-black-card p-4 mt-2">
                            Record 02
                        </div>
                        <div className="light-black-card p-4 mt-2">
                            Record 03
                        </div>
                    </div>
                    <div className="modal-footer">
                      <div 
                        className="button-secondary" 
                        onClick={() => closeVaccine(false)}
                      >Cancel
                      </div>
                    </div>
        
            </div>
        </div>
    )
}

export default ViewRecordModal;