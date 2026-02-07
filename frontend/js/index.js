const user = document.getElementById('user');
const dropdown = document.getElementById('userDropdown');

let isInside = false;

user.addEventListener('mouseenter', () => {
  dropdown.classList.add('user__dropdown--active');
});

user.addEventListener('mouseleave', () => {
  dropdown.classList.remove('user__dropdown--active');
});
