export const profile = {
  name: 'Nitish Kumar',
  headline: 'B.Tech CSE | Developer | Problem Solver',
  intro: 'I build thoughtful products, solve real-world problems, and love turning ideas into working solutions.',
  about: 'I’m a Computer Science Engineering student at Chitkara University who enjoys solving problems, building software, and exploring how emerging technologies can create useful experiences. Alongside coding, I work in filmmaking, video production, and creative direction — interests that influence how I approach design, storytelling, and collaboration.',
  education: 'B.E. in Computer Science, Chitkara University · 2024–2028 · CGPA 9.69 / 10',
  interests: ['Software engineering', 'AI and LLM integration', 'Filmmaking', 'Video production', 'Creative direction'],
  goal: 'Building useful software and deepening my software engineering skills.',
  portrait: '/images/nitish-portrait.jpg',
  email: 'nitishkumar176576@gmail.com',
  githubUsername: 'NitishKumar-0',
  github: 'https://github.com/NitishKumar-0',
  linkedin: 'https://linkedin.com/in/nitishkumar-tech',
  leetcode: 'https://leetcode.com/u/NITISHKUMAR10401/',
  leetcodeUsername: 'NITISHKUMAR10401',
  resume: '/assets/Nitish_Kumar.pdf',
}

export const projects = [
  {
    name: 'QuickPull', type: 'Real-time, route-aware ride-sharing platform',
    problem: 'The available project notes identify a real-time, route-aware ride-sharing platform but don’t document a narrower problem statement.',
    solution: 'A responsive frontend for the platform, with a documented stack that includes Socket.IO and geospatial tools OSRM, H3, and Turf.js.',
    summary: 'Developed the frontend interface for a real-time ride-sharing platform, focusing on user interaction and a responsive user experience.',
    features: ['Real-time systems', 'Route-aware matching', 'Geospatial technologies', 'Backend development and API design'],
    tech: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'OSRM', 'H3', 'Turf.js'],
    links: { demo: 'https://krishthakur248.github.io/QuickPull/' },
  },
  {
    name: 'SkillXchange', type: 'Peer-to-peer skill exchange platform',
    problem: 'People looking to learn often need an easier way to connect with others who can teach the skills they want.',
    solution: 'A peer-to-peer platform that connects users to exchange skills and learn from one another.',
    summary: 'Contributed to developing a platform that connects users to exchange skills and learn from one another.',
    features: ['Full-stack development', 'Authentication', 'Skill matching', 'Third-party API integration'],
    tech: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO'],
    links: { demo: 'https://krishthakur248.github.io/SkillXChange_Landing_Page/' },
  },
]

export const skills = {
  Languages: ['Java', 'C++', 'JavaScript'],
  'Web & backend': ['React.js', 'Node.js', 'Express.js', 'MERN', 'REST APIs'],
  Databases: ['MongoDB', 'MySQL'],
  'Computer science': ['Data Structures & Algorithms', 'Object-Oriented Programming', 'DBMS', 'Operating Systems', 'Computer Networks'],
  AI: ['Machine Learning', 'AI/LLM Integration'],
  'Tools & infrastructure': ['Git', 'GitHub', 'Docker', 'Kubernetes (Basics)', 'CI/CD', 'Linux/Unix'],
}

// Coding statistics stay blank until verified profile data is added here.
export const codingActivity = { solved: null, acceptance: null, activeDays: null, currentStreak: null, longestStreak: null, contributions: [] }
