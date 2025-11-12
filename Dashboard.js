// Small interactions: swap From/To, format date to DD/MM/YYYY display, simple validation
document.addEventListener('DOMContentLoaded', () => {
  const from = document.getElementById('from');
  const to = document.getElementById('to');
  const swapBtn = document.getElementById('swapBtn');
  const dateInput = document.getElementById('date');
  const prettyDate = document.getElementById('prettyDate');
  const searchBtn = document.getElementById('searchBtn');

  // Swap fields
  swapBtn.addEventListener('click', () => {
    const a = from.value;
    from.value = to.value;
    to.value = a;
    from.focus();
  });

  // Show pretty date in DD/MM/YYYY under the form
  function updatePrettyDate(){
    if(!dateInput.value){
      prettyDate.textContent = '';
      return;
    }
    const d = new Date(dateInput.value);
    if (isNaN(d)) { prettyDate.textContent = ''; return; }
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yyyy = d.getFullYear();
    prettyDate.textContent = 'Selected date: ' + dd + '/' + mm + '/' + yyyy;
  }

  dateInput.addEventListener('change', updatePrettyDate);
  updatePrettyDate();

  // Simple search click handler
  searchBtn.addEventListener('click', () => {
    const f = from.value.trim();
    const t = to.value.trim();
    const dt = dateInput.value;

    if(!f || !t){
      alert('Please enter both From and To stations.');
      return;
    }
    if(!dt){
      alert('Please choose a travel date.');
      return;
    }

    // Simulate a search result action:
    const d = new Date(dt);
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yyyy = d.getFullYear();
    alert(`Searching trains from ${f} to ${t} on ${dd}/${mm}/${yyyy} ...`);
  });
});
