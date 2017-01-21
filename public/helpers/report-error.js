const reportError = (error) => {
  if (error) {
    document.getElementById('error-container').innerText = error.toString();
  }
};

module.exports = reportError;
