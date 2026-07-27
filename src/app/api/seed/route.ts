import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const existingCourses = await db.course.count();
    if (existingCourses > 0) {
      return NextResponse.json({ message: 'Data already seeded', seeded: false });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const existingAdmin = await db.admin.findFirst();
    if (!existingAdmin) {
      await db.admin.create({
        data: { email: 'admin@lesothotechacademy.com', password: hashedPassword, name: 'Relebohile Joseph Mohono' },
      });
    }

    await db.course.createMany({
      data: [
        {
          title: 'Web Development Programming',
          slug: 'web-development-programming',
          description: 'Master the art of building modern, responsive websites and web applications using industry-standard technologies. This comprehensive 3-month course takes you from HTML and CSS fundamentals through advanced JavaScript frameworks, equipping you with the skills to create professional web solutions for businesses and individuals in Lesotho and beyond.',
          duration: '3 Months',
          durationMonths: 3,
          price: 2600,
          currency: 'M',
          category: 'Web Development',
          level: 'Beginner to Intermediate',
          image: '/logo.png',
          content: `# Web Development Programming

## Programme Overview

Our **Web Development Programming** course is an intensive 3-month programme designed to transform beginners into confident, job-ready web developers. The course covers the full spectrum of modern web development — from building responsive front-end interfaces to creating powerful back-end services and deploying complete applications to the web.

Whether you dream of building your own startup, freelancing for local businesses in Leribe, or joining a tech company, this course gives you the practical skills and portfolio projects to get there.

## Why Choose This Course?

- **Industry-Aligned Curriculum** — Our syllabus mirrors what employers demand in 2026: React, Node.js, modern JavaScript, and cloud deployment.
- **100% Hands-On** — You won't just watch tutorials. Every module includes real-world projects that go into your professional portfolio.
- **Online Classes Available** — Attend live online sessions from anywhere in Lesotho, with recorded lessons for revision.
- **Lesotho Context** — Projects are designed around real business needs in Maseru, Leribe, and other districts.
- **Affordable & Accessible** — Quality IT education should not be a luxury. We keep fees low without compromising excellence.

## Who Should Enrol?

- School leavers who want a career in technology
- University students looking to add practical coding skills
- Working professionals seeking a career change into IT
- Entrepreneurs who want to build and manage their own websites
- Anyone in Lesotho passionate about learning to code

## Career Opportunities

Graduates of this programme can work as:
- Front-End Developer
- Back-End Developer
- Full-Stack Web Developer
- Web Designer
- Freelance Web Developer
- JavaScript Developer
- WordPress/ CMS Developer`,
          objectives: JSON.stringify([
            'Build responsive, mobile-friendly websites using HTML5, CSS3, and modern layout techniques (Flexbox & Grid)',
            'Write clean, modern JavaScript (ES6+) including DOM manipulation, asynchronous programming, and API integration',
            'Develop interactive single-page applications using React.js with hooks, state management, and component architecture',
            'Create RESTful APIs and server-side applications using Node.js and Express framework',
            'Design and manage relational databases with SQLite, including CRUD operations and data modelling',
            'Implement user authentication and authorization systems with secure password handling',
            'Use Git version control and GitHub for collaborative development workflows',
            'Deploy web applications to cloud hosting platforms with proper domain and SSL configuration',
            'Understand web performance optimization, accessibility standards (WCAG), and SEO fundamentals',
            'Build a professional portfolio of 6+ completed web projects demonstrating full-stack capabilities'
          ]),
          modules: JSON.stringify([
            { name: 'Module 1: Foundations of Web Development', weeks: 3, description: 'Introduction to the web ecosystem, setting up your development environment, HTML5 semantic markup, CSS3 styling, responsive design principles, Flexbox and CSS Grid layouts, and building your first multi-page website.', topics: ['Web Architecture & How the Internet Works', 'HTML5 Elements, Forms & Semantic Markup', 'CSS3 Selectors, Box Model & Typography', 'Responsive Design & Media Queries', 'Flexbox Layout System', 'CSS Grid Layout System', 'Project: Personal Portfolio Website'] },
            { name: 'Module 2: JavaScript Essentials', weeks: 3, description: 'Deep dive into JavaScript programming from fundamentals to advanced concepts including ES6+ features, DOM manipulation, event handling, asynchronous programming with Promises and async/await, and error handling.', topics: ['Variables, Data Types & Operators', 'Functions, Scope & Closures', 'Arrays, Objects & Destructuring', 'DOM Selection & Manipulation', 'Event Handling & Delegation', 'ES6+ Features (Arrow Functions, Template Literals, Spread/Rest)', 'Asynchronous JavaScript: Promises, Async/Await, Fetch API', 'Project: Interactive Web Application'] },
            { name: 'Module 3: React.js & Modern Front-End', weeks: 4, description: 'Learn React.js from the ground up — components, props, state, hooks, routing, and building production-ready single-page applications with modern tooling.', topics: ['React Fundamentals: JSX, Components & Props', 'State Management with useState & useReducer', 'Side Effects with useEffect & Custom Hooks', 'React Router for Client-Side Navigation', 'Context API for Global State', 'Form Handling & Validation in React', 'Performance Optimization (memo, useMemo, useCallback)', 'Project: Full React SPA with Multiple Pages'] },
            { name: 'Module 4: Back-End Development with Node.js', weeks: 3, description: 'Build server-side applications using Node.js and Express. Learn to create RESTful APIs, handle authentication, manage file uploads, and connect front-end to back-end.', topics: ['Node.js Runtime & Module System', 'Express.js Framework & Middleware', 'Building RESTful API Endpoints', 'Request Validation & Error Handling', 'User Authentication with JWT', 'File Upload & Static File Serving', 'Environment Configuration & Security Best Practices', 'Project: Complete REST API with Authentication'] },
            { name: 'Module 5: Database Design & Integration', weeks: 2, description: 'Learn relational database design, SQL queries, and how to integrate databases into your full-stack applications using Prisma ORM.', topics: ['Database Fundamentals & SQL Basics', 'Database Design & Normalization', 'CRUD Operations with SQLite', 'Introduction to Prisma ORM', 'Schema Definition & Migrations', 'Connecting React Front-End to Node.js Back-End', 'Project: Full-Stack CRUD Application'] },
            { name: 'Module 6: Deployment, Testing & Portfolio', weeks: 3, description: 'Learn to deploy applications to the cloud, write basic tests, use Git professionally, and compile your best work into an impressive portfolio.', topics: ['Git & GitHub: Branching, Pull Requests, Collaboration', 'Environment Variables & Configuration Management', 'Deploying to Cloud Platforms (Vercel, Netlify, Railway)', 'Domain Names, DNS & SSL Certificates', 'Basic Testing with Jest', 'Web Performance & Lighthouse Audits', 'SEO Fundamentals & Meta Tags', 'Capstone Project: Deploy a Full-Stack Application'] }
          ]),
          isPublished: true,
        },
        {
          title: 'Computer Networks',
          slug: 'computer-networks',
          description: 'Gain comprehensive knowledge of computer networking fundamentals, advanced infrastructure design, and network security. This 6-month course prepares you for careers in network administration, IT support, and systems engineering. Learn to design, implement, troubleshoot, and secure enterprise-level networks critical for modern businesses.',
          duration: '6 Months',
          durationMonths: 6,
          price: 3500,
          currency: 'M',
          category: 'Networking',
          level: 'Beginner to Advanced',
          image: '/logo.png',
          content: `# Computer Networks

## Programme Overview

Our **Computer Networks** programme is a comprehensive 6-month journey into the world of networking — the backbone of every organisation's IT infrastructure. From understanding how data travels across the internet to designing secure enterprise networks, this course gives you the knowledge and hands-on skills that employers in Lesotho and across Africa desperately need.

In an increasingly connected world, businesses, government offices, schools, and hospitals all rely on robust networks. This programme ensures you can design, build, secure, and maintain those networks professionally.

## Why Choose This Course?

- **Comprehensive Coverage** — From basic networking concepts to advanced enterprise-level skills, this course leaves no gap in your knowledge.
- **Certification Aligned** — Curriculum aligns with CompTIA Network+ and Cisco CCNA industry certifications, giving you a competitive edge.
- **Lab-Based Learning** — Hands-on labs using network simulators and real equipment build practical competence.
- **Security-First Approach** — Network security is woven into every module, not treated as an afterthought.
- **Industry Demand** — Network professionals are among the most sought-after IT specialists globally.

## Who Should Enrol?

- IT support staff wanting to advance into network administration
- School leavers pursuing a career in IT infrastructure
- University students needing practical networking skills alongside theory
- Business owners who want to understand and manage their own networks
- Anyone interested in how the internet and computer networks work

## Career Opportunities

Graduates can work as:
- Network Administrator
- Network Engineer
- IT Support Specialist
- Systems Administrator
- Network Security Specialist
- Cloud Network Engineer
- Wi-Fi/ Wireless Engineer`,
          objectives: JSON.stringify([
            'Understand the OSI and TCP/IP networking models and how data flows through network layers',
            'Configure IPv4 and IPv6 addressing, perform subnetting, and design efficient IP addressing schemes using VLSM and CIDR',
            'Install, configure, and manage routers and switches including VLANs, trunking, STP, and inter-VLAN routing',
            'Design and implement wireless networks with proper security protocols (WPA2/WPA3) and access point management',
            'Implement network security measures including firewalls, VPNs, intrusion detection/prevention systems, and encryption',
            'Troubleshoot common network issues using diagnostic tools (ping, traceroute, Wireshark, netstat) and systematic methodologies',
            'Understand DNS, DHCP, HTTP/HTTPS, FTP, and other essential network services and protocols',
            'Grasp cloud networking concepts, virtualization basics, and hybrid/ multi-cloud architectures',
            'Prepare for CompTIA Network+ and Cisco CCNA certification examinations',
            'Complete 8+ hands-on networking lab projects including a capstone enterprise network design'
          ]),
          modules: JSON.stringify([
            { name: 'Module 1: Networking Fundamentals', weeks: 3, description: 'Build a solid foundation in networking concepts. Learn the OSI model, TCP/IP stack, common network topologies, transmission media, and the basic principles that govern all network communication.', topics: ['What is a Network? Types & Classifications', 'The OSI Model: 7 Layers Explained', 'TCP/IP Protocol Suite & Layer Functions', 'Network Topologies: Star, Bus, Ring, Mesh, Hybrid', 'Transmission Media: Copper, Fibre, Wireless', 'Basic Network Devices: Hubs, Switches, Routers', 'Project: Draw & Explain a Home Network Diagram'] },
            { name: 'Module 2: IP Addressing & Subnetting', weeks: 4, description: 'Master IP addressing — the language of networks. Learn IPv4 classes, subnet masks, VLSM, CIDR notation, and IPv6 fundamentals. Design IP schemes for organisations of different sizes.', topics: ['IPv4 Address Classes (A, B, C, D, E)', 'Subnet Masks & Network/Broadcast Addresses', 'Subnetting: Dividing Networks Efficiently', 'Variable Length Subnet Masking (VLSM)', 'CIDR Notation & Route Summarization', 'IPv6 Addressing Format & Transition Methods', 'Subnetting Practice Labs', 'Project: Design an IP Addressing Scheme for a School'] },
            { name: 'Module 3: Routing & Switching', weeks: 5, description: 'Deep dive into how data is directed across networks. Configure routers and switches, implement static and dynamic routing protocols, set up VLANs, and manage inter-VLAN communication.', topics: ['Router Configuration Basics (CLI, Interfaces)', 'Static Routing & Default Routes', 'Dynamic Routing: RIP, OSPF Fundamentals', 'Switch Configuration & Port Security', 'VLANs: Creating, Assigning & Management', 'Trunking: 802.1Q & Inter-VLAN Routing', 'Spanning Tree Protocol (STP)', 'Project: Configure a Multi-VLAN Network with Routing'] },
            { name: 'Module 4: Wireless Networking', weeks: 3, description: 'Learn the principles and practice of wireless networking. Understand WiFi standards, radio frequency basics, access point configuration, and wireless security protocols used in homes and enterprises.', topics: ['Wireless Standards: 802.11a/b/g/n/ac/ax (WiFi 6/6E)', 'Radio Frequency Basics & Signal Propagation', 'Access Point Configuration & Placement', 'Wireless Security: WEP, WPA, WPA2, WPA3', 'Enterprise Wireless: RADIUS & 802.1X', 'Wireless Troubleshooting Tools & Techniques', 'Project: Design & Configure a Wireless Network for an Office'] },
            { name: 'Module 5: Network Security', weeks: 5, description: 'Security is not optional — it is essential. Learn firewalls, VPNs, intrusion detection systems, encryption, access control lists, and how to build a defence-in-depth security strategy for any organisation.', topics: ['Network Security Fundamentals & Threat Landscape', 'Firewalls: Types, Configuration & Best Practices', 'Virtual Private Networks (VPNs) & Tunnelling', 'Intrusion Detection & Prevention Systems (IDS/IPS)', 'Encryption: Symmetric, Asymmetric, PKI', 'Access Control Lists (ACLs) on Routers', 'Security Policies & Compliance Basics', 'Project: Implement a Secured Network with Firewall & VPN'] },
            { name: 'Module 6: Network Services & Protocols', weeks: 3, description: 'Understand the key services that run on networks: DNS for name resolution, DHCP for automatic address configuration, HTTP/HTTPS for the web, and other essential protocols that keep networks functional.', topics: ['DNS: How Domain Names Are Resolved', 'DNS Records: A, AAAA, CNAME, MX, TXT, NS', 'DHCP: Automatic IP Address Assignment', 'HTTP & HTTPS: The Web Protocol', 'FTP, SSH, Telnet, SMTP, POP3/IMAP', 'Directory Services (LDAP, Active Directory Basics)', 'Project: Configure DNS & DHCP Services'] },
            { name: 'Module 7: Cloud & Virtual Networking', weeks: 3, description: 'The future of networking is in the cloud. Learn virtualization concepts, Software-Defined Networking (SDN), cloud networking models (AWS, Azure), and container networking with Docker.', topics: ['Virtualization Concepts: VMs, Hypervisors', 'Network Virtualization & SDN Basics', 'Cloud Networking: AWS VPC, Azure VNet', 'Containers & Docker Networking', 'Hybrid Cloud & Multi-Cloud Architectures', 'Network Automation & Infrastructure as Code', 'Project: Design a Hybrid Cloud Network Architecture'] },
            { name: 'Module 8: Troubleshooting & Certification Prep', weeks: 4, description: 'Develop systematic troubleshooting skills and prepare for industry certifications. Learn to diagnose and resolve network problems efficiently, and practise exam-style questions for CompTIA Network+ and CCNA.', topics: ['Network Troubleshooting Methodology', 'Diagnostic Tools: ping, traceroute, nslookup, netstat', 'Packet Analysis with Wireshark', 'Common Issues: Connectivity, Performance, Security', 'CompTIA Network+ Exam Preparation', 'Cisco CCNA Exam Preparation', 'Capstone Project: Enterprise Network Design & Implementation'] }
          ]),
          isPublished: true,
        },
        {
          title: 'Content Management System Development and Customization',
          slug: 'cms-development-customization',
          description: 'Learn to build, customize, and manage professional content management systems that power modern websites. This 6-month course covers popular CMS platforms like WordPress, alongside custom CMS development using modern frameworks. Gain the expertise to create tailored digital solutions for businesses, government agencies, and organisations across Lesotho.',
          duration: '6 Months',
          durationMonths: 6,
          price: 4000,
          currency: 'M',
          category: 'CMS Development',
          level: 'Intermediate',
          image: '/logo.png',
          content: `# Content Management System Development and Customization

## Programme Overview

Our **Content Management System (CMS) Development and Customization** programme is a comprehensive 6-month deep-dive into the world of content management — the technology that powers over 40% of all websites on the internet. From WordPress (the world's most popular CMS) to building custom headless CMS solutions, this course covers every aspect of professional CMS work.

Organisations in Lesotho — from government ministries to small businesses — need websites that are easy to manage, update, and scale. This programme teaches you to build exactly that.

## Why Choose This Course?

- **WordPress Mastery** — WordPress powers 43% of the web. Master it inside-out, from installation to custom theme and plugin development.
- **Beyond WordPress** — Learn headless CMS architecture and build custom CMS solutions using Next.js, giving you skills that set you apart.
- **Business Ready** — Every project simulates real client work, so you graduate with a portfolio of professional CMS solutions.
- **E-Commerce Skills** — WooCommerce integration means you can build online shops for Lesotho businesses.
- **SEO & Performance** — Every website you build will be fast, search-engine friendly, and accessible.

## Who Should Enrol?

- Web developers wanting to specialise in CMS solutions
- Business owners who want to build and manage their own professional websites
- IT professionals tasked with managing organisational websites
- Designers who want to turn their designs into functional CMS themes
- Anyone who wants to start a web design/development business in Lesotho

## Career Opportunities

Graduates can work as:
- CMS Developer / Specialist
- WordPress Developer
- Web Designer / Theme Developer
- Plugin Developer
- E-Commerce Developer (WooCommerce)
- Headless CMS Engineer
- Digital Marketing Technologist
- Freelance Web Consultant`,
          objectives: JSON.stringify([
            'Install, configure, and manage WordPress installations including multisite setups, security hardening, and performance optimization',
            'Develop custom WordPress themes from scratch using PHP, the WordPress template hierarchy, custom fields (ACF), and responsive design techniques',
            'Create custom WordPress plugins using hooks, filters, shortcodes, and the WordPress Plugin API to extend core functionality',
            'Build and configure e-commerce websites using WooCommerce with product management, payment gateways (M-Pesa, EcoCash), and shipping setups',
            'Design and implement headless CMS architectures using modern JavaScript frameworks (Next.js) with content modelling and API-driven delivery',
            'Optimize CMS websites for search engines (SEO), performance (Core Web Vitals), accessibility (WCAG compliance), and security',
            'Manage content workflows, user roles and permissions, taxonomies, and custom post types for complex organisational needs',
            'Implement backup strategies, update management, and migration procedures for production CMS environments',
            'Integrate third-party services: analytics, social media, email marketing, and CRM systems into CMS platforms',
            'Build 4+ complete CMS projects for your professional portfolio including a multi-service business website, an e-commerce store, and a headless CMS application'
          ]),
          modules: JSON.stringify([
            { name: 'Module 1: Web Technologies & Server Environment', weeks: 3, description: 'Refresh and strengthen your web development foundations. Set up a professional local development environment with LAMP/LEMP stack, and understand the server-side technologies that CMS platforms rely on.', topics: ['Local Development Environment Setup (XAMPP, MAMP, Laragon)', 'PHP Fundamentals: Variables, Functions, Arrays, Loops', 'MySQL Database Basics & phpMyAdmin', 'Server Configuration: Apache, Nginx Basics', 'Domain Names, DNS, Hosting & FTP', 'Introduction to CMS Concepts', 'Project: Set Up Your Development Portfolio'] },
            { name: 'Module 2: WordPress Fundamentals', weeks: 3, description: 'Master WordPress from the ground up. Install, configure, and manage WordPress sites. Understand the dashboard, themes, plugins, widgets, and content management features that make WordPress the most popular CMS in the world.', topics: ['WordPress Installation & Configuration', 'The WordPress Dashboard: Settings, Users, Tools', 'Content Management: Posts, Pages, Media, Categories', 'Theme Management: Installing, Customizing, Child Themes', 'Plugin Ecosystem: Essential Plugins for Every Site', 'Widgets, Menus & Site Customization', 'WordPress Security Basics', 'Project: Build a Multi-Page Business Website'] },
            { name: 'Module 3: WordPress Theme Development', weeks: 5, description: 'Learn to create custom WordPress themes from scratch. Understand the template hierarchy, enqueue scripts/styles, build custom page templates, integrate Advanced Custom Fields (ACF), and create fully responsive themes.', topics: ['WordPress Template Hierarchy Deep Dive', 'Setting Up a Custom Theme: style.css, functions.php', 'Enqueueing Scripts, Styles & Fonts Properly', 'Custom Page Templates & Template Parts', 'The Loop: Querying & Displaying Content', 'Advanced Custom Fields (ACF) Integration', 'Responsive Theme Design with CSS Frameworks', 'Customizer API for Live Theme Options', 'Project: Custom Theme from Design Mockup'] },
            { name: 'Module 4: WordPress Plugin Development', weeks: 4, description: 'Go beyond using plugins — learn to build them. Understand WordPress hooks (actions and filters), create custom shortcodes, build admin settings pages, and extend WordPress functionality with your own plugins.', topics: ['WordPress Hooks: Actions & Filters Explained', 'Creating Your First Custom Plugin', 'Shortcodes: Creating & Using Custom Shortcodes', 'Admin Settings Pages & Options API', 'Custom Post Types & Taxonomies Programmatically', 'AJAX in WordPress Plugins', 'Plugin Security: Sanitization, Escaping, Nonces', 'Project: Custom WordPress Plugin with Admin Panel'] },
            { name: 'Module 5: E-Commerce with WooCommerce', weeks: 4, description: 'Build online stores using WooCommerce — the most popular e-commerce platform for WordPress. Configure products, payments, shipping, and create a complete online shopping experience.', topics: ['WooCommerce Installation & Initial Setup', 'Product Types: Simple, Variable, Grouped, Virtual', 'Payment Gateways: M-Pesa, EcoCash, Bank Transfer Integration', 'Shipping Configuration & Tax Settings', 'Order Management & Customer Accounts', 'Customizing WooCommerce Templates', 'Storefront Theme Customization', 'Project: Complete E-Commerce Store for a Lesotho Business'] },
            { name: 'Module 6: Headless CMS & Modern Frameworks', weeks: 4, description: 'Explore the future of CMS — headless architecture. Build decoupled content management systems using Next.js with various headless CMS platforms, separating content management from front-end presentation.', topics: ['What is Headless CMS? Architecture & Benefits', 'Content Modeling & Structured Content', 'Building with Next.js & Headless CMS APIs', 'Static Site Generation (SSG) vs Server-Side Rendering (SSR)', 'GraphQL & REST API Content Delivery', 'Image Optimization & Asset Management', 'Multilingual Content Strategies', 'Project: Headless CMS Website with Next.js'] },
            { name: 'Module 7: SEO, Performance & Security', weeks: 3, description: 'Make every CMS site you build fast, secure, and search-engine friendly. Learn SEO best practices, performance optimization techniques, and security hardening for WordPress and custom CMS.', topics: ['On-Page SEO: Meta Tags, Headings, Structured Data', 'Technical SEO: Sitemaps, Robots.txt, Canonical URLs', 'Core Web Vitals & Performance Optimization', 'Caching Strategies: Browser, Server, Page', 'WordPress Security Hardening Checklist', 'Backup Strategies & Disaster Recovery', 'Accessibility (WCAG) Compliance', 'Project: SEO & Performance Audit & Fix of a Live Site'] },
            { name: 'Module 8: Client Projects & Professional Practice', weeks: 4, description: 'Apply everything you have learned by completing real-world projects. Learn client management, project scoping, pricing your services, and delivering professional CMS solutions.', topics: ['Client Requirements Gathering & Project Scoping', 'Estimating Time & Pricing Your Services', 'Project Management for Web Projects', 'Deploying to Production: Migration & Go-Live', 'Client Training & Handover Documentation', 'Maintenance Retainers & Ongoing Support', 'Building Your Portfolio & Personal Brand', 'Capstone Project: Complete CMS Solution for a Real Client Scenario'] }
          ]),
          isPublished: true,
        },
        {
          title: 'Business Development Systems',
          slug: 'business-development-systems',
          description: 'Learn to design, implement, and manage technology solutions that drive business growth and operational efficiency. This 3-month course combines business analysis, system design, and project management to prepare you for roles in business analysis, systems analysis, and IT consulting.',
          duration: '3 Months',
          durationMonths: 3,
          price: 2000,
          currency: 'M',
          category: 'Business IT',
          level: 'Beginner to Intermediate',
          image: '/logo.png',
          content: `# Business Development Systems

## Programme Overview

Our **Business Development Systems** programme is a focused 3-month course that bridges the gap between business needs and technology solutions. Drawing from our founder's BSc (Hons) in Business Information Technology from Limkokwing University, this programme teaches you how to analyse business requirements, design appropriate technology solutions, and manage IT projects from conception to successful implementation.

In Lesotho, many businesses struggle not because they lack ideas, but because they lack systems — proper processes, digital tools, and data-driven decision-making. This programme equips you to be the person who solves that problem.

## Why Choose This Course?

- **Business + Technology** — Unlike purely technical courses, this programme teaches you to understand business processes and translate them into technology solutions.
- **Practical & Relevant** — Case studies and projects are based on real business scenarios in Lesotho's economy.
- **Project Management Skills** — Learn to manage IT projects using industry-standard methodologies.
- **Data-Driven Decision Making** — Build dashboards and reports that help businesses make smarter decisions.
- **Short & Intensive** — Get job-ready skills in just 3 months.

## Who Should Enrol?

- Aspiring business analysts and systems analysts
- Small business owners who want to systematize their operations
- Office managers and administrators seeking digital skills
- University students in business or IT wanting practical application
- Anyone interested in the intersection of business and technology

## Career Opportunities

Graduates can work as:
- Business Analyst
- Systems Analyst
- IT Project Manager
- Business Intelligence Analyst
- Operations Manager
- Digital Transformation Consultant
- CRM/ERP Specialist`,
          objectives: JSON.stringify([
            'Analyse business requirements and translate them into clear, actionable technical specifications and system requirements',
            'Design business process models, workflow diagrams, and data flow diagrams using standard notations (BPMN, UML)',
            'Develop business intelligence dashboards and data analysis reports using spreadsheet tools and visualization platforms',
            'Understand and implement enterprise systems including ERP, CRM, and inventory management fundamentals',
            'Manage IT projects using both Agile (Scrum/Kanban) and Waterfall methodologies with proper planning and documentation',
            'Create compelling business cases with cost-benefit analysis and ROI calculations for technology investments',
            'Implement basic customer relationship management (CRM) systems and understand sales/marketing automation',
            'Apply database fundamentals for business data management including basic SQL queries and reporting',
            'Communicate effectively with both technical teams and business stakeholders using appropriate terminology',
            'Complete 4+ business system projects including a capstone project designing a complete business solution'
          ]),
          modules: JSON.stringify([
            { name: 'Module 1: Business Analysis Fundamentals', weeks: 3, description: 'Learn the foundations of business analysis — understanding how organisations work, gathering requirements, analysing processes, and identifying opportunities for technology-enabled improvement.', topics: ['The Role of a Business Analyst', 'Stakeholder Identification & Analysis', 'Requirements Gathering Techniques (Interviews, Surveys, Observation)', 'Business Process Modelling (BPMN Basics)', 'Feasibility Studies & Cost-Benefit Analysis', 'Writing Business Requirements Documents (BRD)', 'SWOT Analysis & Business Case Development', 'Project: Analyse a Local Business & Write a Business Case'] },
            { name: 'Module 2: Systems Analysis & Design', weeks: 3, description: 'Understand how to design information systems that meet business needs. Learn system architecture concepts, data flow diagrams, use case modelling, and the basics of user interface design.', topics: ['What is an Information System? Types & Components', 'System Development Life Cycle (SDLC)', 'Data Flow Diagrams (DFDs)', 'Use Case Modelling & User Stories', 'User Interface Design Principles', 'Prototyping & Wireframing Tools', 'System Architecture Basics (Client-Server, Cloud, Hybrid)', 'Project: Design a System for a Lesotho Retail Business'] },
            { name: 'Module 3: Business Data & Database Management', weeks: 3, description: 'Learn how businesses store, manage, and leverage their data. Understand database fundamentals, write basic SQL queries, create reports, and build data dashboards.', topics: ['Why Data Matters in Business', 'Relational Database Concepts', 'Basic SQL: SELECT, INSERT, UPDATE, DELETE', 'Data Analysis with Spreadsheets (Advanced Excel/Google Sheets)', 'Creating Charts, Pivot Tables & Dashboards', 'Data Quality & Integrity', 'Introduction to Business Intelligence Tools', 'Project: Build a Sales Dashboard from Business Data'] },
            { name: 'Module 4: Enterprise Systems & Business Tools', weeks: 3, description: 'Explore the technology systems that businesses use daily — from enterprise resource planning (ERP) to customer relationship management (CRM) and collaboration tools.', topics: ['Enterprise Resource Planning (ERP) Concepts', 'Customer Relationship Management (CRM) Systems', 'Inventory & Supply Chain Management Systems', 'Accounting & Financial Systems Overview', 'Collaboration Tools: Project Management (Trello, Asana)', 'Cloud-Based Business Solutions (Google Workspace, Microsoft 365)', 'E-Commerce Platforms for Business', 'Project: Set Up CRM & Project Management for a Business'] },
            { name: 'Module 5: Project Management & Professional Skills', weeks: 3, description: 'Develop the project management and professional communication skills essential for delivering technology solutions. Learn Agile, Scrum, and how to manage projects from start to finish.', topics: ['Project Management Fundamentals', 'Waterfall vs Agile vs Hybrid Approaches', 'Scrum Framework: Sprints, Stand-ups, Retrospectives', 'Project Planning: Scope, Timeline, Budget', 'Risk Management & Issue Tracking', 'Stakeholder Communication & Reporting', 'Digital Presentation & Documentation Skills', 'Project: Manage a Simulated IT Project End-to-End'] },
            { name: 'Module 6: Capstone Business Project', weeks: 3, description: 'Apply everything you have learned by designing and presenting a complete business technology solution for a real or simulated organisation. This is your opportunity to demonstrate your skills.', topics: ['Choosing a Business Problem to Solve', 'Requirements Analysis & System Design', 'Solution Architecture & Tool Selection', 'Implementation Plan & Timeline', 'Testing & Quality Assurance Basics', 'User Training Plan & Documentation', 'Final Presentation & Defence', 'Capstone: Complete Business Technology Solution'] }
          ]),
          isPublished: true,
        },
      ],
    });

    return NextResponse.json({ message: 'Data seeded successfully', seeded: true });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}
