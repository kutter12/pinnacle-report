document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer-newsletter-form').forEach(form => {
    const input = form.querySelector('.footer-newsletter-input');
    const button = form.querySelector('.footer-newsletter-submit');
    if (!input || !button) return;

    const renderMessage = (text, isError) => {
      let message = form.querySelector('.newsletter-message');
      if (!message) {
        message = document.createElement('p');
        message.className = 'newsletter-message';
        message.style.marginTop = '12px';
        message.style.fontSize = '13px';
        form.appendChild(message);
      }
      message.textContent = text;
      message.style.color = isError ? '#ff6b6b' : '#d4ffd4';
      message.style.opacity = '0.9';
    };

    const submitEmail = () => {
      const email = input.value.trim();
      if (!email) {
        renderMessage('Please enter a valid email address.', true);
        return;
      }

      button.disabled = true;
      const originalText = button.textContent;
      button.textContent = 'Sending...';

      fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            renderMessage(data.message || 'Thanks for signing up!', false);
            input.value = '';
          } else {
            renderMessage(data.message || 'Unable to submit your email.', true);
          }
        })
        .catch(() => {
          renderMessage('Unable to submit your email. Please try again later.', true);
        })
        .finally(() => {
          button.disabled = false;
          button.textContent = originalText;
        });
    };

    button.addEventListener('click', submitEmail);
    input.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitEmail();
      }
    });
  });
});
