// ===== GESTOR DE GALERÍA ELEGANTE =====
class ElegantGalleryManager {
    constructor() {
        this.config = GALLERY_CONFIG;
        this.currentImages = [];
        this.lightbox = null;
        this.currentFeaturedIndex = 0;
        this.init();
    }
    
    init() {
        // Obtener 10 imágenes aleatorias
        this.currentImages = this.config.getRandomImages();
        
        // Crear la galería
        this.createGallery();
        
        // Inicializar lightbox
        this.initLightbox();
        
        // Configurar eventos
        this.setupEventHandlers();
        
        // Configurar indicadores de puntos para móvil
        this.setupMobileDots();
    }
    
    createGallery() {
        const galleryContainer = document.getElementById('galleryContainer');
        const featuredWrapper = document.getElementById('galleryFeaturedWrapper');
        
        if (!galleryContainer) return;
        
        // Limpiar contenedores existentes
        galleryContainer.innerHTML = '';
        if (featuredWrapper) {
            featuredWrapper.innerHTML = '';
        }
        
        // Crear imagen destacada para desktop
        if (featuredWrapper && window.innerWidth > 1024) {
            const featuredItem = this.createFeaturedItem(this.currentImages[0], 0);
            featuredWrapper.appendChild(featuredItem);
        }
        
        // Crear grid de miniaturas
        this.currentImages.forEach((image, index) => {
            const galleryItem = this.createGalleryItem(image, index);
            galleryContainer.appendChild(galleryItem);
        });
        
        // Marcar la primera imagen como activa en desktop
        if (window.innerWidth > 1024) {
            this.setActiveImage(0);
        }
    }
    
    createFeaturedItem(image, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item featured-item';
        item.setAttribute('data-index', index);
        
        item.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="gallery-item-overlay">
                <div class="gallery-item-info">
                    <span class="gallery-item-title">${image.alt}</span>
                    <button class="gallery-item-zoom" aria-label="Ver imagen completa">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15,3L21.42,9.42L15,15L9.42,9.42L15,3M3,15L9.42,21.42L15,15L9.42,9.42L3,15M3,3L9.42,9.42L3,15L9.42,9.42L3,3Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        return item;
    }
    
    createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-index', index);
        
        item.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="gallery-item-overlay">
                <div class="gallery-item-info">
                    <span class="gallery-item-title">${image.alt}</span>
                    <button class="gallery-item-zoom" aria-label="Ver imagen completa">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15,3L21.42,9.42L15,15L9.42,9.42L15,3M3,15L9.42,21.42L15,15L9.42,9.42L3,15M3,3L9.42,9.42L3,15L9.42,9.42L3,3Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        return item;
    }
    
    setActiveImage(index) {
        // Remover clase activa de todas las imágenes
        const allItems = document.querySelectorAll('.gallery-item');
        allItems.forEach(item => item.classList.remove('active'));
        
        // Agregar clase activa a la imagen seleccionada
        const selectedItem = document.querySelector(`[data-index="${index}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
        
        // Actualizar imagen destacada en desktop
        if (window.innerWidth > 1024) {
            this.updateFeaturedImage(index);
        }
        
        this.currentFeaturedIndex = index;
    }
    
    updateFeaturedImage(index) {
        const featuredWrapper = document.getElementById('galleryFeaturedWrapper');
        if (!featuredWrapper) return;
        
        const image = this.currentImages[index];
        if (!image) return;
        
        featuredWrapper.innerHTML = '';
        const featuredItem = this.createFeaturedItem(image, index);
        featuredWrapper.appendChild(featuredItem);
    }
    
    setupMobileDots() {
        const dotsContainer = document.getElementById('galleryDots');
        if (!dotsContainer) return;
        
        // Solo mostrar puntos en móvil
        if (window.innerWidth <= 1024) {
            dotsContainer.innerHTML = '';
            
            this.currentImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    this.scrollToImage(index);
                    this.updateActiveDot(index);
                });
                
                dotsContainer.appendChild(dot);
            });
        } else {
            dotsContainer.style.display = 'none';
        }
    }
    
    scrollToImage(index) {
        const galleryContainer = document.getElementById('galleryContainer');
        if (!galleryContainer) return;
        
        const items = galleryContainer.querySelectorAll('.gallery-item');
        if (items[index]) {
            items[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
    
    updateActiveDot(index) {
        const dots = document.querySelectorAll('.gallery-dots .dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    initLightbox() {
        this.lightbox = new ElegantLightbox(this.config.lightbox);
    }
    
    setupEventHandlers() {
        const galleryContainer = document.getElementById('galleryContainer');
        const featuredWrapper = document.getElementById('galleryFeaturedWrapper');
        
        if (!galleryContainer) return;
        
        // Event listeners para las imágenes de la galería
        galleryContainer.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const index = parseInt(galleryItem.getAttribute('data-index'));
                this.openLightbox(index);
            }
        });
        
        // Event listeners para la imagen destacada
        if (featuredWrapper) {
            featuredWrapper.addEventListener('click', (e) => {
                const galleryItem = e.target.closest('.gallery-item');
                if (galleryItem) {
                    const index = parseInt(galleryItem.getAttribute('data-index'));
                    this.openLightbox(index);
                }
            });
        }
        
        // Event listeners para botones de zoom
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-item-zoom')) {
                e.stopPropagation();
                const galleryItem = e.target.closest('.gallery-item');
                const index = parseInt(galleryItem.getAttribute('data-index'));
                this.openLightbox(index);
            }
        });
        
        // Event listeners para navegación en desktop
        if (window.innerWidth > 1024) {
            galleryContainer.addEventListener('click', (e) => {
                const galleryItem = e.target.closest('.gallery-item');
                if (galleryItem) {
                    const index = parseInt(galleryItem.getAttribute('data-index'));
                    this.setActiveImage(index);
                }
            });
        }
        
        // Event listener para el botón de recargar imágenes
        const reloadBtn = document.getElementById('galleryReloadBtn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                this.reloadWithNewImages();
                this.showReloadNotification();
            });
        }
        
        // Event listener para resize de ventana
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleResize() {
        // Reconfigurar la galería cuando cambie el tamaño de la ventana
        if (window.innerWidth > 1024) {
            // Modo desktop - mostrar imagen destacada
            this.setupDesktopLayout();
        } else {
            // Modo móvil - ocultar imagen destacada, mostrar puntos
            this.setupMobileLayout();
        }
    }
    
    setupDesktopLayout() {
        const featuredWrapper = document.getElementById('galleryFeaturedWrapper');
        const dotsContainer = document.getElementById('galleryDots');
        
        if (featuredWrapper) {
            featuredWrapper.style.display = 'block';
            if (featuredWrapper.children.length === 0) {
                this.updateFeaturedImage(this.currentFeaturedIndex);
            }
        }
        
        if (dotsContainer) {
            dotsContainer.style.display = 'none';
        }
        
        this.setActiveImage(this.currentFeaturedIndex);
    }
    
    setupMobileLayout() {
        const featuredWrapper = document.getElementById('galleryFeaturedWrapper');
        const dotsContainer = document.getElementById('galleryDots');
        
        if (featuredWrapper) {
            featuredWrapper.style.display = 'none';
        }
        
        if (dotsContainer) {
            dotsContainer.style.display = 'flex';
            this.setupMobileDots();
        }
    }
    
    showReloadNotification() {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = 'gallery-reload-notification';
        notification.textContent = '¡Nuevas imágenes cargadas!';
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    openLightbox(index) {
        if (this.lightbox) {
            this.lightbox.open(this.currentImages, index);
        }
    }
    
    // Método para recargar con nuevas imágenes aleatorias
    reloadWithNewImages() {
        this.currentImages = this.config.getRandomImages();
        this.currentFeaturedIndex = 0;
        this.createGallery();
        this.setupMobileDots();
        
        if (window.innerWidth > 1024) {
            this.setupDesktopLayout();
        } else {
            this.setupMobileLayout();
        }
    }
    
    // Método público para obtener información de la galería
    getGalleryInfo() {
        return {
            totalImages: this.currentImages.length,
            currentImages: this.currentImages,
            currentFeaturedIndex: this.currentFeaturedIndex,
            isLightboxOpen: this.lightbox ? this.lightbox.isOpen : false,
            isDesktop: window.innerWidth > 1024
        };
    }
}

// ===== LIGHTBOX ELEGANTE =====
class ElegantLightbox {
    constructor(config) {
        this.config = config;
        this.isOpen = false;
        this.currentIndex = 0;
        this.images = [];
        this.currentZoom = 1;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
        
        this.createLightbox();
    }
    
    createLightbox() {
        // Crear elemento del lightbox
        this.element = document.createElement('div');
        this.element.className = 'elegant-lightbox';
        this.element.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <div class="lightbox-header">
                    <button class="lightbox-close" aria-label="Cerrar lightbox">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                    </button>
                </div>
                <button class="lightbox-nav lightbox-prev" aria-label="Imagen anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
                    </svg>
                </button>
                <button class="lightbox-nav lightbox-next" aria-label="Imagen siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                    </svg>
                </button>
                <div class="lightbox-content">
                    <img class="lightbox-image" alt="">
                    <div class="lightbox-info">
                        <span class="lightbox-counter"></span>
                    </div>
                </div>
                <div class="lightbox-controls">
                    <button class="lightbox-view-full" aria-label="Ver imagen completa">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7,14H5V19H10V17H7V14M5,10H7V7H10V5H5V10M17,17H14V19H19V14H17V17M17,5H14V7H17V10H19V5H17Z"/>
                        </svg>
                        Vista Completa
                    </button>
                    <button class="lightbox-download" aria-label="Descargar imagen">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                        Descargar
                    </button>
                </div>
            </div>
        `;
        
        // Agregar al DOM
        document.body.appendChild(this.element);
        
        // Configurar eventos
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        // Cerrar lightbox
        this.element.querySelector('.lightbox-overlay').addEventListener('click', () => {
            this.close();
        });
        
        this.element.querySelector('.lightbox-close').addEventListener('click', () => {
            this.close();
        });
        
        // Navegación
        this.element.querySelector('.lightbox-prev').addEventListener('click', () => {
            this.previousImage();
        });
        
        this.element.querySelector('.lightbox-next').addEventListener('click', () => {
            this.nextImage();
        });
        
        // Control de vista completa
        this.element.querySelector('.lightbox-view-full').addEventListener('click', () => {
            this.openFullImage();
        });
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
                case 'v':
                case 'V':
                    e.preventDefault();
                    this.openFullImage();
                    break;
            }
        });
        
        // Touch events para navegación
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        const image = this.element.querySelector('.lightbox-image');
        if (!image) return;
        
        // Navegación con swipe
        let startX = 0;
        let startY = 0;
        
        image.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        image.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Si el swipe horizontal es más pronunciado que el vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextImage();
                } else {
                    this.previousImage();
                }
            }
        });
    }
    
    open(images, startIndex = 0) {
        this.images = images;
        this.currentIndex = startIndex;
        this.isOpen = true;
        
        this.element.classList.add('active');
        this.updateImage();
        this.updateCounter();
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.isOpen = false;
        this.element.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    updateImage() {
        const image = this.element.querySelector('.lightbox-image');
        
        if (image && this.images[this.currentIndex]) {
            // Agregar clase de carga
            image.classList.add('loading');
            
            // Cargar nueva imagen
            const newImage = new window.Image();
            newImage.onload = () => {
                image.src = newImage.src;
                image.alt = this.images[this.currentIndex].alt;
                image.classList.remove('loading');
                image.classList.add('loaded');
            };
            newImage.src = this.images[this.currentIndex].src;
            
            // Configurar descarga
            const downloadBtn = this.element.querySelector('.lightbox-download');
            if (downloadBtn) {
                downloadBtn.onclick = () => this.downloadImage(this.images[this.currentIndex]);
            }
        }
    }
    
    updateCounter() {
        const counter = this.element.querySelector('.lightbox-counter');
        if (counter) {
            counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        }
    }
    
    previousImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.images.length - 1;
        }
        this.updateImage();
        this.updateCounter();
    }
    
    nextImage() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateImage();
        this.updateCounter();
    }
    
    openFullImage() {
        if (this.images[this.currentIndex]) {
            const imageUrl = this.images[this.currentIndex].src;
            const imageName = this.images[this.currentIndex].alt;
            
            // Crear una nueva ventana con la imagen al 75% de escala
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${imageName} - Vista Completa</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            background: #000; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            min-height: 100vh;
                            font-family: Arial, sans-serif;
                        }
                        .image-container {
                            text-align: center;
                            max-width: 100%;
                            max-height: 100vh;
                        }
                        .full-image {
                            max-width: 75%;
                            max-height: 75vh;
                            object-fit: contain;
                            border-radius: 8px;
                            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                            cursor: zoom-in;
                            transition: transform 0.3s ease;
                        }
                        .full-image:hover {
                            transform: scale(1.02);
                        }
                        .image-info {
                            color: white;
                            margin-top: 20px;
                            font-size: 16px;
                            opacity: 0.8;
                        }
                        .zoom-instructions {
                            color: #ccc;
                            margin-top: 10px;
                            font-size: 14px;
                            opacity: 0.6;
                        }
                    </style>
                </head>
                <body>
                    <div class="image-container">
                        <img src="${imageUrl}" alt="${imageName}" class="full-image" onclick="toggleZoom(this)">
                        <div class="image-info">${imageName}</div>
                        <div class="zoom-instructions">Click en la imagen para ampliar al 100%</div>
                    </div>
                    <script>
                        function toggleZoom(img) {
                            if (img.style.maxWidth === '100%') {
                                img.style.maxWidth = '75%';
                                img.style.maxHeight = '75vh';
                                img.style.cursor = 'zoom-in';
                            } else {
                                img.style.maxWidth = '100%';
                                img.style.maxHeight = '100vh';
                                img.style.cursor = 'zoom-out';
                            }
                        }
                    </script>
                </body>
                </html>
            `);
            newWindow.document.close();
        }
    }
    
    downloadImage(image) {
        // Crear un enlace temporal para descarga directa
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `nicolas-capetillo-${image.alt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia de la galería elegante
    window.elegantGallery = new ElegantGalleryManager();
});
