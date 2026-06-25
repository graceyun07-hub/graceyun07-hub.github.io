document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.accordion-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.accordion-list details').forEach((other) => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});

document.querySelectorAll('.email-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    const webmailUrl = link.dataset.webmail;
    if (!webmailUrl) return;

    event.preventDefault();
    let openedExternalApp = false;

    const markOpened = () => {
      openedExternalApp = true;
    };

    window.addEventListener('blur', markOpened, { once: true });
    document.addEventListener('visibilitychange', markOpened, { once: true });

    window.location.href = link.href;

    window.setTimeout(() => {
      if (!openedExternalApp && document.visibilityState === 'visible') {
        window.location.href = webmailUrl;
      }
    }, 900);
  });
});
