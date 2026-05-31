document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/content/contact')
    .then(response => {
      if (!response.ok) {
        throw new Error('Content API unavailable');
      }
      return response.json();
    })
    .then(data => {
      const subtitle = document.querySelector('[data-content="subtitle"]');
      const introHeading = document.querySelector('[data-content="introHeading"]');
      const introText = document.querySelector('[data-content="introText"]');
      const cards = document.querySelector('[data-content="cards"]');

      if (subtitle) subtitle.textContent = data.subtitle;
      if (introHeading) introHeading.textContent = data.introHeading;
      if (introText) introText.textContent = data.introText;
      if (cards && Array.isArray(data.cards)) {
        cards.innerHTML = data.cards
          .map(card => `
            <article class="info-card">
              <h3>${card.title}</h3>
              <p>${card.details}</p>
              <p><strong>${card.contact}</strong></p>
            </article>
          `)
          .join('');
      }
    })
    .catch(error => {
      console.warn(error);
    });
});
