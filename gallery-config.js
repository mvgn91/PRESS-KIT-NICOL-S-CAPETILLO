// ===== CONFIGURACIÓN DE LA NUEVA GALERÍA ELEGANTE =====
const GALLERY_CONFIG = {
    // Solo fotos numeradas del 1 al 8 y las que comienzan con _P5A
    allImages: [
        { src: 'assets/fotos/1.jpg', alt: 'Nicolás Capetillo - Retrato Profesional' },
        { src: 'assets/fotos/2.jpg', alt: 'Nicolás Capetillo - Headshot' },
        { src: 'assets/fotos/3.jpg', alt: 'Nicolás Capetillo - Foto Editorial' },
        { src: 'assets/fotos/4.jpg', alt: 'Nicolás Capetillo - Retrato Artístico' },
        { src: 'assets/fotos/5.jpg', alt: 'Nicolás Capetillo - Foto de Casting' },
        { src: 'assets/fotos/6.jpg', alt: 'Nicolás Capetillo - Retrato Dramático' },
        { src: 'assets/fotos/7.jpg', alt: 'Nicolás Capetillo - Foto Profesional' },
        { src: 'assets/fotos/8.jpg', alt: 'Nicolás Capetillo - Headshot Editorial' },
        { src: 'assets/fotos/_P5A7048.jpg', alt: 'Nicolás Capetillo - Escena 1' },
        { src: 'assets/fotos/_P5A7051.jpg', alt: 'Nicolás Capetillo - Escena 2' },
        { src: 'assets/fotos/_P5A7061.jpg', alt: 'Nicolás Capetillo - Escena 3' },
        { src: 'assets/fotos/_P5A7068.jpg', alt: 'Nicolás Capetillo - Escena 4' },
        { src: 'assets/fotos/_P5A7071.jpg', alt: 'Nicolás Capetillo - Escena 5' },
        { src: 'assets/fotos/_P5A7079.jpg', alt: 'Nicolás Capetillo - Escena 6' },
        { src: 'assets/fotos/_P5A7080.jpg', alt: 'Nicolás Capetillo - Escena 7' },
        { src: 'assets/fotos/_P5A7081.jpg', alt: 'Nicolás Capetillo - Escena 8' },
        { src: 'assets/fotos/_P5A7082.jpg', alt: 'Nicolás Capetillo - Escena 9' },
        { src: 'assets/fotos/_P5A7085.jpg', alt: 'Nicolás Capetillo - Escena 10' },
        { src: 'assets/fotos/_P5A7097.jpg', alt: 'Nicolás Capetillo - Escena 11' },
        { src: 'assets/fotos/_P5A7104.jpg', alt: 'Nicolás Capetillo - Escena 12' },
        { src: 'assets/fotos/_P5A7105.jpg', alt: 'Nicolás Capetillo - Escena 13' },
        { src: 'assets/fotos/_P5A7107.jpg', alt: 'Nicolás Capetillo - Escena 14' },
        { src: 'assets/fotos/_P5A7111.jpg', alt: 'Nicolás Capetillo - Escena 15' },
        { src: 'assets/fotos/_P5A7112.jpg', alt: 'Nicolás Capetillo - Escena 16' },
        { src: 'assets/fotos/_P5A7121.jpg', alt: 'Nicolás Capetillo - Escena 17' },
        { src: 'assets/fotos/_P5A7122.jpg', alt: 'Nicolás Capetillo - Escena 18' },
        { src: 'assets/fotos/_P5A7131.jpg', alt: 'Nicolás Capetillo - Escena 19' },
        { src: 'assets/fotos/_P5A7138.jpg', alt: 'Nicolás Capetillo - Escena 20' },
        { src: 'assets/fotos/_P5A7145.jpg', alt: 'Nicolás Capetillo - Escena 21' },
        { src: 'assets/fotos/_P5A7146.jpg', alt: 'Nicolás Capetillo - Escena 22' },
        { src: 'assets/fotos/_P5A7147.jpg', alt: 'Nicolás Capetillo - Escena 23' },
        { src: 'assets/fotos/_P5A7148.jpg', alt: 'Nicolás Capetillo - Escena 24' },
        { src: 'assets/fotos/_P5A7152.jpg', alt: 'Nicolás Capetillo - Escena 25' }
    ],
    
    // Función para obtener 10 imágenes aleatorias
    getRandomImages: function() {
        const shuffled = [...this.allImages].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 10);
    },
    
    // Configuración del lightbox
    lightbox: {
        enableZoom: true,
        maxZoom: 3,
        zoomStep: 0.5
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GALLERY_CONFIG;
}
