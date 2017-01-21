export const reportError = (error) => {
  if (error) {
    document.getElementById('error-container').innerText = error.toString();
  }
}
