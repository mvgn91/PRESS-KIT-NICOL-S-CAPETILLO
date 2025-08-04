// ===== NAVEGACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Navegación móvil
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Navegación suave
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.nav-magazine').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Navegación activa al hacer scroll
    const sections = document.querySelectorAll('.magazine-section, .magazine-cover');
    const navLinksArray = Array.from(navLinks);
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksArray.forEach(link => link.classList.remove('active'));
                if (navLinksArray[index]) {
                    navLinksArray[index].classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Cambiar estilo de navegación al hacer scroll
    const nav = document.querySelector('.nav-magazine');
    
    function updateNavStyle() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateNavStyle);
    });
    
    // ===== ANIMACIONES AL HACER SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
// Observar elementos para animación
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.film-item, .download-item, .gallery-item, .timeline-item, .quote-item, .award-item');
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// ===== FUNCIONALIDADES INTERACTIVAS =====
    
// Simulación de descargas
document.addEventListener('DOMContentLoaded', function() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mostrar notificación
            showNotification('Descarga iniciada...', 'success');
            
            // Simular descarga
            setTimeout(() => {
                showNotification('Descarga completada', 'success');
            }, 2000);
        });
    });
});

// Copiar información de contacto
document.addEventListener('DOMContentLoaded', function() {
    const contactLinks = document.querySelectorAll('.contact-info a[href^="mailto:"], .contact-info a[href^="tel:"]');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Información copiada al portapapeles', 'info');
            }).catch(() => {
                showNotification('No se pudo copiar la información', 'error');
            });
        });
    });
});

// Galería de imágenes (lightbox con imágenes reales)
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const image = this.querySelector('.gallery-photo');
            const caption = this.querySelector('.image-caption');
            
            if (image && caption) {
                showLightbox(image.src, image.alt, caption.textContent);
            }
        });
    });
});

// Videos (simulación de reproducción)
document.addEventListener('DOMContentLoaded', function() {
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const title = this.querySelector('.placeholder-text')?.textContent || 'Video';
            showVideoModal(title);
        });
    });
});

// ===== UTILIDADES =====

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
        const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Agregar estilos
        notification.style.cssText = `
            position: fixed;
        top: 20px;
            right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        max-width: 300px;
        `;
        
    // Agregar al DOM
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
    // Cerrar notificación
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Modal de lightbox con navegación
function showLightbox(imageSrc, imageAlt, caption, currentIndex = 0) {
    console.log('Abriendo lightbox:', imageSrc, currentIndex);
    
    const carousel = document.querySelector('.gallery-carousel');
    const slides = carousel ? carousel.querySelectorAll('.carousel-slide') : [];
    const totalSlides = slides.length;
    
    // Crear modal con navegación
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 95vw;
            max-height: 95vh;
            text-align: center;
            position: relative;
            display: flex;
            align-items: center;
            gap: 1rem;
        ">
            <button class="lightbox-nav prev-btn" ${currentIndex === 0 ? 'disabled' : ''} style="
                background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                font-size: 1.5rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
            ">&lt;</button>
            
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                <img src="${imageSrc}" alt="${imageAlt}" class="lightbox-image" style="
                    max-width: 100%;
                    max-height: 70vh;
                    object-fit: contain;
                    border-radius: 8px;
                    transition: transform 0.3s ease;
                ">
                <p style="margin-top: 1rem; font-size: 1.1rem; color: #333;">${caption}</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">${currentIndex + 1} / ${totalSlides}</p>
            </div>
            
            <button class="lightbox-nav next-btn" ${currentIndex === totalSlides - 1 ? 'disabled' : ''} style="
                background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                font-size: 1.5rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
            ">&gt;</button>
            
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(0,0,0,0.1);
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            ">&times;</button>
        </div>
    `;
    
    // Agregar al DOM
    document.body.appendChild(modal);
    
    // Animar entrada
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 100);
    
    // Función para navegar entre imágenes
    function navigateToImage(index) {
        if (index >= 0 && index < totalSlides) {
            const slide = slides[index];
            const img = slide.querySelector('.carousel-photo');
            if (img) {
                const lightboxImage = modal.querySelector('.lightbox-image');
                const caption = modal.querySelector('p');
                const counter = modal.querySelector('p:last-of-type');
                const prevBtn = modal.querySelector('.prev-btn');
                const nextBtn = modal.querySelector('.next-btn');
                
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                caption.textContent = `Imagen ${index + 1} de ${totalSlides}`;
                counter.textContent = `${index + 1} / ${totalSlides}`;
                
                // Actualizar botones
                prevBtn.disabled = index === 0;
                nextBtn.disabled = index === totalSlides - 1;
                
                // Animar transición
                lightboxImage.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    lightboxImage.style.transform = 'scale(1)';
                }, 150);
            }
        }
    }
    
    // Event listeners para navegación
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            navigateToImage(currentIndex);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            navigateToImage(currentIndex);
        }
    });
    
    // Cerrar con click en el fondo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.remove();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            navigateToImage(currentIndex);
        } else if (e.key === 'ArrowRight' && currentIndex < totalSlides - 1) {
            currentIndex++;
            navigateToImage(currentIndex);
        }
    });
}

// Modal de video
function showVideoModal(title) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-overlay"></div>
        <div class="video-content">
            <div class="video-placeholder-large">
                <span>${title}</span>
                <div class="play-button-large">▶</div>
            </div>
            <h3>${title}</h3>
            <button class="video-close">&times;</button>
        </div>
    `;
    
    // Estilos del modal
    modal.style.cssText = `
                position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const overlay = modal.querySelector('.video-overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
    `;
    
    const content = modal.querySelector('.video-content');
    content.style.cssText = `
        position: relative;
        z-index: 1;
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        text-align: center;
    `;
    
    const videoPlaceholder = modal.querySelector('.video-placeholder-large');
    videoPlaceholder.style.cssText = `
        width: 600px;
        height: 400px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border: 2px solid rgba(0,0,0,0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        color: #666;
        position: relative;
        cursor: pointer;
    `;
    
    const playButton = modal.querySelector('.play-button-large');
    playButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        background: rgba(212, 175, 55, 0.9);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2.5rem;
        color: white;
        transition: all 0.3s ease;
    `;
    
    const closeBtn = modal.querySelector('.video-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    `;
    
    // Agregar al DOM
    document.body.appendChild(modal);
    
    // Animar entrada
    setTimeout(() => {
        modal.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 100);
    
    // Cerrar modal
    function closeModal() {
        modal.style.opacity = '0';
        content.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Simular reproducción
    videoPlaceholder.addEventListener('click', function() {
        showNotification('Reproduciendo video...', 'info');
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ===== EFECTOS VISUALES ADICIONALES =====

// Sistema de Parallax Avanzado
class ParallaxManager {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Agregar elementos parallax
        this.addParallaxElements();
        
        // Escuchar scroll
        window.addEventListener('scroll', () => this.updateParallax());
        
        // Escuchar resize
        window.addEventListener('resize', () => this.updateParallax());
    }

        addParallaxElements() {
        // Elementos de fondo con parallax
        const parallaxElements = document.querySelectorAll('.parallax-bg, .cover-background, .cover-overlay');
        
        parallaxElements.forEach((element, index) => {
            this.elements.push({
                element: element,
                speed: 0.3 + (index * 0.1),
                offset: 0
            });
        });

        // Fondos de gradiente
        this.createGradientBackgrounds();
    }

createGradientBackgrounds() {
    const sections = document.querySelectorAll('.magazine-section');
    
    sections.forEach((section, sectionIndex) => {
        // Crear fondos de gradiente animados para cada sección
        const gradientBg = document.createElement('div');
        gradientBg.className = 'gradient-bg';
        
        // Diferentes tipos de gradientes según la sección
        const gradients = [
            'radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.02) 0%, transparent 50%)',
            'linear-gradient(45deg, transparent 30%, rgba(220, 38, 38, 0.02) 50%, transparent 70%)',
            'radial-gradient(circle at 10% 90%, rgba(220, 38, 38, 0.03) 0%, transparent 50%)',
            'linear-gradient(-45deg, transparent 30%, rgba(220, 38, 38, 0.02) 50%, transparent 70%)',
            'radial-gradient(circle at 30% 70%, rgba(220, 38, 38, 0.03) 0%, transparent 50%)',
            'linear-gradient(45deg, transparent 30%, rgba(220, 38, 38, 0.02) 50%, transparent 70%)'
        ];
        
        gradientBg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${gradients[sectionIndex % gradients.length]};
            pointer-events: none;
            z-index: 0;
            opacity: 0;
            transition: opacity 0.8s ease;
        `;
        
        section.appendChild(gradientBg);
        
        // Animar la aparición del gradiente
        setTimeout(() => {
            gradientBg.style.opacity = '1';
        }, sectionIndex * 200);
        
        this.elements.push({
            element: gradientBg,
            speed: 0.05 + (Math.random() * 0.1),
            offset: 0,
            isGradient: true
        });
    });
}

    updateParallax() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        this.elements.forEach(item => {
            const rect = item.element.getBoundingClientRect();
            const elementTop = rect.top + scrolled;
            const elementHeight = rect.height;
            
            // Calcular si el elemento está visible
            const isVisible = rect.top < windowHeight && rect.bottom > 0;
            
            if (isVisible) {
                if (item.isGradient) {
                    // Efecto sutil para gradientes de fondo
                    const gradientOffset = Math.sin((scrolled + item.offset) * 0.0005) * 10;
                    item.element.style.transform = `translateY(${gradientOffset}px)`;
                } else {
                    // Parallax tradicional para elementos de fondo
                    const parallaxOffset = (scrolled - elementTop) * item.speed;
                    item.element.style.transform = `translateY(${parallaxOffset}px)`;
                }
            }
        });
    }
}

// Inicializar sistema de parallax
document.addEventListener('DOMContentLoaded', function() {
    new ParallaxManager();
});

// Parallax suave para la portada (mantener compatibilidad)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const coverBackground = document.querySelector('.cover-background');
    
    if (coverBackground) {
        coverBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Animación de números en las estadísticas
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
        }, 30);
    });
}

// Observar cuando las estadísticas están visibles
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.bio-stats-grid');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// ===== MEJORAS DE ACCESIBILIDAD =====

// Navegación por teclado
document.addEventListener('keydown', function(e) {
    // Navegar entre secciones con flechas
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sections = Array.from(document.querySelectorAll('.magazine-section, .magazine-cover'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let targetIndex;
            
            if (e.key === 'ArrowDown') {
                targetIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else {
                targetIndex = Math.max(currentIndex - 1, 0);
            }
            
            const targetSection = sections[targetIndex];
            const navHeight = document.querySelector('.nav-magazine').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Indicador de progreso de lectura
function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #b91c1c 100%);
        z-index: 1001;
        transition: width 0.3s ease;
        box-shadow: 0 2px 10px rgba(220, 38, 38, 0.4);
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

document.addEventListener('DOMContentLoaded', createReadingProgress); 

// Función para ajustar contenedores según proporciones reales de imágenes
function adjustImageContainers() {
    const images = document.querySelectorAll('.cover-photo, .bio-photo, .gallery-photo');
    
    images.forEach(img => {
        if (img.complete) {
            adjustContainer(img);
        } else {
            img.addEventListener('load', () => adjustContainer(img));
        }
    });
}

function adjustContainer(img) {
    const container = img.parentElement;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = container.offsetWidth / container.offsetHeight;
    
    if (imgRatio > containerRatio) {
        // Imagen más ancha que el contenedor
        const newHeight = container.offsetWidth / imgRatio;
        container.style.height = newHeight + 'px';
    } else {
        // Imagen más alta que el contenedor
        const newWidth = container.offsetHeight * imgRatio;
        container.style.width = newWidth + 'px';
    }
    
    // Asegurar que la imagen llene completamente el contenedor
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'center';
}

// Función para ajustar contenedores de galería
function adjustGalleryContainers() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('.gallery-photo');
        if (img && img.complete) {
            adjustGalleryItem(item, img);
        } else if (img) {
            img.addEventListener('load', () => adjustGalleryItem(item, img));
        }
    });
}

function adjustGalleryItem(item, img) {
    // Mantener las proporciones naturales de la imagen
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
}

// Ejecutar ajustes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Ajustar contenedores de imágenes
    adjustImageContainers();
    adjustGalleryContainers();
    
    // Ajustar en resize
    window.addEventListener('resize', () => {
        setTimeout(() => {
            adjustImageContainers();
            adjustGalleryContainers();
        }, 100);
    });
}); 

// ===== CARRUSEL DE GALERÍA =====
function initCarousel() {
    console.log('Inicializando carrusel...');
    
    const carousel = document.querySelector('.gallery-carousel');
    if (!carousel) {
        console.log('No se encontró el carrusel');
        return;
    }

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const dots = carousel.querySelectorAll('.dot');
    const currentSlideSpan = carousel.querySelector('.current-slide');
    const totalSlidesSpan = carousel.querySelector('.total-slides');

    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Variables para swipe
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTime = 0;

    console.log('Carrusel encontrado con', totalSlides, 'slides');

    // Inicializar contador
    if (totalSlidesSpan) {
        totalSlidesSpan.textContent = totalSlides;
    }

    // Función para actualizar el carrusel
    function updateCarousel() {
        console.log('Actualizando carrusel a slide', currentSlide);
        
        // Mover el track
        const slideWidth = 100;
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

        // Actualizar botones
        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentSlide === totalSlides - 1;
        }

        // Actualizar dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Actualizar contador
        if (currentSlideSpan) {
            currentSlideSpan.textContent = currentSlide + 1;
        }
    }

    // Función para ir a una slide específica
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlide = index;
            updateCarousel();
        }
    }
    
    // Función para manejar swipe
    function handleSwipe() {
        const diffX = currentX - startX;
        const diffTime = Date.now() - startTime;
        const velocity = Math.abs(diffX) / diffTime;
        
        // Determinar si es un swipe válido
        const minSwipeDistance = 50;
        const minSwipeVelocity = 0.3;
        
        if (Math.abs(diffX) > minSwipeDistance || velocity > minSwipeVelocity) {
            if (diffX > 0 && currentSlide > 0) {
                // Swipe derecha - ir a slide anterior
                goToSlide(currentSlide - 1);
            } else if (diffX < 0 && currentSlide < totalSlides - 1) {
                // Swipe izquierda - ir a slide siguiente
                goToSlide(currentSlide + 1);
            }
        }
    }
    
    // Event listeners para touch/swipe
    function handleTouchStart(e) {
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startTime = Date.now();
        isDragging = true;
        track.style.transition = 'none';
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const diffX = currentX - startX;
        const slideWidth = 100;
        const currentTranslate = -currentSlide * slideWidth;
        const newTranslate = currentTranslate + (diffX / window.innerWidth) * 100;
        
        // Limitar el movimiento
        const maxTranslate = 0;
        const minTranslate = -(totalSlides - 1) * slideWidth;
        const limitedTranslate = Math.max(minTranslate, Math.min(maxTranslate, newTranslate));
        
        track.style.transform = `translateX(${limitedTranslate}%)`;
    }
    
    function handleTouchEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        track.style.transition = 'transform 0.3s ease';
        handleSwipe();
    }
    
    // Agregar event listeners para touch
    if (track) {
        track.addEventListener('touchstart', handleTouchStart, { passive: false });
        track.addEventListener('touchmove', handleTouchMove, { passive: false });
        track.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // También agregar para mouse (para testing en desktop)
        track.addEventListener('mousedown', handleTouchStart);
        track.addEventListener('mousemove', handleTouchMove);
        track.addEventListener('mouseup', handleTouchEnd);
        track.addEventListener('mouseleave', handleTouchEnd);
    }

    // Event listeners para botones
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            console.log('Click en botón anterior');
            goToSlide(currentSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('Click en botón siguiente');
            goToSlide(currentSlide + 1);
        });
    }

    // Event listeners para dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            console.log('Click en dot', index);
            goToSlide(index);
        });
    });

    // Click en imágenes para lightbox
    slides.forEach((slide, index) => {
        const img = slide.querySelector('.carousel-photo');
        if (img) {
            img.addEventListener('click', (e) => {
                // Solo abrir lightbox si no hubo swipe
                if (!isDragging) {
                    console.log('Click en imagen', index);
                    showLightbox(img.src, img.alt, `Imagen ${index + 1} de ${totalSlides}`, index);
                }
            });
        }
    });

    // Inicializar carrusel
    updateCarousel();
    console.log('Carrusel inicializado correctamente con funcionalidad swipe');
}

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Ajustar contenedores de imágenes
    adjustImageContainers();
    adjustGalleryContainers();
    
    // Inicializar carrusel
    initCarousel();
    
    // Ajustar en resize
    window.addEventListener('resize', () => {
        setTimeout(() => {
            adjustImageContainers();
            adjustGalleryContainers();
        }, 100);
    });
}); 

// ===== SISTEMA DE TEMA OSCURO =====
function initThemeSystem() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Obtener tema guardado o usar tema claro por defecto
    const savedTheme = localStorage.getItem('theme');
    
    // Aplicar tema inicial
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else {
        html.setAttribute('data-theme', 'light');
    }
    
    // Función para cambiar tema
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log('Cambiando tema de', currentTheme, 'a', newTheme);
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animación suave del cambio
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
        
        // Forzar repaint para asegurar que los cambios se apliquen
        document.body.offsetHeight;
    }
    
    // Event listener para el botón
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('Event listener agregado al botón de tema');
    } else {
        console.error('No se encontró el botón de tema');
    }
    
    // Verificar estado inicial
    console.log('Tema inicial:', html.getAttribute('data-theme'));
}

// Inicializar sistema de tema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Ajustar contenedores de imágenes
    adjustImageContainers();
    adjustGalleryContainers();
    
    // Inicializar carrusel
    initCarousel();
    
    // Inicializar sistema de tema
    initThemeSystem();
    
    // Ajustar en resize
    window.addEventListener('resize', () => {
        setTimeout(() => {
            adjustImageContainers();
            adjustGalleryContainers();
        }, 100);
    });
}); 

// Función de depuración para verificar el tema
function debugTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const savedTheme = localStorage.getItem('theme');
    
    console.log('=== DEBUG TEMA OSCURO ===');
    console.log('Tema actual en HTML:', currentTheme);
    console.log('Tema guardado en localStorage:', savedTheme);
    console.log('Atributo data-theme presente:', html.hasAttribute('data-theme'));
    console.log('Clases CSS aplicadas:', html.className);
    console.log('Estilos computados del body:', window.getComputedStyle(document.body).backgroundColor);
    console.log('========================');
}

// Agregar función de depuración al objeto window para acceso desde consola
window.debugTheme = debugTheme;

// Ejecutar depuración al cargar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(debugTheme, 1000); // Ejecutar después de 1 segundo para asegurar que todo esté cargado
}); 