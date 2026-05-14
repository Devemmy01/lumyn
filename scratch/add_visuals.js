const fs = require('fs');

function addVisualsToJournal() {
    let content = fs.readFileSync('app/journal/page.tsx', 'utf-8');
    // Add decorative background elements
    const visualElements = `
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-[#7c6cf6] opacity-[0.05] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-[#000000] opacity-[0.4] blur-[120px] pointer-events-none rounded-full" />
      <div className="max-w-6xl mx-auto relative z-10">`;
      
    content = content.replace(/<div className="max-w-6xl mx-auto">/g, visualElements);
    content = content.replace(/className="min-h-screen pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden"/g, 'className="min-h-screen pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden bg-[#050505]"');
    fs.writeFileSync('app/journal/page.tsx', content);
}

function addVisualsToAbout() {
    let content = fs.readFileSync('app/about/page.tsx', 'utf-8');
    const visualElements = `
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#7c6cf6] opacity-[0.08] blur-[120px] pointer-events-none rounded-full mix-blend-screen" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#7c6cf6] opacity-[0.05] blur-[100px] pointer-events-none rounded-full mix-blend-screen" />
      <div className="max-w-5xl mx-auto relative z-10">`;

    content = content.replace(/<div className="max-w-5xl mx-auto">/g, visualElements);
    content = content.replace(/className="min-h-screen pt-32 pb-24 px-4 sm:px-6"/g, 'className="min-h-screen pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden bg-[#050505]"');
    fs.writeFileSync('app/about/page.tsx', content);
}

addVisualsToJournal();
addVisualsToAbout();
console.log('Visuals added to client pages');
