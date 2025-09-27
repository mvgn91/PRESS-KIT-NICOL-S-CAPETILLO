document.addEventListener('DOMContentLoaded', () => {
    const app = {
        data: {},
        elements: {
            sidebarPhoto: document.getElementById('sidebarPhoto'),
            sidebarName: document.getElementById('sidebarName'),
            sidebarSubtitle: document.getElementById('sidebarSubtitle'),
            contactBtn: document.getElementById('contactBtn'),
            socialLinks: document.getElementById('socialLinks'),
            navLinks: document.querySelectorAll('.sidebar-nav .nav-link'),
            sections: document.querySelectorAll('.content-section'),
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            sidebar: document.querySelector('.profile-sidebar'),
            themeToggles: document.querySelectorAll('.theme-toggle')
        },

        init() {
            this.loadData();
            this.renderSidebar();
            this.renderSections();
            this.initEventListeners();
            this.initTheme();
            lucide.createIcons();
        },

        loadData() {
            if (window.nicolasData) {
                this.data = window.nicolasData;
            } else {
                console.error("Los datos (nicolasData) no se encontraron en el objeto window.");
            }
        },

        renderSidebar() {
            const { personal, contacto, redes } = this.data;
            if (this.elements.sidebarPhoto) this.elements.sidebarPhoto.src = personal.fotoUrl;
            if (this.elements.sidebarName) this.elements.sidebarName.textContent = personal.nombreArtistico;
            if (this.elements.sidebarSubtitle) this.elements.sidebarSubtitle.textContent = personal.subtitulo;
            if (this.elements.contactBtn) this.elements.contactBtn.href = `mailto:${contacto.email}`;

            if (this.elements.socialLinks) {
                this.elements.socialLinks.innerHTML = redes.map(red => 
                    `<a href="${red.url}" aria-label="${red.nombre}" target="_blank"><i data-lucide="${red.icono}"></i></a>`
                ).join('');
            }
        },

        renderSections() {
            const { secciones } = this.data;
            for (const key in secciones) {
                const sectionEl = document.getElementById(key);
                if (sectionEl) {
                    const sectionData = secciones[key];
                    let content = `<h2 class="section-title">${sectionData.titulo}</h2>`;

                    if (key === 'formacion' || key === 'experiencia') {
                        content += '<div class="timeline">';
                        content += sectionData.items.map(item => `
                            <div class="timeline-item">
                                <p class="timeline-period">${item.periodo}</p>
                                <h3 class="timeline-title">${item.titulo}</h3>
                                <p class="timeline-subtitle">${item.detalle}</p>
                            </div>
                        `).join('');
                        content += '</div>';
                    } else if (key === 'material') {
                        content += '<div class="material-links">';
                        content += sectionData.links.map(link => `
                            <a href="${link.url}" class="material-link" target="_blank">
                                <i data-lucide="${link.icono}"></i>
                                <span>${link.label}</span>
                            </a>
                        `).join('');
                        content += '</div>';
                    } else {
                        content += '<div class="data-grid">';
                        content += sectionData.items.map(item => `
                            <div class="data-item">
                                <h3 class="data-label">${item.label}</h3>
                                <p class="data-value">${item.value}</p>
                            </div>
                        `).join('');
                        content += '</div>';
                    }
                    sectionEl.innerHTML = content;
                }
            }
        },

        initEventListeners() {
            // Scroll Spy
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.elements.navLinks.forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                        });
                    }
                });
            }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

            this.elements.sections.forEach(section => observer.observe(section));

            // Smooth scroll
            this.elements.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
                    // En móvil, cerrar el menú después de hacer clic
                    if (window.innerWidth <= 1024) {
                        this.elements.sidebar.classList.remove('open');
                    }
                });
            });

            // Menú móvil
            if (this.elements.mobileMenuBtn) {
                this.elements.mobileMenuBtn.addEventListener('click', () => {
                    this.elements.sidebar.classList.toggle('open');
                });
            }
        },

        initTheme() {
            const html = document.documentElement;
            const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            html.setAttribute('data-theme', savedTheme);

            const toggleTheme = () => {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            };

            this.elements.themeToggles.forEach(toggle => {
                toggle.addEventListener('click', toggleTheme);
            });
        }
    };

    app.init();
});
