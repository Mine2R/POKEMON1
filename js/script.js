document.addEventListener('DOMContentLoaded', function() {
    // Typewriter effect
    const typewriter = document.querySelector('.typewriter');
    const text = 'Pokémon';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            typewriter.innerHTML = text.substring(0, i+1);
            i++;
            setTimeout(typeWriter, 150);
        } else {
            setInterval(() => {
                typewriter.style.borderRightColor = typewriter.style.borderRightColor === 'transparent' ? 'var(--pokemon-red)' : 'transparent';
            }, 500);
        }
    }
    
    setTimeout(typeWriter, 1000);

    // GSAP Animations
    gsap.to(".hero-content p", {
        opacity: 1,
        duration: 1,
        delay: 1.5,
        ease: "power2.out"
    });

    gsap.to(".btn", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 2,
        ease: "back.out(1.7)"
    });

    gsap.to(".pikachu", {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 1,
        ease: "bounce.out"
    });

    // Floating Pokémon animations
    const floatingPokemon = document.querySelectorAll('.floating-pokemon');
    floatingPokemon.forEach((pokemon, index) => {
        gsap.to(pokemon, {
            y: (index % 2 === 0) ? -20 : 20,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to(pokemon, {
            rotation: (index % 2 === 0) ? -5 : 5,
            duration: 4 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    // Pokéball hover effect
    const pokeball = document.querySelector('.pokeball');
    pokeball.addEventListener('mouseenter', () => {
        gsap.to(".pokeball-top", {
            rotation: 15,
            transformOrigin: "bottom center",
            duration: 0.5,
            ease: "back.out(1.7)"
        });
        
        gsap.to(".pokeball-center", {
            scale: 1.1,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    });
    
    pokeball.addEventListener('mouseleave', () => {
        gsap.to(".pokeball-top", {
            rotation: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Previous animations remain the same
    
    // Evolution Scroll Animation
    gsap.registerPlugin(ScrollTrigger);
    
    const evolutionItems = gsap.utils.toArray('.evolution-item');
    
    evolutionItems.forEach((item, i) => {
        // Set up scroll triggers for each evolution line
        ScrollTrigger.create({
            trigger: item,
            start: "top center",
            end: "+=600",
            scrub: true,
            markers: false, // Set to true for debugging
            onUpdate: (self) => {
                const progress = self.progress;
                
                // First half of scroll - show middle evolution
                if (progress < 0.5) {
                    item.classList.add('active');
                    item.classList.remove('final');
                } 
                // Second half of scroll - show final evolution
                else {
                    item.classList.add('final');
                }
                
                // Reset when scrolling back up
                if (progress === 0) {
                    item.classList.remove('active', 'final');
                }
            }
        });
        
        // Add slight stagger between items
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1
        });
    });
    
    // Add floating animation to Pokémon images
    evolutionItems.forEach(item => {
        const pokemon = item.querySelector('.evolution-pokemon');
        gsap.to(pokemon, {
            y: -20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
});