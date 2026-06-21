document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.accordion-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.accordion-list details').forEach((other) => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});
