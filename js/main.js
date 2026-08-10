document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup WhatsApp Links
    const waLink = `https://wa.me/${SITE_CONFIG.whatsapp}?text=Hi KKS Electrical, I would like to request a quote.`;
    document.getElementById('wa-hero').href = waLink;

    // 2. Populate Services
    const serviceGrid = document.getElementById('services-detailed');
    SERVICES_DETAILED.forEach(service => {
        const card = document.createElement('div');
        card.className = 's-card reveal';
        card.innerHTML = `
            <i class="fa-solid ${service.icon}"></i>
            <h3>${service.title}</h3>
            <p>${service.desc}</p>
            <ul style="list-style: none; margin-top: 20px; font-weight: 600; color: var(--primary); font-size: 0.9rem;">
                ${service.features.map(f => `<li><i class="fa-solid fa-check" style="color: var(--secondary); margin-right: 10px;"></i> ${f}</li>`).join('')}
            </ul>
        `;
        serviceGrid.appendChild(card);
    });

    // 3. Scroll Reveal Animation Logic
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', reveal);
    reveal(); // Run once on load
});