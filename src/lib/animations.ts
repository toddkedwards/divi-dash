export const animations = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  
  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  scaleInHover: 'hover:animate-scale-in',
  
  // Slide animations
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  slideOutLeft: 'animate-slide-out-left',
  slideOutRight: 'animate-slide-out-right',
  
  // Transition durations
  duration: {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  },
  
  // Easing functions
  easing: {
    default: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Add these styles to your global CSS file
export const animationStyles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes scale-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  @keyframes slide-in-left {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-out-left {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }

  @keyframes slide-out-right {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-in-out;
  }

  .animate-fade-out {
    animation: fade-out 0.3s ease-in-out;
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.3s ease-in-out;
  }

  .animate-fade-in-down {
    animation: fade-in-down 0.3s ease-in-out;
  }

  .animate-scale-in {
    animation: scale-in 0.2s ease-in-out;
  }

  .animate-scale-out {
    animation: scale-out 0.2s ease-in-out;
  }

  .animate-slide-in-left {
    animation: slide-in-left 0.3s ease-in-out;
  }

  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-in-out;
  }

  .animate-slide-out-left {
    animation: slide-out-left 0.3s ease-in-out;
  }

  .animate-slide-out-right {
    animation: slide-out-right 0.3s ease-in-out;
  }

  /* Hover animations */
  .hover\:animate-scale-in:hover {
    animation: scale-in 0.2s ease-in-out;
  }

  /* Transition utilities */
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .duration-150 {
    transition-duration: 150ms;
  }

  .duration-300 {
    transition-duration: 300ms;
  }

  .duration-500 {
    transition-duration: 500ms;
  }
`; 