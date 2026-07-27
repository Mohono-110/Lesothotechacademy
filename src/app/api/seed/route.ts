import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Seed courses and default admin
export async function POST() {
  try {
    // Check if courses already exist
    const existingCourses = await db.course.count();
    if (existingCourses > 0) {
      return NextResponse.json({ message: 'Data already seeded', seeded: false });
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const existingAdmin = await db.admin.findFirst();
    if (!existingAdmin) {
      await db.admin.create({
        data: {
          email: 'admin@lesothotechacademy.com',
          password: hashedPassword,
          name: 'Relebohile Joseph Mohono',
        },
      });
    }

    // Create courses
    const courses = await db.course.createMany({
      data: [
        {
          title: 'Web Development Programming',
          slug: 'web-development-programming',
          description: 'Master the art of building modern, responsive websites and web applications using industry-standard technologies. This comprehensive short course takes you from HTML and CSS fundamentals through advanced JavaScript frameworks, equipping you with the skills to create professional web solutions for businesses and individuals.',
          duration: '3 Months',
          durationMonths: 3,
          price: 300,
          currency: 'M',
          category: 'Web Development',
          level: 'Beginner to Intermediate',
          image: '/logo.png',
          content: 'This intensive 3-month Web Development Programming course is designed to take you from zero to a confident web developer. You will learn to build fully functional, responsive websites using modern tools and frameworks that power the web today.\n\nThe curriculum covers front-end development with HTML5, CSS3, JavaScript, and React.js, as well as back-end development with Node.js and Express. You will also learn database design with SQLite/MySQL, version control with Git, and deployment strategies.\n\nEach module includes hands-on projects that simulate real-world scenarios, ensuring you graduate with a portfolio of work that demonstrates your capabilities to potential employers or clients.',
          objectives: JSON.stringify([
            'Build responsive websites using HTML5, CSS3, and modern JavaScript (ES6+)',
            'Develop single-page applications using React.js with state management',
            'Create RESTful APIs using Node.js and Express framework',
            'Design and implement relational databases with SQLite',
            'Deploy web applications using modern hosting platforms',
            'Implement version control and collaborative workflows with Git and GitHub',
            'Understand web security best practices and authentication systems',
            'Build a professional portfolio of 5+ completed web projects'
          ]),
          modules: JSON.stringify([
            { name: 'Module 1: HTML5 & CSS3 Fundamentals', weeks: 2, description: 'Learn semantic HTML, CSS layouts, Flexbox, Grid, and responsive design principles.' },
            { name: 'Module 2: JavaScript Essentials', weeks: 2, description: 'Master JavaScript fundamentals including DOM manipulation, events, async programming, and ES6+ features.' },
            { name: 'Module 3: React.js Development', weeks: 3, description: 'Build interactive UIs with React components, hooks, state management, and routing.' },
            { name: 'Module 4: Backend with Node.js & Express', weeks: 2, description: 'Create server-side applications, RESTful APIs, middleware, and handle authentication.' },
            { name: 'Module 5: Database Design & Integration', weeks: 1, description: 'Design relational databases, use SQLite/MySQL, and connect back-end to front-end.' },
            { name: 'Module 6: Deployment & Portfolio Project', weeks: 2, description: 'Deploy applications, learn Git/GitHub, and build a capstone project for your portfolio.' }
          ]),
          isPublished: true,
        },
        {
          title: 'Content Management System Development and Customization',
          slug: 'cms-development-customization',
          description: 'Learn to build, customize, and manage professional content management systems that power modern websites. This course covers popular CMS platforms like WordPress, alongside custom CMS development using modern frameworks. You will gain the expertise to create tailored digital solutions for businesses, government agencies, and organizations across Lesotho and beyond.',
          duration: '6 Months',
          durationMonths: 6,
          price: 600,
          currency: 'M',
          category: 'CMS Development',
          level: 'Intermediate',
          image: '/logo.png',
          content: 'This 6-month comprehensive course trains you to become a CMS specialist capable of developing and customizing content management solutions for diverse organizational needs.\n\nYou will start with foundational web technologies and progressively advance to CMS architecture, theme development, plugin creation, and custom CMS building. The curriculum emphasizes practical skills through real-world projects for actual clients.\n\nThe course covers WordPress (the world\'s most popular CMS), headless CMS architecture, and building custom CMS solutions from scratch using Next.js and modern frameworks. You will also learn e-commerce integration, SEO optimization, and performance tuning.',
          objectives: JSON.stringify([
            'Install, configure, and manage WordPress installations including multisite setups',
            'Develop custom WordPress themes from scratch using PHP, HTML, CSS, and JavaScript',
            'Create custom WordPress plugins and extend core functionality with hooks and filters',
            'Build headless CMS architectures using modern JavaScript frameworks',
            'Implement e-commerce solutions using WooCommerce and custom payment integrations',
            'Optimize CMS sites for performance, SEO, and security',
            'Manage content workflows, user roles, and permissions systems',
            'Deploy and maintain CMS solutions with backup and update strategies',
            'Build 3+ complete CMS projects for professional portfolio'
          ]),
          modules: JSON.stringify([
            { name: 'Module 1: Web Technologies Refresher', weeks: 3, description: 'Refresh HTML, CSS, JavaScript, PHP basics, and server environment setup.' },
            { name: 'Module 2: WordPress Fundamentals', weeks: 3, description: 'Install WordPress, configure settings, manage content, themes, and plugins.' },
            { name: 'Module 3: WordPress Theme Development', weeks: 4, description: 'Build custom themes using template hierarchy, custom fields, and responsive design.' },
            { name: 'Module 4: WordPress Plugin Development', weeks: 4, description: 'Create custom plugins, use hooks/filters, shortcodes, and admin settings pages.' },
            { name: 'Module 5: Headless CMS & Modern Frameworks', weeks: 4, description: 'Build headless CMS with Next.js, content modeling, and API-driven content delivery.' },
            { name: 'Module 6: E-Commerce & Business Integration', weeks: 3, description: 'Set up WooCommerce, custom payment gateways, and business-oriented CMS features.' },
            { name: 'Module 7: SEO, Security & Performance', weeks: 2, description: 'Optimize for search engines, implement security measures, and performance tuning.' },
            { name: 'Module 8: Client Projects & Deployment', weeks: 3, description: 'Complete real-world client projects and deploy to production environments.' }
          ]),
          isPublished: true,
        },
        {
          title: 'Computer Networks',
          slug: 'computer-networks',
          description: 'Gain comprehensive knowledge of computer networking fundamentals, advanced infrastructure design, and network security. This course prepares you for careers in network administration, IT support, and systems engineering. Learn to design, implement, troubleshoot, and secure enterprise-level networks that are critical for business operations in the modern digital landscape.',
          duration: '6 Months',
          durationMonths: 6,
          price: 600,
          currency: 'M',
          category: 'Networking',
          level: 'Beginner to Advanced',
          image: '/logo.png',
          content: 'This 6-month Computer Networks course provides in-depth training on networking principles, protocols, and practical implementation. From basic concepts to advanced enterprise networking, this program prepares you for the demands of modern IT infrastructure.\n\nYou will learn OSI and TCP/IP models, IP addressing and subnetting, routing and switching, wireless networking, network security, cloud networking, and network troubleshooting. Hands-on lab simulations and real equipment practice ensure you gain practical experience.\n\nThe curriculum aligns with industry certification paths (CompTIA Network+, CCNA) and includes extensive lab work with network simulators and physical equipment where available.',
          objectives: JSON.stringify([
            'Understand and apply OSI and TCP/IP networking models',
            'Configure IP addressing, subnetting, and VLSM for enterprise networks',
            'Install and configure routers, switches, and network devices',
            'Implement VLANs, trunking, and inter-VLAN routing',
            'Set up and manage wireless networks including security protocols',
            'Design and implement network security measures including firewalls and VPNs',
            'Troubleshoot common network issues using diagnostic tools and methodologies',
            'Understand cloud networking concepts and hybrid architectures',
            'Prepare for CompTIA Network+ and CCNA certification exams',
            'Complete 5+ hands-on networking lab projects'
          ]),
          modules: JSON.stringify([
            { name: 'Module 1: Networking Fundamentals', weeks: 3, description: 'OSI model, TCP/IP stack, network topologies, and basic networking concepts.' },
            { name: 'Module 2: IP Addressing & Subnetting', weeks: 3, description: 'IPv4/IPv6 addressing, subnetting, VLSM, CIDR, and network planning.' },
            { name: 'Module 3: Routing & Switching', weeks: 4, description: 'Router configuration, static and dynamic routing, switching, VLANs, and STP.' },
            { name: 'Module 4: Wireless Networking', weeks: 3, description: 'WiFi standards, wireless security (WPA2/3), access point configuration.' },
            { name: 'Module 5: Network Security', weeks: 4, description: 'Firewalls, VPNs, intrusion detection, encryption, and security policies.' },
            { name: 'Module 6: Network Services & Protocols', weeks: 2, description: 'DNS, DHCP, HTTP/HTTPS, FTP, email protocols, and directory services.' },
            { name: 'Module 7: Cloud & Virtual Networking', weeks: 3, description: 'Virtualization basics, cloud networking, SDN, and container networking.' },
            { name: 'Module 8: Troubleshooting & Certification Prep', weeks: 4, description: 'Network diagnostics, troubleshooting methodologies, and exam preparation.' }
          ]),
          isPublished: true,
        },
        {
          title: 'Business Development Systems',
          slug: 'business-development-systems',
          description: 'Learn to design, implement, and manage technology solutions that drive business growth and operational efficiency. This course combines business analysis, system design, and project management to prepare you for roles in business analysis, systems analysis, and IT consulting. You will develop the skills to bridge the gap between business needs and technology solutions.',
          duration: '6 Months',
          durationMonths: 6,
          price: 600,
          currency: 'M',
          category: 'Business IT',
          level: 'Intermediate',
          image: '/logo.png',
          content: 'This 6-month Business Development Systems course is uniquely designed to develop professionals who can analyze business needs, design technology solutions, and manage IT projects from conception to implementation.\n\nDrawing from the expertise of our founder\'s BSc (Hons) in Business Information Technology, this course teaches you to understand how technology enables business processes, improves decision-making, and creates competitive advantages. You will learn systems analysis, database management, enterprise systems, project management, and business intelligence.\n\nThe curriculum includes practical case studies from Lesotho\'s business environment, ensuring graduates are equipped to address local and regional business challenges with appropriate technology solutions.',
          objectives: JSON.stringify([
            'Analyze business requirements and translate them into technical specifications',
            'Design and implement business information systems using modern tools',
            'Manage IT projects using agile and waterfall methodologies',
            'Develop business intelligence dashboards and data analysis reports',
            'Understand enterprise resource planning (ERP) system implementation',
            'Create business process models and workflow automation solutions',
            'Implement customer relationship management (CRM) systems',
            'Apply project management principles with tools like Trello and Asana',
            'Develop business cases and ROI analyses for technology investments',
            'Complete 4+ business system implementation projects'
          ]),
          modules: JSON.stringify([
            { name: 'Module 1: Business Analysis Fundamentals', weeks: 3, description: 'Requirements gathering, stakeholder analysis, feasibility studies, and business process modeling.' },
            { name: 'Module 2: Systems Analysis & Design', weeks: 3, description: 'System architecture, UML diagrams, data flow diagrams, and prototyping.' },
            { name: 'Module 3: Database Management for Business', weeks: 3, description: 'Database design, SQL, data warehousing, and reporting with business tools.' },
            { name: 'Module 4: Enterprise Systems & ERP', weeks: 3, description: 'Enterprise resource planning, supply chain management, and system integration.' },
            { name: 'Module 5: Business Intelligence & Analytics', weeks: 4, description: 'Data visualization, dashboard creation, KPI tracking, and decision support systems.' },
            { name: 'Module 6: Project Management & Agile', weeks: 3, description: 'Project lifecycle, agile/scrum methodologies, project planning tools, and team management.' },
            { name: 'Module 7: CRM & E-Business Systems', weeks: 3, description: 'Customer management systems, e-commerce platforms, and digital marketing tools.' },
            { name: 'Module 8: Capstone Business Project', weeks: 4, description: 'Design and implement a complete business system for a real organization.' }
          ]),
          isPublished: true,
        },
      ],
    });

    return NextResponse.json({ 
      message: 'Data seeded successfully', 
      seeded: true,
      coursesCount: courses.count,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}
