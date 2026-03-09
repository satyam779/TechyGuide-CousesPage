(function() {
    'use strict';

    const DOM_STATE = { loading: 'loading', interactive: 'interactive', complete: 'complete' };
    const MODAL_CLOSE_MS = 140;

    const IMAGE_FALLBACKS = {
        'Robotics': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22 viewBox=%220 0 400 280%22%3E%3Crect fill=%22%23fee2e2%22 width=%22400%22 height=%22280%22/%3E%3Ctext fill=%22%234b5563%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ERobotics%3C/text%3E%3C/svg%3E',
        'Python': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22 viewBox=%220 0 400 280%22%3E%3Crect fill=%22%23e0e7ff%22 width=%22400%22 height=%22280%22/%3E%3Ctext fill=%22%234b5563%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EPython%3C/text%3E%3C/svg%3E',
        'AI': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22 viewBox=%220 0 400 280%22%3E%3Crect fill=%22%23fef3c7%22 width=%22400%22 height=%22280%22/%3E%3Ctext fill=%22%234b5563%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EAI%3C/text%3E%3C/svg%3E',
        'AppDev': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22 viewBox=%220 0 400 280%22%3E%3Crect fill=%22%23dcfce7%22 width=%22400%22 height=%22280%22/%3E%3Ctext fill=%22%234b5563%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EApp%20Dev%3C/text%3E%3C/svg%3E',
        'WebDev': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22 viewBox=%220 0 400 280%22%3E%3Crect fill=%22%23f3e8ff%22 width=%22400%22 height=%22280%22/%3E%3Ctext fill=%22%234b5563%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EWeb%20Dev%3C/text%3E%3C/svg%3E',
        'Games': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22 viewBox=%220 0 400 280%22%3E%3Crect fill=%22%23fee2e2%22 width=%22400%22 height=%22280%22/%3E%3Ctext fill=%22%234b5563%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EGames%3C/text%3E%3C/svg%3E',
        'IoT': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22 viewBox=%220 0 400 280%22%3E%3Crect fill=%22%23dbeafe%22 width=%22400%22 height=%22280%22/%3E%3Ctext fill=%22%234b5563%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EIoT%3C/text%3E%3C/svg%3E',
        'Scratch': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22 viewBox=%220 0 400 280%22%3E%3Crect fill=%22%23fef9c3%22 width=%22400%22 height=%22280%22/%3E%3Ctext fill=%22%234b5563%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EScratch%3C/text%3E%3C/svg%3E',
        'Electronics': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22 viewBox=%220 0 400 280%22%3E%3Crect fill=%22%23fee2e2%22 width=%22400%22 height=%22280%22/%3E%3Ctext fill=%22%234b5563%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EElectronics%3C/text%3E%3C/svg%3E'
    };

    function handleImageErrors() {
        document.querySelectorAll('.card-error-handle').forEach(img => {
            const card = img.closest('.card');
            const courseName = card ? card.querySelector('.courses-name')?.textContent?.trim() : '';
            const key = Object.keys(IMAGE_FALLBACKS).find(k => courseName.toLowerCase().includes(k.toLowerCase()));
            
            if (key && IMAGE_FALLBACKS[key]) {
                const applyFallback = () => {
                    img.removeEventListener('error', handleError);
                    img.removeEventListener('load', handleLoad);
                    if (!img.complete || img.naturalHeight === 0) {
                        img.src = IMAGE_FALLBACKS[key];
                    }
                };
                
                const handleError = () => applyFallback();
                const handleLoad = () => img.removeEventListener('error', handleError);
                
                if (img.complete && (img.naturalHeight === 0 || !img.src)) {
                    applyFallback();
                } else {
                    img.addEventListener('error', handleError, { once: true });
                    img.addEventListener('load', handleLoad, { once: true });
                }
            }
        });

        document.querySelectorAll('.img-error-handle').forEach(img => {
            if (img.complete && (!img.src || img.naturalHeight === 0)) {
                img.style.display = 'none';
            } else {
                img.addEventListener('error', function handleError() {
                    img.removeEventListener('error', handleError);
                    img.style.display = 'none';
                }, { once: true });
            }
        });
    }

    function runOnDomReady(callback) {
        if (document.readyState === DOM_STATE.loading) {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
        } else {
            callback();
        }
    }

    const courseDetails = {
        Robotics: {
            title: 'Robotics & Hardware',
            sessions: '23 Sessions',
            projectsCount: '20+ Hands-On Projects',
            assessment: 'Module-wise Assessments',

            whatWillYouLearn: [
                'Arduino programming from basics to advanced',
                'Sensor interfacing (IR, Ultrasonic, DHT, Flame, LDR, etc.)',
                'Motor driver & servo control techniques',
                'Building autonomous robots',
                'Automation system design',
                'Debugging real hardware projects',
                'Practical robotics problem-solving'
            ],

            description: 'Build and program real-world robotics and automation projects using Arduino, sensors, and motor control systems. This course focuses on practical implementation, helping students understand how electronic components interact to build smart systems like obstacle-avoiding robots, smart parking systems, automation devices, and intelligent bots. Students will gain hands-on experience in robotics logic building, hardware interfacing, and real-time debugging.',

            duration: '8–10 Weeks Intensive Practical Program',

            curriculum: [
                'Module 1: Basic Electronics & Display Systems (Display 0–9, Scroll Display, Display Name, TraAic Light, Servo Control)',
                'Module 2: Sensor-Based Mini Projects (IR Object Counter, Digital Distance Meter, Fire Alarm, DHT Fan Controller, Smart Lamp)',
                'Module 3: Smart Automation Systems (Smart Dustbin, Blind Stick, Irrigation System, Radar System, Smart Parking)',
                'Module 4: Beginner Robotics Systems (Obstacle Avoiding Robot, Edge Avoiding Robot, Line Follower Robot)',
                'Module 5: Advanced Autonomous Robotics (Human Following Robot, Maze Solving Robot, Fire Fighter Bot)',
                'Module 6: Wireless & Smart Control Robots (Bluetooth Car, Voice Control Car)'
            ],

            projects: [
                'Line Follower Robot',
                'Obstacle Avoiding Robot',
                'Fire Fighter Robot',
                'Human Following Robot',
                'Bluetooth Controlled Car',
                'Voice Controlled Car',
                'Smart Irrigation System',
                'Smart Parking System',
                'Radar System',
                'And many more real-world automation systems'
            ],

            skills: [
                'Hardware Programming',
                'Sensor Integration',
                'Robotics Logic Building',
                'Motor & Servo Control',
                'Automation System Design',
                'Problem Solving & Debugging',
                'Autonomous Robot Development'
            ],

            sessionsTopic: [
                '1 Display 0 to 9',
                '2 Smart Dustbin',
                '3 Scroll Display',
                '4 Digital Scale/Distance meter',
                '5 ir object counter',
                '6 fire alarm',
                '7 DHT fan controller',
                '8 blind stick',
                '9 display name',
                '10 radar system',
                '11 irrigation system',
                '12 fire fighter bot',
                '13 smart lamp',
                '14 Servo control',
                '15 obstacle avoiding robot',
                '16 traffic light',
                '17 bluetooth car',
                '18 voice control car',
                '19 edge avoiding using ultrasonic',
                '20 human following',
                '21 line follower robot',
                '22 Maze solving',
                '23 Smart parking'
            ]
        },
        Coding: {
                title: 'Python Programming',
                sessions: '12 Sessions',
                projectsCount: '6+ Real-World Applications',
                assessment: 'Module-wise Assessments',

                whatWillYouLearn: [
                    'Object-Oriented Programming (OOP) in depth',
                    'Writing clean, modular, reusable code',
                    'File handling (CSV, JSON)',
                    'Working with REST APIs',
                    'API integration and consumer applications',
                    'Debugging and unit testing techniques',
                    'Building real-world Python applications'
                ],

                description: 'This course focuses on mastering Object-Oriented Programming in Python and applying it to real-world applications. Students will learn how to design scalable applications using classes and objects, work with files and APIs, debug eAiciently, and build complete data-driven systems. The structure follows a practical approach: concept → implementation → real-world application.',

                duration: '8 Weeks Intensive Program',

                curriculum: [
                    'Module 1: Object-Oriented Programming Foundations (Classes, Objects, Attributes, Methods)',
                    'Module 2: Advanced OOP Concepts (Inheritance, Polymorphism, Encapsulation)',
                    'Module 3: Practical OOP Implementation (Class Implementation, OOP Projects)',
                    'Module 4: File Handling & Data Management (Reading/Writing Files, File Formats – CSV, JSON, File Operations)',
                    'Module 5: APIs & Web Integration (HTTP Requests, REST APIs, JSON Parsing, API Integration)',
                    'Module 6: Testing & Application Development (Unit Testing, Debugging Techniques, PDB, Data Processing Application, API Consumer Application, Final Project)'
                ],

                projects: [
                    'OOP-Based Management System',
                    'CSV/JSON Data Processor',
                    'REST API Integration Tool',
                    'API Consumer Application',
                    'Data Processing Application',
                    'Final Capstone Project'
                ],

                skills: [
                    'Object-Oriented Design',
                    'Clean Code Architecture',
                    'API Integration',
                    'Data Processing',
                    'Debugging and Testing',
                    'Real-World Application Development'
                ]
            },
        AI: {
                title: 'Artificial Intelligence (AI)',
                sessions: '16 Sessions',
                projectsCount: '8+ Hands-On Projects',
                assessment: 'Module-wise Assessments',

                whatWillYouLearn: [
                    'Fundamentals of Artificial Intelligence',
                    'Machine Learning concepts and workflows',
                    'Data handling and preprocessing',
                    'Mathematical foundations for AI',
                    'Ethical considerations in AI',
                    'Algorithm design for intelligent systems',
                    'Computer Vision application development',
                    'Building real-world AI projects'
                ],

                description: 'This course builds a strong foundation in Artificial Intelligence by combining theory with practical implementation. Students will understand how AI systems are designed, how machine learning models are trained, and how mathematical concepts support intelligent decision-making. The program progresses from core AI principles to applied computer vision projects such as face recognition and object detection. The structure follows a practical pathway: concept understanding → algorithm logic → model implementation → real-world deployment.',

                duration: '10–12 Weeks Intensive Program',

                curriculum: [
                    'Module 1: AI Foundations (Introduction to AI and Advanced Coding Concepts, Data and its Importance in AI, Ethical Considerations in AI)',
                    'Module 2: Machine Learning Core (Introduction to Machine Learning, Deepening Machine Learning Understanding, Introduction to Algorithms in AI)',
                    'Module 3: Mathematical & Data Science Foundations (Mathematical Foundations for AI, Data Science Skills for AI)',
                    'Module 4: AI Model Development (Dog vs Cat Classifier, Fingers Count System)',
                    'Module 5: Computer Vision Applications (Virtual Keyboard, Virtual Quiz, Virtual Calculator, Shape Detection)',
                    'Module 6: Advanced AI Projects (Face Recognition, Object Detection)'
                ],

                projects: [
                    'Dog vs Cat Image Classifier',
                    'Real-Time Finger Counting System',
                    'Virtual Keyboard',
                    'Virtual Quiz Application',
                    'Virtual Calculator',
                    'Shape Detection System',
                    'Face Recognition System',
                    'Object Detection Model'
                ],

                skills: [
                    'AI System Design',
                    'Machine Learning Fundamentals',
                    'Data Processing',
                    'Algorithm Development',
                    'Computer Vision',
                    'Model Evaluation',
                    'Real-World AI Implementation'
                ]
            },
        WebDev: {
            title: 'Web Development',
            sessions: '14 Sessions',
            projectsCount: '5+ Real-World Projects',
            assessment: 'Module-wise Assessments',

            whatWillYouLearn: [
                'Building structured websites using HTML',
                'Styling modern interfaces using CSS',
                'Responsive layout design',
                'JavaScript fundamentals for interactivity',
                'Combining HTML, CSS, and JavaScript',
                'Version control using Git',
                'Hosting and deploying live projects'
            ],

            description: 'This course provides a complete foundation in modern web development. Students will learn how to structure web pages, design responsive layouts, and build interactive applications using HTML, CSS, and JavaScript. The program focuses on practical implementation, guiding learners from creating static web pages to building fully functional projects such as portfolios and To-Do applications. The learning path follows structure → styling → interactivity → integration → deployment.',

            duration: '8–10 Weeks Practical Program',

            curriculum: [
                'Module 1: HTML Foundations (Structure, Tags, Headings, Links, Lists, Tables, Forms, Build Contact Form)',
                'Module 2: CSS Styling & Layout (Selectors, Colors, Fonts, Box Model, Style Webpage, Flexbox, Positioning, Responsive Layout)',
                'Module 3: JavaScript Fundamentals (Variables, Functions, Events, Button Interaction)',
                'Module 4: Full Integration & Project Development (Combine HTML, CSS, JS, Build Portfolio or To-Do App)',
                'Module 5: Version Control & Deployment (Git, Hosting, Deploy Project)'
            ],

            projects: [
                'Personal Webpage',
                'Contact Form',
                'Responsive Website',
                'Portfolio Website',
                'To-Do Application',
                'Fully Deployed Live Project'
            ],

            skills: [
                'HTML Page Structuring',
                'CSS Layout & Responsive Design',
                'JavaScript Interactivity',
                'Frontend Integration',
                'Git & Version Control',
                'Project Deployment and Hosting'
            ]
        },
        Games: {
            title: 'Game Development',
            sessions: '18 Sessions',
            projectsCount: '15+ Playable Games',
            assessment: 'Module-wise Assessments',

            whatWillYouLearn: [
                'Python fundamentals for basic game logic',
                'Transition from software games to hardware-based games',
                'ESP32 programming and GPIO control',
                'Working with buttons, buzzers, displays, and sensors',
                'Game logic implementation on microcontrollers',
                'Real-time input handling and embedded system design',
                'Building interactive hardware-based arcade games'
            ],

            description: 'This course begins with Python fundamentals to build a strong base in programming and game logic. After the foundation session, students transition to hardware-based game development using the ESP32 microcontroller. Learners will design interactive physical games using buttons, buzzers, LEDs, displays, and sensors. The focus is on implementing real-time game logic on embedded systems. The progression follows: programming basics → game logic → ESP32 fundamentals → hardware integration → interactive embedded games.',

            duration: '8–10 Weeks Practical Program',

            curriculum: [
                'Module 1: Programming Foundation (Session 1: Introduction to Python)',
                'Module 2: ESP32 Fundamentals (ESP32 Setup, GPIO Control, Buttons, LEDs, Buzzers, Displays)',
                'Module 3: Basic Hardware Games (Balloon Pop Game, Snake Game, Pong Game, Rock Paper Scissors)',
                'Module 4: Logic & Memory-Based Games (Simon Memory Game, Tic Tac Toe Game, Reaction Time Button Game)',
                'Module 5: Motion & Controller-Based Games (Maze Controller, Tilt Car Racing, Soccer Game, Soccer Goal Protector)',
                'Module 6: Advanced Embedded Arcade Games (Floppy Bird Game, Star War Game, Shooting Game, Buzz Wire Game, Musical Piano)'
            ],

            projects: [
                'Hardware-Based Snake Game',
                'ESP32 Pong Game',
                'Simon Memory Game with LEDs & Buzzer',
                'Reaction Time Button Game',
                'Maze Controller Game',
                'Tilt Car Racing Game',
                'Shooting Game with Buttons',
                'Buzz Wire Game',
                'Musical Piano using ESP32'
            ],

            skills: [
                'Embedded Programming',
                'Real-Time Input Handling',
                'Hardware Game Logic Design',
                'Sensor & Button Integration',
                'Display & Output Control',
                'Microcontroller-Based Game Development'
            ]
        },
        AppDev: {
            title: 'App Development (MIT App Inventor)',
            sessions: '23 Sessions',
            projectsCount: '15+ Mobile Applications',
            assessment: 'Module-wise Assessments',

            whatWillYouLearn: [
                'Mobile app development using MIT App Inventor',
                'User Interface (UI) and app design principles',
                'Event-driven programming and logic building',
                'Working with device features (GPS, sensors, speech, media)',
                'Data storage and real-time interaction',
                'Building utility, productivity, and interactive apps',
                'Structuring complete Android applications'
            ],

            description: 'This course provides a complete practical pathway to Android app development using MIT App Inventor. Students begin with interface design and event-driven logic, then progressively build real-world applications by integrating device components such as GPS, speech recognition, and storage systems. The program emphasizes hands-on development. Each session results in a functional application, helping learners understand how mobile apps are structured and deployed. The progression follows: design → logic → feature integration → complete application development.',

            duration: '8–10 Weeks Practical Program',

            curriculum: [
                'Module 1: App Development Foundations (Introduction to MIT App Inventor, User Interface & App Design Principles, Event-Driven Programming & Logic Building, Working with Device Features & Data Storage)',
                'Module 2: Utility Applications (BMI Calculator, Alarm Clock, BarCode Scanner, Browser App, Click Counter, Countdown Timer, Currency Converter, Dialer App, Simple Dictionary)',
                'Module 3: Sensor & Feature-Based Applications (Compass, GPS Location Tracker, SOS App, Speech to Text)',
                'Module 4: Interactive & Creative Applications (Coloring Book, Talking Tom, Magic 8 Ball, Snake Game, Tic Tac Toe Game)',
                'Module 5: Integrated Application Development (Own Social Media – Final Integrated Project)'
            ],

            projects: [
                'BMI Calculator',
                'Alarm Clock',
                'Barcode Scanner',
                'GPS Location Tracker',
                'SOS Emergency App',
                'Speech to Text Application',
                'Currency Converter',
                'Simple Dictionary',
                'Interactive Games (Snake, Tic Tac Toe, Magic 8 Ball)',
                'Mini Social Media Application'
            ],

            skills: [
                'Mobile UI/UX Design',
                'Event-Driven Logic Building',
                'Device Feature Integration',
                'Data Handling in Mobile Apps',
                'App Testing & Debugging',
                'Complete Android App Development'
            ]
        },
        IoT: {
            title: 'Internet of Things (IoT)',
            sessions: '23 Sessions',
            projectsCount: '15+ IoT-Based Implementations',
            assessment: 'Module-wise Assessments',

            whatWillYouLearn: [
                'Fundamentals of Internet of Things',
                'Working with IoT boards using Arduino IDE',
                'Sensor and actuator integration',
                'WiFi-based communication systems',
                'Cloud-connected automation projects',
                'Real-time monitoring systems',
                'Smart home and smart city applications'
            ],

            description: 'This course introduces students to connected devices and smart automation systems. Learners understand how IoT systems collect data, communicate over the internet, and automate real-world environments. The program emphasizes hands-on implementation using IoT boards, sensors, WiFi modules, and automation logic. Students build practical smart systems including home automation, smart parking, irrigation systems, and cloud-connected monitoring solutions. The learning path follows: IoT fundamentals → hardware integration → internet communication → smart automation systems.',

            duration: '8 Weeks Practical Program',

            curriculum: [
                'Module 1: IoT Foundations (Introduction to IoT, IoT Board with Arduino IDE, Know Your Components)',
                'Module 2: IoT Sensor-Based Systems (Digital Scale, Fire Alarm, Rain Detector, Smoke Detection, Temperature Monitoring, Water Level Indicator)',
                'Module 3: IoT Automation & Control (Multi Servo Control, Home Automation, Irrigation System, Smart Door Lock, Smart Dustbin)',
                'Module 4: Smart Infrastructure Projects (Smart Parking System, IoT Traffic Light System, Internet Clock, IoT Notice Board)',
                'Module 5: Advanced IoT Applications (WiFi Controlled Car, Virtual Assistant Based Home Automation)'
            ],

            projects: [
                'IoT-Based Fire Alarm',
                'Smart Home Automation System',
                'IoT Irrigation System',
                'WiFi Controlled Car',
                'Smart Parking System',
                'IoT Door Lock System',
                'Temperature Monitoring System',
                'IoT Notice Board'
            ],

            skills: [
                'IoT Architecture Understanding',
                'Sensor & Actuator Integration',
                'Wireless Communication',
                'Automation Logic Design',
                'Cloud-Based Monitoring',
                'Real-World Smart System Development'
            ]
        },
        Scratch: {
            title: 'Scratch Programming',
            sessions: '24 Sessions',
            projectsCount: '10+ Interactive Projects',
            assessment: 'Module-wise Assessments',

            whatWillYouLearn: [
                'Basics of visual programming using Scratch',
                'Creating animations and interactive stories',
                'Understanding events, loops, and logic',
                'Using sprites, stages, and broadcast communication',
                'Building simple games with keyboard controls',
                'Working with variables, timers, and score systems',
                'Designing and presenting complete Scratch projects'
            ],

            description: 'This course introduces students to programming through Scratch, a visual block-based platform designed for beginners. Learners understand programming logic by building animations, interactive stories, and simple games. The program focuses on creativity and logical thinking while gradually introducing events, loops, variables, and debugging. Students design their own interactive applications and present a final game project. The progression follows: interface basics → animation → interaction → game logic → project development.',

            duration: '8 Weeks Practical Program',

            curriculum: [
                'Module 1: Scratch Foundations (Introduction to Scratch Interface, Creating & Saving Projects, Basic Motion Blocks, Looks & Sound Blocks, Using Stage & Sprites)',
                'Module 2: Animation & Interaction (Simple Animations, Events & Control Blocks, Interactive Stories, Broadcast & Sensing Blocks)',
                'Module 3: Game Development Basics (Keyboard-Controlled Games, Timers, Operators & Variables, Score Counters, Basic Game Logic)',
                'Module 4: Project Development (Project Planning, Building a Mini Game, Debugging & Testing)',
                'Module 5: Game Design & Enhancement (Improving Game Design, Adding Sounds & Effects, Background Music, Custom Sprites)',
                'Module 6: Project Publishing (Sharing Projects Online, Final Project Presentation)'
            ],

            projects: [
                'Interactive Animated Story',
                'Keyboard-Controlled Game',
                'Score-Based Arcade Game',
                'Timer-Based Challenge Game',
                'Sound-Enhanced Interactive Project',
                'Final Mini Game Project'
            ],

            skills: [
                'Visual Programming Concepts',
                'Animation Design',
                'Event-Based Logic',
                'Game Logic Development',
                'Creative Problem Solving',
                'Project Design & Presentation'
            ]
        },
        Electronics: {
            title: 'Electronics',
            sessions: '16 Sessions',
            projectsCount: '15 Practical Projects',
            assessment: 'Module-wise Assessments',

            whatWillYouLearn: [
                'Fundamentals of electronic components and circuits',
                'Understanding voltage, current, and power flow',
                'Building circuits using LEDs, resistors, capacitors, and transistors',
                'Series and parallel circuit configurations',
                'Motor control and timing circuits',
                'Sensor-based automatic control systems',
                'Practical circuit assembly and troubleshooting'
            ],

            description: 'This course introduces the fundamentals of electronics through hands-on circuit building and experimentation. Students learn how electronic components work together to form functional systems. The program emphasizes practical implementation by building working circuits using LEDs, switches, motors, capacitors, and transistors. Learners also explore automation systems such as street light control and touch-based switching. The progression follows: component understanding → basic circuits → switching and control → timing circuits → mini electronic systems.',

            duration: '6 Weeks Practical Program',

            curriculum: [
                'Module 1: Basic Electronic Components (Know Your Component, DIY Torch, Laser Pointer, LED Pencil Light)',
                'Module 2: Circuit Fundamentals (Parallel Connection – Same Color, Parallel Connection – Different Color, Series Connection)',
                'Module 3: Control & Switching Circuits (Sound Buzzer, Transistor as Touch Switch, Simple Touch Switch)',
                'Module 4: Automation & Motor Control (Automatic Street Light Control, DC Motor Speed Control)',
                'Module 5: Timing & Capacitor Circuits (Timer Delay, Capacitor Charging & Discharging Circuit)',
                'Module 6: Creative Electronic Projects (Musical Bell, Firefly LED Effect)'
            ],

            projects: [
                'DIY Torch',
                'Laser Pointer Circuit',
                'Automatic Street Light System',
                'Touch Switch Circuit',
                'DC Motor Speed Controller',
                'Capacitor Charging and Discharging Circuit',
                'Musical Bell Circuit',
                'Firefly LED Effect'
            ],

            skills: [
                'Circuit Design Fundamentals',
                'Component Identification',
                'Series and Parallel Circuit Design',
                'Motor and LED Control',
                'Basic Electronic Troubleshooting',
                'Practical Electronics Prototyping'
            ]
        }
    };

    function openCourseModal(courseKey) {
        const course = courseDetails[courseKey];
        if (!course) return;

        const modal = document.getElementById('courseModal');
        if (!modal) return;

        document.getElementById('modalTitle').textContent = course.title;
        document.getElementById('modalSessions').textContent = course.sessions;
        document.getElementById('modalProjectsCount').textContent = course.projectsCount;
        document.getElementById('modalAssessment').textContent = course.assessment;
        document.getElementById('modalDescription').textContent = course.description;
        document.getElementById('modalDuration').textContent = course.duration;

        populateList('modalLearn', course.whatWillYouLearn);
        populateList('modalCurriculum', course.curriculum);
        populateList('modalProjects', course.projects);
        populateList('modalSkills', course.skills);

        modal.classList.remove('closing');
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
        
        document.body.classList.add('modal-open');
    }

    function populateList(elementId, dataArray) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';

        if (!dataArray || !dataArray.length) return;

        const fragment = document.createDocumentFragment();
        dataArray.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            fragment.appendChild(li);
        });
        container.appendChild(fragment);
    }

    let modalCloseTimer = null;

    function closeModal() {
        const modal = document.getElementById('courseModal');
        if (!modal) return;

        if (!modal.classList.contains('show') || modal.classList.contains('closing')) return;

        modal.classList.remove('show');
        modal.classList.add('closing');

        if (modalCloseTimer) clearTimeout(modalCloseTimer);

        modalCloseTimer = setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            modalCloseTimer = null;
        }, MODAL_CLOSE_MS);
    }

    function setupModalHandlers() {
        const modal = document.getElementById('courseModal');
        if (!modal) return;

        // Event delegation for know-more buttons
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.know-more');
            if (button) {
                e.preventDefault();
                const courseKey = button.getAttribute('data-course');
                if (courseKey && courseDetails[courseKey]) {
                    openCourseModal(courseKey);
                }
            }
        });

        const closeBtn = modal.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }

    function initializeHeroBackground() {
        const container = document.getElementById('heroBackgroundAnimation');
        if (!container || container.children.length > 0) return;

        // Use requestIdleCallback to defer heavy DOM operations
        const createHeroSVG = () => {
            container.innerHTML = `
            <svg class="hero-scene" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                    <linearGradient id="heroSky" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#002a52"></stop>
                        <stop offset="55%" stop-color="#0a4a85"></stop>
                        <stop offset="100%" stop-color="#1a6cb0"></stop>
                    </linearGradient>
                    <radialGradient id="heroSun" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stop-color="#ffeaa6" stop-opacity="0.85"></stop>
                        <stop offset="100%" stop-color="#ffeaa6" stop-opacity="0"></stop>
                    </radialGradient>
                </defs>
                <rect width="1440" height="900" fill="url(#heroSky)"></rect>
                <g class="hero-clouds">
                    <ellipse class="hero-cloud hero-cloud-a" cx="220" cy="220" rx="170" ry="62"></ellipse>
                    <ellipse class="hero-cloud hero-cloud-b" cx="1240" cy="250" rx="210" ry="70"></ellipse>
                    <ellipse class="hero-cloud hero-cloud-c" cx="820" cy="160" rx="140" ry="52"></ellipse>
                </g>
                <g class="hero-floating-icons">
                    <text class="hero-icon hero-icon-a" x="160" y="190">{ }</text>
                    <text class="hero-icon hero-icon-b" x="1060" y="300">&lt;/&gt;</text>
                    <text class="hero-icon hero-icon-c" x="560" y="120">AI</text>
                </g>
                <path class="hero-hill-back" d="M0 640 C220 570, 520 700, 760 620 C980 545, 1210 650, 1440 600 L1440 900 L0 900 Z"></path>
                <path class="hero-hill-front" d="M0 700 C260 620, 520 760, 760 700 C980 650, 1200 760, 1440 710 L1440 900 L0 900 Z"></path>
                <g class="hero-gear-system">
                    <g class="hero-gear hero-gear-a" transform="translate(260 665)">
                        <circle r="44"></circle>
                        <line x1="-44" y1="0" x2="44" y2="0"></line>
                        <line x1="0" y1="-44" x2="0" y2="44"></line>
                        <line x1="-31" y1="-31" x2="31" y2="31"></line>
                        <line x1="-31" y1="31" x2="31" y2="-31"></line>
                        <circle class="hero-gear-center" r="12"></circle>
                    </g>
                    <g class="hero-gear hero-gear-b" transform="translate(350 724)">
                        <circle r="30"></circle>
                        <line x1="-30" y1="0" x2="30" y2="0"></line>
                        <line x1="0" y1="-30" x2="0" y2="30"></line>
                        <line x1="-21" y1="-21" x2="21" y2="21"></line>
                        <line x1="-21" y1="21" x2="21" y2="-21"></line>
                        <circle class="hero-gear-center" r="8"></circle>
                    </g>
                </g>
                <g class="hero-play-scene">
                    <g class="hero-kid hero-kid-coder" transform="translate(446 652)">
                        <circle class="kid-head" cx="0" cy="-82" r="26"></circle>
                        <rect class="kid-body kid-body-coder" x="-20" y="-48" width="40" height="64" rx="19"></rect>
                        <line class="kid-leg" x1="-8" y1="16" x2="-14" y2="72"></line>
                        <line class="kid-leg" x1="8" y1="16" x2="16" y2="72"></line>
                        <line class="kid-arm" x1="-20" y1="-18" x2="-50" y2="-30"></line>
                        <line class="kid-arm" x1="20" y1="-18" x2="46" y2="-8"></line>
                    </g>
                    <g class="hero-kid hero-kid-left" transform="translate(520 645)">
                        <circle class="kid-head" cx="0" cy="-86" r="30"></circle>
                        <rect class="kid-body kid-body-left" x="-24" y="-52" width="48" height="70" rx="22"></rect>
                        <line class="kid-leg" x1="-11" y1="18" x2="-22" y2="78"></line>
                        <line class="kid-leg" x1="11" y1="18" x2="24" y2="78"></line>
                        <line class="kid-arm" x1="-24" y1="-18" x2="-56" y2="8"></line>
                        <g class="kid-arm-wave">
                            <line class="kid-arm" x1="24" y1="-18" x2="60" y2="-58"></line>
                        </g>
                    </g>
                    <g class="hero-kid hero-kid-right" transform="translate(940 650)">
                        <circle class="kid-head" cx="0" cy="-84" r="28"></circle>
                        <rect class="kid-body kid-body-right" x="-22" y="-50" width="44" height="66" rx="20"></rect>
                        <line class="kid-leg" x1="-10" y1="16" x2="-24" y2="76"></line>
                        <line class="kid-leg" x1="10" y1="16" x2="20" y2="76"></line>
                    </g>
                    <g class="hero-robot" transform="translate(735 642)">
                        <rect class="robot-body" x="-56" y="-78" width="112" height="128" rx="24"></rect>
                        <rect class="robot-face" x="-40" y="-56" width="80" height="48" rx="12"></rect>
                        <circle class="robot-eye robot-eye-left" cx="-16" cy="-33" r="6"></circle>
                        <circle class="robot-eye robot-eye-right" cx="16" cy="-33" r="6"></circle>
                        <rect class="robot-mouth" x="-16" y="-18" width="32" height="6" rx="3"></rect>
                        <line class="robot-antenna" x1="0" y1="-78" x2="0" y2="-102"></line>
                        <circle class="robot-signal" cx="0" cy="-110" r="8"></circle>
                    </g>
                </g>
            </svg>
        `;
        };

        // Use requestIdleCallback for non-blocking initialization
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => createHeroSVG(), { timeout: 2000 });
        } else {
            setTimeout(createHeroSVG, 100);
        }
    }

    function loadLottieAnimations() {
        const containers = document.querySelectorAll('[data-lottie]');
        if (!containers.length) return;
        
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        const tryLoadLottie = () => {
            if (typeof lottie === 'undefined') {
                console.warn('Lottie library not loaded, retrying...');
                setTimeout(tryLoadLottie, 100);
                return;
            }

            const loadLottieOnVisible = (container) => {
                if (container.dataset.loaded === 'true') return;
                
                const jsonPath = container.dataset.lottie;
                if (!jsonPath) return;

                container.dataset.loaded = 'true';
                
                try {
                    lottie.loadAnimation({
                        container: container,
                        renderer: 'svg',
                        loop: true,
                        autoplay: !prefersReducedMotion,
                        path: jsonPath,
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                    });
                } catch (error) {
                    console.error(`Failed to load Lottie: ${jsonPath}`, error);
                    container.dataset.loaded = 'false';
                }
            };

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadLottieOnVisible(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { rootMargin: '100px', threshold: 0.1 });

                containers.forEach(container => observer.observe(container));
            } else {
                containers.forEach(container => loadLottieOnVisible(container));
            }
        };
        
        tryLoadLottie();
    }

    function setupReelsHandlers() {
        const reelsContainer = document.querySelector('.reels-container');
        
        if (!reelsContainer) return;

        const videos = Array.from(reelsContainer.querySelectorAll('.reel-bg'));
        let hasDragged = false;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartScrollLeft = 0;

        const syncPausedState = (video) => {
            const card = video.closest('.reel-card');
            if (!card) return;
            card.classList.toggle('is-paused', video.paused);
        };

        const playWithSound = (video) => {
            if (!video) return;

            videos.forEach((otherVideo) => {
                if (otherVideo !== video) {
                    otherVideo.pause();
                    otherVideo.muted = true;
                }
            });

            video.muted = false;
            video.volume = 1;

            const playAttempt = video.play();
            if (playAttempt && typeof playAttempt.catch === 'function') {
                playAttempt.catch(() => {
                    syncPausedState(video);
                });
            }
        };

        videos.forEach((video) => {
            const card = video.closest('.reel-card');

            video.loop = true;
            video.playsInline = true;
            video.preload = 'metadata';
            video.muted = true;
            video.pause();

            video.addEventListener('error', () => {
                if (card) card.style.display = 'none';
            }, { once: true });

            video.addEventListener('play', () => syncPausedState(video));
            video.addEventListener('pause', () => syncPausedState(video));
            syncPausedState(video);
        });

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (!entry.isIntersecting) {
                        video.pause();
                    }
                });
            }, {
                root: reelsContainer,
                threshold: 0.5
            });

            videos.forEach((video) => observer.observe(video));
        }

        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false;
            reelsContainer.classList.remove('dragging');
        };

        reelsContainer.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;

            isDragging = true;
            hasDragged = false;
            dragStartX = e.clientX;
            dragStartScrollLeft = reelsContainer.scrollLeft;
            reelsContainer.classList.add('dragging');
        });

        reelsContainer.addEventListener('pointermove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - dragStartX;
            if (Math.abs(deltaX) > 6) {
                hasDragged = true;
            }

            reelsContainer.scrollLeft = dragStartScrollLeft - deltaX;

            if (hasDragged) {
                e.preventDefault();
            }
        });

        reelsContainer.addEventListener('pointerup', stopDragging);
        reelsContainer.addEventListener('pointercancel', stopDragging);
        reelsContainer.addEventListener('pointerleave', (e) => {
            if (e.pointerType === 'mouse') {
                stopDragging();
            }
        });

        reelsContainer.addEventListener('click', (e) => {
            if (hasDragged) {
                hasDragged = false;
                return;
            }

            const reelCard = e.target.closest('.reel-card');
            if (!reelCard) return;

            const video = reelCard.querySelector('.reel-bg');
            if (!video) return;

            const playButton = e.target.closest('.play-btn-circle');

            if (playButton) {
                if (video.paused) {
                    playWithSound(video);
                } else {
                    video.pause();
                }
                return;
            }

            if (!video.paused) {
                video.pause();
            }
        });
    }

    function initializeStoryTrack() {
        const track = document.querySelector('.story-track');
        if (!track || track.dataset.loopReady === 'true') return;

        // Lazy initialize using IntersectionObserver
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const items = Array.from(track.children);
                    if (items.length < 2) return;

                    items.forEach((item) => {
                        const clone = item.cloneNode(true);
                        clone.setAttribute('aria-hidden', 'true');
                        track.appendChild(clone);
                    });

                    track.dataset.loopReady = 'true';
                    observer.unobserve(track);
                }
            }, { threshold: 0.1, rootMargin: '100px' });

            observer.observe(track);
        } else {
            // Fallback
            const items = Array.from(track.children);
            if (items.length < 2) return;

            items.forEach((item) => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            });

            track.dataset.loopReady = 'true';
        }
    }

    function initializeSectionRevealAnimations() {
        const selectors = ['.courses-section .card', '.future-point'];
        const revealTargets = [];

        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element, index) => {
                element.classList.add('section-animate');
                element.style.setProperty('--reveal-order', String(index));
                revealTargets.push(element);
            });
        });

        if (!revealTargets.length) return;

        if (!('IntersectionObserver' in window)) {
            revealTargets.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        });

        revealTargets.forEach((element) => observer.observe(element));
    }

    function init() {
        if (window.self !== window.top) {
            window.top.location = window.self.location;
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        handleImageErrors();
        initializeHeroBackground();
        
        if (!prefersReducedMotion) {
            loadLottieAnimations();
        }
        
        setupModalHandlers();
        setupReelsHandlers();
        initializeStoryTrack();
        
        if (!prefersReducedMotion) {
            initializeSectionRevealAnimations();
        }
    }

    runOnDomReady(init);

    window.openCourseModal = openCourseModal;
    window.closeModal = closeModal;
})();
