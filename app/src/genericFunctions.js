
  const getDateFormatted = (timestamp) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', options);
  }

  const getStatus = (status) => {
    if (status === 'VALID') {
      return <span style={{color: 'green', border: '1px solid'}}>{status}</span>
    } else if (status === 'INVALID') {
      return <span style={{color: 'red', border: '1px solid'}}>{status}</span>
    } else {
      return <span style={{color: 'orange', border: '1px solid'}}>{status}</span>
    }
}