document.addEventListener('DOMContentLoaded', function() {

    // --- FUNCIONALIDAD 1: EFECTO DE TIPEADO EN EL TÍTULO DEL CARRUSEL (Uso del DOM) ---
    // Objetivo: Animar el texto del h5 letra por letra.

    const titleElement = document.querySelector('.company-title');
    
    
    if (titleElement) {
        const originalText = titleElement.textContent;
        let charIndex = 0;
        const typingSpeed = 70; 

        
        titleElement.textContent = ''; 

        function typeWriter() {
            if (charIndex < originalText.length) {
                
                titleElement.textContent += originalText.charAt(charIndex);
                charIndex++;
                
                setTimeout(typeWriter, typingSpeed); 
            }
        }

       
        setTimeout(typeWriter, 500); 
    }


    // --- FUNCIONALIDAD 2: GESTIÓN DE EVENTOS DE NAVEGACIÓN (Scroll Suave con DOM) ---
    // Objetivo: Reemplazar el href de los enlaces del menú por scroll suave.

    const navLinks = document.querySelectorAll('.nav-menu ul li a[data-target]');
    const headerHeightOffset = 110; 

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            
            event.preventDefault(); 
            
           
            const targetId = this.getAttribute('data-target'); 
            
            
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                
                window.scrollTo({
                    
                    top: targetElement.offsetTop - headerHeightOffset, 
                    behavior: 'smooth' 
                });
            }
        });
    });


    // 💥 FUNCIONALIDAD 3 (BRILLO DE TARJETAS) ELIMINADA 💥


    // --- FUNCIONALIDAD 4: GESTIÓN DEL ENLACE EXTERNO DEL CARRUSEL (Navegación Externa) ---
    // Objetivo: Manejar la redirección a la landing de Netlify desde JS.
    
    // Usa el ID único que asignamos en el HTML
    const landingButton = document.getElementById('btn-info-landing');
    const targetUrl = "https://infoinfinitytechh.netlify.app/";

    if (landingButton) {
        
        landingButton.addEventListener('click', function(event) {
            
            event.preventDefault(); 
            
            if (this.target === '_blank') {
                window.open(targetUrl, '_blank');
            } else {
                window.location.href = targetUrl;
            }
        });
    }
});