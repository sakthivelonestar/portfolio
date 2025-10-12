
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
  
  // defalut light mode
  const body = document.body;
  const icon = document.getElementById("darkIcon");
  icon.classList.replace("fa-sun", "fa-moon");
  icon.style.color = "block"

  // defalut dark mode
  // const body = document.body;
  // const icon = document.getElementById("darkIcon");
  // icon.classList.replace("fa-moon", "fa-sun");
  // body.classList.toggle("dark-mode");
  // icon.style.color = "orange";


  radiobutton("bubbles");
  initializeMouseTrail();
  initializeBubbleEffect();

  // radiobutton("stars");
  // initializeBubbleEffect();
  // startRepeatingTask()
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
// 4. star conection blink
// ===============================================================
function initializeFireEffect() {
  const icon = document.getElementById("darkIcon");
  tsParticles.load("fire-js", {
    fullScreen: {
      enable: true,
      zIndex: -1
    },
    background: {
      color: "transparent"
    },
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#ff69b4", "#ff1493", "#ff007f", "#ffb6c1", "#cdc0ffff"]
      },
      shape: {
        type: ["circle", "star"],
        options: {
          star: {
            sides: 5,
            inset: 2
          }
        }
      },
      opacity: {
        value: 0.8,
        random: true,
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.3,
          sync: false
        }
      },
      size: {
        value: 8,
        random: {
          enable: true,
          minimumValue: 4
        },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 4,
          sync: false
        }
      },
      rotate: {
        value: 0,
        direction: "clockwise",
        animation: {
          enable: true,
          speed: 5,
          sync: false
        }
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out"
        },
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        },
        path: {
          enable: true,
          options: {
            size: 20,
            draw: false,
            delay: 10
          }
        },
        trail: {
          enable: true,
          length: 10,
           fillColor: icon.classList.contains('fa-moon') 
      ? "rgba(250, 203, 203, 1)" // Dark purple for dark mode
      : "#3c0420ff"
        }
        
      }
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: {
          enable: true,
          mode: "grab"
        },
        onClick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 0.4
          }
        },
        push: {
          quantity: 4,
          particles: {
            color: {
              value: "#462c7cff"
            },
            size: {
              value: 10
            },
            move: {
              speed: 2,
              trail: {
                enable: true,
                length: 5
              }
            }
          }
        }
      }
    },
    background: {
      color: "transparent"
    },
    detectRetina: true,
    themes: [
      {
        name: "flower",
        default: {
          value: true,
          mode: "light"
        },
        options: {
          particles: {
            color: {
              value: ["#ff69b4", "#ff1493", "#ff007f"]
            }
          }
        }
      }
    ]
  });
}


// ===============================================================
// 5. STARS ANIMATION - Enhanced with Sun/Moon
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
// **MOUSE TRAIL ANIMATION
// ===============================================================

function initializeMouseTrail() {
  const body = document.body;
  
  const style = document.createElement('style');
  style.textContent = `
    .cursor-container {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .sparkle-cursor {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fbbf24;
      transform: translate(-50%, -50%);
      pointer-events: none;
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.9);
    }
    
    .sparkle {
      position: absolute;
      pointer-events: none;
      transform: translate(-50%, -50%);
      animation: sparkle-twinkle var(--duration) ease-out forwards;
    }
    
    .sparkle::before,
    .sparkle::after {
      content: '';
      position: absolute;
      background: var(--sparkle-color);
      box-shadow: 0 0 8px var(--sparkle-color);
    }
    
    .sparkle::before {
      width: var(--size);
      height: 2px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .sparkle::after {
      width: 2px;
      height: var(--size);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .sparkle-dot {
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--sparkle-color);
      transform: translate(-50%, -50%);
      box-shadow: 0 0 6px var(--sparkle-color);
      animation: dot-fade var(--duration) ease-out forwards;
    }
    
    @keyframes sparkle-twinkle {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) rotate(0deg) scale(0);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) rotate(180deg) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) rotate(360deg) scale(0);
      }
    }
    
    @keyframes dot-fade {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) translate(0, 0);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) translate(var(--tx), var(--ty));
      }
    }
    
    @media (max-width: 768px) {
      .cursor-container {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  const cursorContainer = document.createElement('div');
  cursorContainer.className = 'cursor-container';
  body.appendChild(cursorContainer);

  const cursor = document.createElement('div');
  cursor.className = 'sparkle-cursor';
  cursorContainer.appendChild(cursor);
  
  const colors = ['#fbbf24', '#f59e0b', '#fef3c7', '#fde047', '#fb923c'];
  
  let lastTime = 0;
  const minInterval = 40;

  body.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    const currentTime = Date.now();
    if (currentTime - lastTime >= minInterval) {
      lastTime = currentTime;
      
      // Create star sparkle
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 6;
      const duration = Math.random() * 0.4 + 0.5;
      
      sparkle.style.setProperty('--sparkle-color', color);
      sparkle.style.setProperty('--size', `${size}px`);
      sparkle.style.setProperty('--duration', `${duration}s`);
      
      sparkle.addEventListener('animationend', () => sparkle.remove());
      cursorContainer.appendChild(sparkle);
      
      // Add random sparkle dots
      if (Math.random() > 0.6) {
        for (let i = 0; i < 3; i++) {
          const dot = document.createElement('div');
          dot.className = 'sparkle-dot';
          dot.style.left = `${e.clientX}px`;
          dot.style.top = `${e.clientY}px`;
          
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 30 + 15;
          const tx = Math.cos(angle) * distance;
          const ty = Math.sin(angle) * distance;
          
          dot.style.setProperty('--sparkle-color', color);
          dot.style.setProperty('--tx', `${tx}px`);
          dot.style.setProperty('--ty', `${ty}px`);
          dot.style.setProperty('--duration', `${duration}s`);
          
          dot.addEventListener('animationend', () => dot.remove());
          cursorContainer.appendChild(dot);
        }
      }
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  document.addEventListener('mousedown', (e) => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
    
    // Create burst of sparkles on click
    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 8;
      
      sparkle.style.setProperty('--sparkle-color', color);
      sparkle.style.setProperty('--size', `${size}px`);
      sparkle.style.setProperty('--duration', '0.6s');
      
      const angle = (i / 12) * Math.PI * 2;
      const distance = Math.random() * 40 + 20;
      sparkle.style.left = `${e.clientX + Math.cos(angle) * distance}px`;
      sparkle.style.top = `${e.clientY + Math.sin(angle) * distance}px`;
      
      sparkle.addEventListener('animationend', () => sparkle.remove());
      cursorContainer.appendChild(sparkle);
    }
  });
  
  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  return function cleanup() {
    cursorContainer.remove();
    style.remove();
  };
}



// contact form

// Remove the duplicate contact form handlers and consolidate into one clean version
document.addEventListener('DOMContentLoaded', function() {
  // Remove all existing handlers first
  const existingHandlers = document.querySelectorAll('[data-handler="contact"]');
  existingHandlers.forEach(handler => handler.remove());

  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return; // Guard clause if form doesn't exist

  // Initialize EmailJS once
  emailjs.init("4IsaU0jLyk7NQXfc8");

 // filepath: d:\git_Hub\portfolio\portfolio.js
// Replace the existing form submit handler with this:
contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();
    
  const submitBtn = contactForm.querySelector('.submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const originalBtnText = btnText.textContent;
  
  try {
    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;

    await emailjs.sendForm(
      'service_3nbe2df',
      'template_zwjthza',
      contactForm,
      '4IsaU0jLyk7NQXfc8'
    );
    
    showAlert('success', 'Message sent successfully! I will get back to you soon.');
    contactForm.reset();
  } catch (error) {
    console.error('Error sending message:', error);
    showAlert('error', 'Failed to send message. Please try again.');
  } finally {
    btnText.textContent = originalBtnText;
    submitBtn.disabled = false;
  }
});

// Add this function to handle the custom alert
function showAlert(type, message) {
  const alertModal = document.getElementById('alertModal');
  const alertMessage = alertModal.querySelector('.alert-message');
  const successIcon = alertModal.querySelector('.success-icon');
  const errorIcon = alertModal.querySelector('.error-icon');
  
  // Set message and show correct icon
  alertMessage.textContent = message;
  successIcon.style.display = type === 'success' ? 'block' : 'none';
  errorIcon.style.display = type === 'error' ? 'block' : 'none';
  
  // Show modal with animation
  alertModal.style.display = 'flex';
  
  // Add shake animation for error
  if (type === 'error') {
    alertModal.querySelector('.alert-content').style.animation = 'shake 0.5s ease-in-out';
  }
  
  // Handle close button
  const closeBtn = alertModal.querySelector('.alert-close');
  closeBtn.onclick = () => {
    alertModal.style.display = 'none';
  };
  
  // Close on background click
  alertModal.onclick = (e) => {
    if (e.target === alertModal) {
      alertModal.style.display = 'none';
    }
  };
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && alertModal.style.display === 'flex') {
      alertModal.style.display = 'none';
    }
  });
}

  // Single handler for mailto links
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    // Remove existing handlers first
    const clone = link.cloneNode(true);
    link.parentNode.replaceChild(clone, link);
    
    clone.addEventListener('click', (e) => {
      e.preventDefault();
      const email = clone.getAttribute('href').replace('mailto:', '');
      setTimeout(() => {
        window.location.href = `mailto:${email}`;
      }, 100);
    });
  });

  // Single floating label effect handler
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
  formInputs.forEach(input => {
    input.setAttribute('placeholder', ' ');
    
    const inputClone = input.cloneNode(true);
    input.parentNode.replaceChild(inputClone, input);
    
    inputClone.addEventListener('focus', () => {
      inputClone.parentElement.classList.add('focused');
    });
    
    inputClone.addEventListener('blur', () => {
      if (!inputClone.value) {
        inputClone.parentElement.classList.remove('focused');
      }
    });
  });
});