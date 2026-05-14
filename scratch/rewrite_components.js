const fs = require('fs');

const rewriteSearch = () => {
    let content = fs.readFileSync('components/admin/AdminSearch.tsx', 'utf-8');
    content = content.replace(/className="w-full px-4 py-2 bg-ivory-200\/50 border border-stone\/60[\s\n]*focus:outline-none focus:ring-2 focus:ring-sage\/20 focus:border-sage[\s\n]*transition-all text-sm placeholder-stone-400"/g, 'className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl focus:border-[#7c6cf6] outline-none transition-all text-sm text-white placeholder-neutral-600"');
    fs.writeFileSync('components/admin/AdminSearch.tsx', content);
};

const rewriteFilter = () => {
    let content = fs.readFileSync('components/admin/AdminFilter.tsx', 'utf-8');
    content = content.replace(/className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white  shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm appearance-none cursor-pointer"/g, 'className="block w-full pl-4 pr-10 py-2.5 border border-[#222] bg-[#050505] text-white rounded-xl focus:border-[#7c6cf6] focus:outline-none focus:ring-1 focus:ring-[#7c6cf6] sm:text-sm appearance-none cursor-pointer transition-colors"');
    content = content.replace(/className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"/g, 'className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500"');
    fs.writeFileSync('components/admin/AdminFilter.tsx', content);
};

const rewritePagination = () => {
    let content = fs.readFileSync('components/admin/AdminPagination.tsx', 'utf-8');
    
    content = content.replace(/className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2"/g, 'className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2"');
    content = content.replace(/className="text-xs sm:text-sm text-gray-500 font-medium order-2 sm:order-1"/g, 'className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500 order-2 sm:order-1"');
    content = content.replace(/className="text-charcoal font-semibold"/g, 'className="text-white mx-1"');
    
    content = content.replace(/className="flex-1 sm:flex-none px-4 py-2 bg-white border border-stone\/40  text-sm font-medium text-charcoal hover:bg-ivory-200 transition-all text-center"/g, 'className="flex-1 sm:flex-none px-6 py-2.5 bg-[#0a0a0a] border border-[#222] rounded-xl text-xs font-bold uppercase tracking-widest text-neutral-400 hover:bg-[#111] hover:text-white transition-all text-center"');
    content = content.replace(/className="flex-1 sm:flex-none px-4 py-2 border border-stone\/20  text-sm font-medium text-stone-400 cursor-not-allowed text-center"/g, 'className="flex-1 sm:flex-none px-6 py-2.5 border border-[#222] rounded-xl text-xs font-bold uppercase tracking-widest text-[#222] cursor-not-allowed text-center"');
    fs.writeFileSync('components/admin/AdminPagination.tsx', content);
};

rewriteSearch();
rewriteFilter();
rewritePagination();
