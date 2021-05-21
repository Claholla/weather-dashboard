// Search bar function and variables
let searchButton = document.getElementById('search-button');
let searchInput = document.getElementById('search-input');
searchButton.addEventListener('click', () => {
  let inputValue = searchInput.value;
  alert(inputValue);
});

// Open Weather API call
