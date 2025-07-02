 const CONFIG = {
    animationDuration: 300,
    loadingDelay: 1500,
    themes: {
        light: 'light',
        dark: 'dark'
    }
};

// Estado da aplicação
const AppState = {
    currentTheme: localStorage.getItem('theme') || 'light',
    isLoading: false
};

// Utilitários
const Utils = {
    // Debounce para otimizar performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Animação suave para scroll
    smoothScroll(target, duration = 800) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    },

    // Mostrar notificação
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 100);

        // Remover após duração especificada
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle-fill',
            error: 'exclamation-triangle-fill',
            warning: 'exclamation-circle-fill',
            info: 'info-circle-fill'
        };
        return icons[type] || icons.info;
    }
};

// Gerenciador de temas
const ThemeManager = {
    init() {
        this.applyTheme(AppState.currentTheme);
        this.bindEvents();
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        AppState.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateThemeIcon(theme);
    },

    updateThemeIcon(theme) {
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    },

    toggle() {
        const newTheme = AppState.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Feedback visual
        const button = document.getElementById('theme-toggle');
        if (button) {
            button.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                button.style.transform = '';
            }, 300);
        }

        Utils.showNotification(
            `Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`,
            'success',
            2000
        );
    },

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
    }
};

// Gerenciador de animações
const AnimationManager = {
    init() {
        this.observeElements();
        this.addScrollAnimations();
    },

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar cards
        document.querySelectorAll('.profile-card').forEach(card => {
            observer.observe(card);
        });
    },

    addScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-section');
            
            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }
};

// Gerenciador de cards
const CardManager = {
    init() {
        this.bindCardEvents();
        this.addCardAnimations();
    },

    bindCardEvents() {
        document.querySelectorAll('.profile-card').forEach(card => {
            // Evento de clique
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCardClick(card);
            });

            // Efeitos de hover
            card.addEventListener('mouseenter', () => {
                this.addHoverEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeHoverEffect(card);
            });

            // Efeito de foco para acessibilidade
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardClick(card);
                }
            });
        });
    },

    handleCardClick(card) {
        const profile = card.getAttribute('data-profile');
        
        // Mostrar loading
        this.showLoading();

        // Simular navegação (aqui você pode adicionar a lógica real de navegação)
        setTimeout(() => {
            this.hideLoading();
            
            // URLs de exemplo - substitua pelas URLs reais
            const urls = {
                aluno: '/cadastro',
                gestor: '/gestor/tela_gestor',
                admin: '/gestor/cadastro_gestor/'
            };

            const url = urls[profile];
            if (url) {
                Utils.showNotification(
                    `Redirecionando para área do ${profile}...`,
                    'info',
                    2000
                );
                
                // Simular redirecionamento
                setTimeout(() => {
                    // window.location.href = url;
                    console.log(`Redirecionando para: ${url}`);
                }, 1000);
            }
        }, CONFIG.loadingDelay);

        // Adicionar efeito visual ao card clicado
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    },

    addHoverEffect(card) {
        // Efeito de partículas ou brilho (opcional)
        card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    },

    removeHoverEffect(card) {
        card.style.boxShadow = '';
    },

    addCardAnimations() {
        // Animação de entrada escalonada
        document.querySelectorAll('.profile-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    },

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
            AppState.isLoading = true;
        }
    },

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
            AppState.isLoading = false;
        }
    }
};

// Gerenciador de navegação
const NavigationManager = {
    init() {
        this.bindNavEvents();
        this.addNavbarEffects();
    },

    bindNavEvents() {
        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                Utils.smoothScroll(target);
            });
        });

        // Efeito da navbar no scroll
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', Utils.debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (navbar) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    navbar.style.transform = 'translateY(0)';
                }
                
                // Adicionar backdrop blur quando scrolled
                if (scrollTop > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            lastScrollTop = scrollTop;
        }, 10));
    },

    addNavbarEffects() {
        // Efeito de hover nos links da navbar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });

            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
};

// Gerenciador de performance
const PerformanceManager = {
    init() {
        this.optimizeImages();
        this.addPreloadHints();
    },

    optimizeImages() {
        // Lazy loading para imagens (se houver)
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    addPreloadHints() {
        // Preload de recursos críticos
        const criticalResources = [
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
            'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }
};

// Inicialização da aplicação
class App {
    constructor() {
        this.init();
    }

    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('🚀 School Face - Sistema iniciado');

        // Inicializar módulos
        ThemeManager.init();
        AnimationManager.init();
        CardManager.init();
        NavigationManager.init();
        PerformanceManager.init();

        // Adicionar estilos dinâmicos
        this.addDynamicStyles();

        // Mostrar mensagem de boas-vindas
        setTimeout(() => {
            Utils.showNotification(
                'Bem-vindo ao School Face! Escolha seu perfil para continuar.',
                'info',
                4000
            );
        }, 1000);
    }

    addDynamicStyles() {
        // Adicionar estilos para notificações
        const notificationStyles = `
            <style>
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    transform: translateX(400px);
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 10000;
                    border-left: 4px solid var(--primary-color);
                }

                .notification.show {
                    transform: translateX(0);
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-primary);
                    font-weight: 500;
                }

                .notification-success {
                    border-left-color: var(--success-color);
                }

                .notification-error {
                    border-left-color: var(--danger-color);
                }

                .notification-warning {
                    border-left-color: var(--warning-color);
                }

                .navbar.scrolled {
                    background: rgba(37, 99, 235, 0.95) !important;
                    backdrop-filter: blur(20px);
                }

                @media (max-width: 768px) {
                    .notification {
                        right: 10px;
                        left: 10px;
                        transform: translateY(-100px);
                    }

                    .notification.show {
                        transform: translateY(0);
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', notificationStyles);
    }
}

// Inicializar aplicação
new App();

// Exportar para uso global (se necessário)
window.SchoolFace = {
    Utils,
    ThemeManager,
    CardManager,
    NavigationManager
};
