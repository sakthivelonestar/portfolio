
// defalut dom runtime
document.addEventListener("click", function(event) {
  // menu
  var menu = document.getElementById("menuOptions");
  
  var menuIcon = document.querySelector(".menu");
  if (menu && !menu.contains(event.target) && !menuIcon.contains(event.target)) {
      menu.style.display = "none";
  }
  // logo
   var icon = document.querySelector(".svgModal");

  // Check if the clicked element is NOT the icon
  if (icon && !icon.contains(event.target)) {
      icon.classList.remove("expanded"); 
      const body = document.querySelector('body');
      body.classList.remove('blur-background');
      body.classList.add('body');
  }
  
});

// This sets up the titles with the correct active state behavior
document.addEventListener("DOMContentLoaded", function() {
  // Select all title elements
  const titles = document.querySelectorAll(".lap-titles h1");

  // Set the first title as active only on initial page load
  // This ensures we don't reset to the first title after every click elsewhere
  if (titles.length > 0 && !document.querySelector(".lap-titles h1.active")) {
      titles[0].classList.add("active");
  }
  // Add click event to each title (Header)
  titles.forEach(title => {
      title.addEventListener("click", () => {
          // Remove active class from all titles
          titles.forEach(t => t.classList.remove("active"));

          // Add active class only to the clicked title
          title.classList.add("active");
      });
  });  

  const header = document.querySelector('.header');
  const headerHeight = header.offsetHeight;
  const extraGap = 40; // Extra gap in pixels (adjust as needed)
  const links = document.querySelectorAll('.rout-title, .menu-options a');

  links.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);

          if (targetSection) {
              const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraGap;
              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });
  
  // defalut dark mode
  const body = document.body;
  const icon = document.getElementById("darkIcon");
  icon.classList.replace("fa-moon", "fa-sun");
  icon.style.color = "orange";
  body.classList.toggle("dark-mode");

  radiobutton("stars");
  initializeMouseTrail();
  startRepeatingTask()
});



// Dark mode Iocn chnages
function toggleDarkMode() {
  const body = document.body;
  const icon = document.getElementById("darkIcon");

  if (body.classList.contains("dark-mode")) {
    icon.classList.replace("fa-sun", "fa-moon");
    icon.style.color = "black"; 
    body.classList.remove("dark-mode");

  } else {
    icon.classList.replace("fa-moon", "fa-sun");
    icon.style.color = "orange";
    body.classList.toggle("dark-mode");
    } 
  // Get the currently selected radio button
  const selectedRadio = document.querySelector('input[name="background"]:checked');
  
  // Initialize only the selected animation
  if (selectedRadio) {
    switch(selectedRadio.value) {
      case "floating":
        initializeFloatingParticles();
        break;
      case "bubbles":
        initializeBubbleEffect();
        break;
      case "fire":
        initializeFireEffect();
        break;
      case "fluid":
        initializeFluidSimulation();
        break;
      case "stars":
        initializeStarsAnimation();
        break;
      default:
        initializeFluidSimulation();
    }
    } else {
      initializeFluidSimulation();
    }
}

function startRepeatingTask() {
  setInterval(() => {
  const selectedRadio = document.querySelector('input[name="background"]:checked');
  // Initialize only the selected animation
  if (selectedRadio) {
    switch(selectedRadio.value) {
      case "floating":
        initializeFloatingParticles();
        break;
      case "bubbles":
        initializeBubbleEffect();
        break;
      case "fire":
        initializeFireEffect();
        break;
      case "fluid":
        initializeFluidSimulation();
        break;
      case "stars":
        initializeStarsAnimation();
        break;
      default:
        initializeFluidSimulation();
    }
    } else {
      initializeFluidSimulation();
    }
  }, 60000); 
}

// Menu bar clse open
function toggleMenu() {
  var menu = document.getElementById("menuOptions");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// Icon
function showModal() {
  const icon = document.querySelector('.svgModal');
  const body = document.querySelector('body');
  icon.classList.toggle('expanded');
  if (icon.classList.contains('expanded')) {
      body.classList.add('blur-background'); 
  } else {
      body.classList.remove('blur-background'); 
  }
}

function startingloader() {
  const icon = document.querySelector('.svgModal');
  const body = document.querySelector('body');
  
  icon.classList.add('expanded'); // Show modal on start
  body.classList.add('blur-background'); 

  // Automatically remove modal after 5 seconds
  setTimeout(() => {
      icon.classList.remove('expanded');
      body.classList.remove('blur-background');
  }, 3000);
}

// Run the function when the page loads
window.onload = startingloader;
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
  });

  card.addEventListener('mouseleave', () => {
      card.classList.remove('is-flipped');
  });
});

// project card rotate option
function toggleBackside(card) {
  card.classList.toggle('flipped');
}

let isDescriptionMode = false;
function toggleViewMode() {
  const toggleButton = document.getElementById('toggleButton');
  const projectCards = document.querySelectorAll('.project-card');

  isDescriptionMode = !isDescriptionMode;
  toggleButton.textContent = isDescriptionMode ? 'Show Projects' : 'Show Descriptions';

  projectCards.forEach(card => {
      card.classList.toggle('flipped', isDescriptionMode);
  });
}

// Certifications & Educations
function applyCircularText(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const text = el.getAttribute("data-text") || "";
    const radius = parseInt(el.getAttribute("data-radius")) || 120;
    el.innerHTML = "";

    // Split text into words
    const words = text.split(" ");
    
    // Constants for letter and word spacing
    const letterSpacingDeg = 6;  
    const wordSpacingDeg = 15;
    
    // Calculate total angle needed
    let totalDegrees = 0;
    words.forEach((word, i) => {
      totalDegrees += (word.length - 1) * letterSpacingDeg;
      if (i < words.length - 1) {
        totalDegrees += wordSpacingDeg;
      }
    });
    
    // Start at top of circle (-90 deg) and center the text
    let currentAngle = 358 - totalDegrees / 2;
    
    // Process each word
    words.forEach((word, wordIndex) => {
      const chars = word.split("");
      
      // Process each character in the word
      chars.forEach((char, charIndex) => {
        const span = document.createElement("span");
        span.innerText = char;
        
        // Position and rotate each character
        span.style.position = "absolute";
        span.style.transform = `rotate(${currentAngle}deg) translateY(-${radius}px)`;
        
        el.appendChild(span);
        
        // Add letter spacing
        if (charIndex < chars.length - 1) {
          currentAngle += letterSpacingDeg;
        }
      });
      
      // Add word spacing after each word (except the last word)
      if (wordIndex < words.length - 1) {
        currentAngle += wordSpacingDeg;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyCircularText(".circle-text");
});

// Animation background js
function radiobutton(value) {
  const floating = document.getElementById('floating-js');
  const bubbles = document.getElementById('bubbles-js');
  const fire = document.getElementById('fire-js');
  const fluid = document.getElementById('fluid-js');
  const stars = document.getElementById('stars-js');
    bgAnimationRestrict()

  switch(value) {
    case "floating":  
      floating.style.display = 'block';
      initializeFloatingParticles();
      break; 
    case "bubbles":  
      bubbles.style.display = 'block';
      initializeBubbleEffect();
      break;
    case "fire":  
      fire.style.display = 'block';
      initializeFireEffect();
      break;
    case "fluid":
      fluid.style.display = 'block'; 
      initializeFluidSimulation();
      break; 
    case "stars":
      stars.style.display = 'block';
      initializeStarsAnimation()
      break;
    default:
      // Default to constellation if no valid option provided
      fluid.style.display = 'block';
      initializeFluidSimulation();
  }
}

function bgAnimationRestrict(){
  const floating = document.getElementById('floating-js');
  const bubbles = document.getElementById('bubbles-js');
  const fire = document.getElementById('fire-js');
  const fluid = document.getElementById('fluid-js');
  const stars = document.getElementById('stars-js');
  floating.style.display = 'none';
  bubbles.style.display = 'none';
  fire.style.display = 'none';
  fluid.style.display = 'none';
  stars.style.display = 'none';
}

// ===============================================================
// 1. LIQUID FLUID SIMULATION
// ===============================================================
function initializeFluidSimulation() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  tsParticles.load("fluid-js", {
    fpsLimit: 60,
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: isDarkMode 
          ? ["#4285f4", "#34a853", "#fbbc05", "#ea4335"] // Dark mode colors
          : ["#1a73e8", "#137333", "#b31412", "#ea8600"], // Light mode colors
        animation: {
          enable: true,
          speed: 10,
          sync: false
        }
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: !isDarkMode ? 0.7 : 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: !isDarkMode ? 0.4 : 0.2,
          sync: false
        }
      },
      size: {
        value: 20,
        random: true,
        anim: {
          enable: true,
          speed: 4,
          size_min: 8,
          sync: false
        }
      },
      links: {
        enable: true,
        distance: 150,
        color: !isDarkMode ? "#ffffff" : "#000000",
        opacity: isDarkMode ? 0.2 : 0.4,
        width: 1,
        triangles: {
          enable: true,
          color: !isDarkMode ? "#ffffff" : "#000000",
          opacity: !isDarkMode ? 0.01 : 0.05
        }
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "bubble"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        bubble: {
          distance: 200,
          size: 40,
          duration: 2,
          opacity: !isDarkMode ? 0.8 : 0.6,
          speed: 3
        },
        push: {
          quantity: 4
        }
      }
    },
    backgroundMask: {
      enable: true,
      cover: {
        color: {
          value: !isDarkMode 
            ? { r: 0, g: 0, b: 0 }
            : { r: 255, g: 255, b: 255 }
        },
        opacity: !isDarkMode ? 0.2 : 0.15
      }
    },
    background: {
      color: "transparent",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    },
    motion: {
      disable: false,
      reduce: {
        factor: 4,
        value: true
      }
    }
  });
}
// ===============================================================
// 2. FLOATING PARTICLES
// ===============================================================
function initializeFloatingParticles() {
  tsParticles.load("floating-js", {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#4fc3f7", "#00b0ff", "#0091ea", "#64b5f6", "#42a5f5"]
      },
      shape: {
        type: "circle",
        stroke: {
          width: 2,
          color: "#ffffff"
        }
      },
      opacity: {
        value: 0.7,
        random: true,
        anim: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.3,
          sync: false
        }
      },
      size: {
        value: 6,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          size_min: 3,
          sync: false
        }
      },
      links: {
        enable: false
      },
      move: {
        enable: true,
        speed: 2,
        direction: "bottom",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      },
      shadow: {
        enable: true,
        color: "#000000",
        blur: 5,
        offset: {
          x: 0,
          y: 0
        }
      },
      glow: {
        enable: true,
        color: "#0091ea",
        blur: 10
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: ["bubble", "trail"]
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        bubble: {
          distance: 250,
          size: 12,
          duration: 2,
          opacity: 1,
          speed: 3
        },
        trail: {
          delay: 0.005,
          particles: {
            size: 3,
            opacity: 0.3
          }
        },
        repulse: {
          distance: 200,
          duration: 0.4
        }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent"
    }
  });
}
// ===============================================================
// 3. BUBBLE EFFECT
// ===============================================================
function initializeBubbleEffect() {
  tsParticles.load("bubbles-js", {
    fullScreen: { enable: false }, // if you're containing it in a div
    particles: {
      number: {
        value: 25, // Fewer = cleaner
        density: {
          enable: true,
          value_area: 1000
        }
      },
      color: {
        value: ["#00ffff", "#0099ff", "#66ff00", "#ff66ff", "#ffff00"]
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0, // Removed hard stroke for softer bubbles
        }
      },
      opacity: {
        value: 0.4,
        random: true,
        anim: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 20,
        random: { enable: true, minimumValue: 10 },
        anim: {
          enable: true,
          speed: 1.5,
          size_min: 8,
          sync: false
        }
      },
      links: {
        enable: false
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: "top",
        random: true,
        straight: false,
        outMode: "out",
        bounce: false
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "bubble"
        },
        onClick: {
          enable: true,
          mode: "repulse"
        },
        resize: true
      },
      modes: {
        bubble: {
          distance: 200,
          size: 35,
          duration: 3,
          opacity: 0.7
        },
        repulse: {
          distance: 150,
          duration: 0.4
        }
      }
    },
    background: {
      color: "transparent"
    },
    retina_detect: true
  });
}

// ===============================================================
// 4. FIRE EFFECT
// ===============================================================
function initializeFireEffect() {
  tsParticles.load("fire-js", {
    fullScreen: {
      enable: true,
      zIndex: -1
    },
    background: {
      color: "transparent"
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 0 // We use emitters only
      },
      color: {
        value: ["#ff9900", "#ff5e00", "#ff1b00", "#ff3300"]
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: { min: 0.2, max: 0.6 },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: { min: 2, max: 7 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 1,
          sync: false
        }
      },
      move: {
        enable: true,
        direction: "top",
        speed: { min: 1, max: 2 },
        random: true,
        straight: false,
        outModes: {
          default: "destroy"
        }
      },
      life: {
        count: 0, // ♾️ infinite life
        duration: {
          sync: false,
          value: { min: 3, max: 5 }
        }
      }
    },
    emitters: [
      {
        direction: "top",
        rate: {
          delay: 0.1,
          quantity: 5
        },
        position: {
          x: 50,
          y: 100
        },
        size: {
          width: 120,
          height: 10
        }
      },
      {
        direction: "top",
        rate: {
          delay: 0.15,
          quantity: 3
        },
        position: {
          x: 40,
          y: 100
        },
        size: {
          width: 80,
          height: 10
        }
      },
      {
        direction: "top",
        rate: {
          delay: 0.12,
          quantity: 4
        },
        position: {
          x: 60,
          y: 100
        },
        size: {
          width: 80,
          height: 10
        }
      }
    ],
    detectRetina: true
  });
}

// ===============================================================
// 6. STARS ANIMATION - Enhanced with Sun/Moon
// ===============================================================
function initializeStarsAnimation() {
  const isDarkMode = document.body.classList.contains('dark-mode');

  tsParticles.load("stars-js", {
    fpsLimit: 60,
    particles: {
      number: {
        value: isDarkMode ? 100 : 80, // Reduced count for neat sky
        density: {
          enable: true,
          value_area: 1000
        }
      },
      color: {
        value: isDarkMode 
          ? ["#ffffff", "#e0e0e0", "#bdbdbd", "#ccccff"]
          : ["#ffffff", "#ffeb3b", "#ffc107", "#fff9c4"]
      },
      shape: {
        type: ["star", "circle"],
        options: {
          star: {
            sides: 5,
            inset: 2
          }
        }
      },
      opacity: {
        value: 0.7,
        random: true,
        anim: {
          enable: true,
          speed: 0.3,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: isDarkMode ? 4 : 4,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          size_min: 0.1,
          sync: false
        }
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.08,
          opacity: 1
        },
        lines: {
          enable: false
        }
      },
      move: {
        enable: true,
        speed: 0.2,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out"
        },
        attract: {
          enable: false
        }
      }
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: "bubble"
        },
        onClick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        bubble: {
          distance: 200,
          size: 5,
          duration: 2,
          opacity: 0.8,
          speed: 1.5
        },
        push: {
          quantity: 1
        }
      }
    },
    background: {
      color: "transparent"
    },
    retina_detect: true,
    emitters: [
      {
        position: {
          x: 85,
          y: 15
        },
        rate: {
          delay: 0,
          quantity: 0
        },
        size: {
          width: 0,
          height: 0
        },
        particles: {
          shape: {
            type: "circle"
          },
          size: {
            value: isDarkMode ? 60 : 80
          },
          color: {
            value: isDarkMode ? "#e0e0e0" : "#ffdd00"
          },
          opacity: {
            value: isDarkMode ? 0.9 : 0.8
          },
          move: {
            enable: false,
            outModes: {
              default: "out"
            }
          },
          shadow: {
            enable: true,
            color: isDarkMode ? "#a0a0a0" : "#ff8800",
            blur: 5
          },
          glow: {
            enable: true,
            color: isDarkMode ? "#e0e0e0" : "#ffdd00",
            blur: isDarkMode ? 10 : 20
          }
        }
      },
      ...(isDarkMode ? [
        // Moon craters
        {
          position: { x: 82, y: 16 },
          rate: { delay: 0, quantity: 0 },
          size: { width: 0, height: 0 },
          particles: {
            shape: { type: "circle" },
            size: { value: 6 },
            color: { value: "#b0b0b0" },
            opacity: { value: 0.5 },
            move: { enable: false }
          }
        },
        {
          position: { x: 86, y: 17 },
          rate: { delay: 0, quantity: 0 },
          size: { width: 0, height: 0 },
          particles: {
            shape: { type: "circle" },
            size: { value: 7 },
            color: { value: "#a0a0a0" },
            opacity: { value: 0.4 },
            move: { enable: false }
          }
        }
      ] : [
        // Sun rays
        {
          position: { x: 80, y: 20 },
          rate: { delay: 0.5, quantity: 1 },
          size: { width: 0, height: 0 },
          particles: {
            shape: { type: "triangle" },
            size: { value: 15 },
            color: { value: "#ffcc00" },
            opacity: { value: 0.7 },
            life: { duration: { value: 2 } },
            move: {
              enable: true,
              speed: 2,
              direction: "random",
              outModes: { default: "out" }
            }
          }
        }
      ])
    ]
  }).catch(error => {
    console.error("Could not initialize stars animation:", error);
  });
  
  // Create additional elements if needed that can't be done through tsParticles
  const starsContainer = document.getElementById("stars-js");
  
  // Clear any existing celestial elements (in case of re-initialization)
  const existingCelestial = document.getElementById("celestial-body");
  if (existingCelestial) {
    existingCelestial.remove();
  }
  
  // Add custom CSS effects for additional styling
  const style = document.createElement('style');
  style.textContent = `
    #stars-js {
      overflow: hidden;
    }
    
    #celestial-body {
      position: absolute;
      top: 0%;     
      right: 90%;
      border-radius: 50%;
      box-shadow: ${isDarkMode ? 
        '0 0 20px 5px rgba(255, 255, 255, 0.3)' : 
        '0 0 40px 20px rgba(255, 215, 0, 0.6)'};
      animation: ${isDarkMode ? 'moon-glow' : 'sun-rays'} 6s infinite alternate;
      z-index: -1;
    }
    
    @keyframes sun-rays {
      0% { box-shadow: 0 0 40px 20px rgba(255, 215, 0, 0.6); }
      50% { box-shadow: 0 0 60px 30px rgba(255, 165, 0, 0.7); }
      100% { box-shadow: 0 0 50px 25px rgba(255, 215, 0, 0.6); }
    }
    
    @keyframes moon-glow {
      0% { box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.3); }
      50% { box-shadow: 0 0 25px 8px rgba(200, 200, 255, 0.4); }
      100% { box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.3); }
    }
  `;
  document.head.appendChild(style);
  
  // Create celestial body element with better styling
  const celestialBody = document.createElement('div');
  celestialBody.id = 'celestial-body';
  celestialBody.style.width = isDarkMode ? '150px' : '140px';  // Adjusted sizes
  celestialBody.style.height = isDarkMode ? '150px' : '140px'
  celestialBody.style.background = isDarkMode ? 
    'radial-gradient(circle at 40% 40%, #ffffff 0%, #e0e0e0 50%, #a0a0a0 100%)' : 
    'radial-gradient(circle at 40% 40%, #ffffcc 0%, #ffdd00 50%, #ff8800 100%)';
  
  // Add moon craters or sun features
  if (isDarkMode) {
    // Add craters to moon
    const createCrater = (size, top, left, opacity) => {
      const crater = document.createElement('div');
      crater.style.position = 'absolute';
      crater.style.width = size;
      crater.style.height = size;
      crater.style.borderRadius = '50%';
      crater.style.backgroundColor = 'rgba(160, 160, 160, ' + opacity + ')';
      crater.style.top = top;
      crater.style.left = left;
      return crater;
    };
    
    celestialBody.appendChild(createCrater('15px', '20%', '30%', '0.4'));
    celestialBody.appendChild(createCrater('10px', '50%', '60%', '0.3'));
    celestialBody.appendChild(createCrater('8px', '70%', '25%', '0.3'));
  } else {
    // Add solar flares
    celestialBody.style.animation = 'sun-pulse 4s infinite alternate';
    const style2 = document.createElement('style');
    style2.textContent = `
      @keyframes sun-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style2);
  }
  
  starsContainer.appendChild(celestialBody);
}
 

// ===============================================================
// **. MOUSE TRAIL ANIMATION
// ===============================================================
function initializeMouseTrail() {
  const body = document.body;
  const colors = ['#ff69b4','#ff1493','#ff0066','#ff007f','#ff0040'];
  let lastTime = 15;
  const minInterval = 150; // Increase this value to reduce frequency (in milliseconds)

  body.addEventListener('mousemove', e => {
    const currentTime = Date.now();
    if (currentTime - lastTime < minInterval) return; // Skip if not enough time has passed
    lastTime = currentTime;

    requestAnimationFrame(() => {
      const heart = document.createElement('div');
      heart.className = 'heart-particle';
      heart.textContent = '❤';
      
      // position
      heart.style.left = `${e.clientX - 8}px`;
      heart.style.top  = `${e.clientY - 8}px`;
      
      // random color
      heart.style.color = colors[(Math.random() * colors.length)|0];
      
      // random movement & rotation
      const dx  = (Math.random() * 40 - 20) + 'px';
      const dy  = (-(Math.random() * 50) - 20) + 'px';
      const rot = (Math.random() * 30 - 15) + 'deg';
      heart.style.setProperty('--dx', dx);
      heart.style.setProperty('--dy', dy);
      heart.style.setProperty('--rot', rot);
      
      // remove after animation
      heart.addEventListener('animationend', () => heart.remove());
      
      body.appendChild(heart);
    });
  });
}

