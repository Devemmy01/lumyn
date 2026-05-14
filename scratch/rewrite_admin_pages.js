const fs = require('fs');
const path = require('path');

const rewritePosts = () => {
    let content = fs.readFileSync('app/admin/posts/page.tsx', 'utf-8');
    
    // Header section
    content = content.replace(
        /<h1 className="text-3xl font-bold tracking-tight text-gray-900">/g, 
        '<h1 className="text-3xl font-bold tracking-tighter text-white uppercase">'
    );
    content = content.replace(
        /className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium  shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"/g,
        'className="inline-flex items-center px-4 py-2 border border-[#222] rounded-xl text-sm font-bold tracking-widest uppercase text-white bg-[#0a0a0a] hover:bg-[#111] hover:border-[#7c6cf6] transition-all"'
    );
    
    // Main container
    content = content.replace(/className="bg-white border  shadow-sm"/g, 'className="bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-soft overflow-hidden"');
    
    // Header inside container
    content = content.replace(/className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50\/50 lg gap-4"/g, 'className="p-6 border-b border-[#222] flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#050505] gap-4"');
    
    content = content.replace(/className="text-sm text-gray-500 whitespace-nowrap"/g, 'className="text-xs font-semibold text-neutral-500 uppercase tracking-widest whitespace-nowrap"');
    
    // Tables
    content = content.replace(/<tr className="border-b bg-gray-50\/50">/g, '<tr className="border-b border-[#222] bg-[#050505]">');
    content = content.replace(/className="px-6 py-4 text-sm font-medium text-gray-600"/g, 'className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-neutral-500"');
    content = content.replace(/className="px-6 py-4 text-sm font-medium text-gray-600 text-right"/g, 'className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-neutral-500 text-right"');
    
    content = content.replace(/<tbody className="divide-y text-sm">/g, '<tbody className="divide-y divide-[#222] text-sm">');
    content = content.replace(/className="hover:bg-gray-50\/50 transition-colors"/g, 'className="hover:bg-[#111] transition-colors"');
    
    content = content.replace(/className="font-medium text-gray-900"/g, 'className="font-bold tracking-wide text-white"');
    content = content.replace(/className="text-xs text-gray-500 mt-1"/g, 'className="text-xs font-medium text-neutral-500 mt-1 tracking-wider"');
    content = content.replace(/className="text-xs text-gray-500 mb-3"/g, 'className="text-xs font-medium text-neutral-500 mb-3 tracking-wider"');
    
    content = content.replace(/className={`inline-flex items-center px-2.5 py-0.5  text-xs font-medium \${post.published \? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}/g, 'className={`inline-flex items-center px-2.5 py-0.5 border text-xs font-bold uppercase tracking-wider rounded-md ${post.published ? \'bg-[#7c6cf6]/10 text-[#7c6cf6] border-[#7c6cf6]/30\' : \'bg-neutral-900 text-neutral-400 border-[#222]\'}`}');
    
    content = content.replace(/className="px-6 py-8 text-center text-gray-500"/g, 'className="px-6 py-12 text-center text-neutral-600 uppercase tracking-widest text-sm font-semibold"');
    content = content.replace(/className="px-6 py-8 text-center text-gray-500 text-sm"/g, 'className="px-6 py-12 text-center text-neutral-600 uppercase tracking-widest text-sm font-semibold"');

    content = content.replace(/className="px-6 py-4 text-gray-500 font-medium"/g, 'className="px-6 py-4 text-neutral-400 font-bold"');
    content = content.replace(/className="px-6 py-4 text-gray-500"/g, 'className="px-6 py-4 text-neutral-400 font-semibold tracking-wide"');
    
    content = content.replace(/className="text-blue-600 hover:text-blue-900 font-medium text-sm transition"/g, 'className="text-[#7c6cf6] hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"');
    
    // Mobile cards
    content = content.replace(/<div className="md:hidden divide-y">/g, '<div className="md:hidden divide-y divide-[#222]">');
    content = content.replace(/className="p-4 hover:bg-gray-50\/50 transition-colors"/g, 'className="p-6 hover:bg-[#111] transition-colors"');
    content = content.replace(/className="font-medium text-gray-900 pr-4"/g, 'className="font-bold tracking-wide text-white pr-4"');
    content = content.replace(/className={`inline-flex items-center px-2 py-0.5  text-\[10px\] font-medium whitespace-nowrap \${post.published \? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}/g, 'className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap ${post.published ? \'bg-[#7c6cf6]/10 text-[#7c6cf6] border-[#7c6cf6]/30\' : \'bg-neutral-900 text-neutral-400 border-[#222]\'}`}');
    content = content.replace(/className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100"/g, 'className="flex items-center justify-between text-xs font-semibold tracking-wider text-neutral-500 mt-4 pt-4 border-t border-[#222]"');
    content = content.replace(/<span className="font-medium text-gray-700">{post.upvotes}<\/span>/g, '<span className="font-bold text-white">{post.upvotes}</span>');
    content = content.replace(/className="text-blue-600 font-semibold px-3 py-1 bg-blue-50 "/g, 'className="text-[#7c6cf6] font-bold uppercase tracking-widest px-4 py-2 bg-[#7c6cf6]/10 border border-[#7c6cf6]/30 rounded-lg"');
    
    // Pagination wrapper
    content = content.replace(/className="p-4 border-t"/g, 'className="p-6 border-t border-[#222] bg-[#050505]"');

    fs.writeFileSync('app/admin/posts/page.tsx', content);
    console.log("Rewrote app/admin/posts/page.tsx");
};

const rewriteInquiries = () => {
    let content = fs.readFileSync('app/admin/inquiries/page.tsx', 'utf-8');
    
    content = content.replace(/className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900"/g, 'className="text-2xl sm:text-3xl font-bold tracking-tighter uppercase text-white"');
    content = content.replace(/className="bg-white border  shadow-sm"/g, 'className="bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-soft overflow-hidden"');
    content = content.replace(/className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50\/50 lg"/g, 'className="p-6 border-b border-[#222] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#050505]"');
    content = content.replace(/className="text-xs sm:text-sm text-gray-500 font-medium"/g, 'className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500"');
    content = content.replace(/className="text-charcoal"/g, 'className="text-white ml-2"');
    
    content = content.replace(/<tr className="border-b bg-gray-50\/50">/g, '<tr className="border-b border-[#222] bg-[#050505]">');
    content = content.replace(/className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider"/g, 'className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500"');
    content = content.replace(/<tbody className="divide-y text-sm">/g, '<tbody className="divide-y divide-[#222] text-sm">');
    content = content.replace(/className="px-6 py-8 text-center text-gray-500"/g, 'className="px-6 py-12 text-center text-neutral-600 uppercase tracking-widest text-sm font-semibold"');
    content = content.replace(/className="hover:bg-gray-50\/50 transition-colors"/g, 'className="hover:bg-[#111] transition-colors"');
    content = content.replace(/className="font-medium text-gray-900"/g, 'className="font-bold text-white tracking-wide"');
    content = content.replace(/className="text-xs text-gray-500 mt-1"/g, 'className="text-xs font-medium text-[#7c6cf6] mt-1 tracking-wider"');
    content = content.replace(/className="text-gray-700 whitespace-pre-wrap line-clamp-3 max-w-xl"/g, 'className="text-neutral-400 whitespace-pre-wrap line-clamp-3 max-w-xl font-medium tracking-wide"');
    content = content.replace(/className="px-6 py-4 text-gray-500 whitespace-nowrap align-top"/g, 'className="px-6 py-4 text-neutral-500 font-semibold tracking-wider whitespace-nowrap align-top"');
    
    // Mobile cards
    content = content.replace(/<div className="md:hidden divide-y divide-gray-100">/g, '<div className="md:hidden divide-y divide-[#222]">');
    content = content.replace(/className="px-4 py-12 text-center text-gray-500 text-sm"/g, 'className="px-4 py-12 text-center text-neutral-600 uppercase tracking-widest font-semibold text-sm"');
    content = content.replace(/className="p-4 bg-white active:bg-gray-50 transition-colors"/g, 'className="p-6 bg-[#0a0a0a] hover:bg-[#111] transition-colors"');
    content = content.replace(/className="font-semibold text-gray-900 text-base"/g, 'className="font-bold text-white tracking-title text-base"');
    content = content.replace(/className="text-xs text-sage font-medium"/g, 'className="text-xs text-[#7c6cf6] font-bold tracking-widest"');
    content = content.replace(/className="text-\[10px\] font-medium text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-0.5 "/g, 'className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap bg-neutral-900 border border-[#222] rounded px-2 py-1"');
    content = content.replace(/className="bg-ivory-200\/50 p-3  border border-stone\/10"/g, 'className="bg-[#050505] rounded-xl p-4 border border-[#222] mt-4"');
    content = content.replace(/className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed"/g, 'className="text-sm text-neutral-400 font-medium whitespace-pre-wrap leading-relaxed tracking-wide"');
    content = content.replace(/className="mt-3 text-\[10px\] text-gray-400 flex justify-end"/g, 'className="mt-4 text-[10px] uppercase tracking-widest font-bold text-neutral-600 flex justify-end"');
    
    content = content.replace(/className="p-4 border-t"/g, 'className="p-6 border-t border-[#222] bg-[#050505]"');

    fs.writeFileSync('app/admin/inquiries/page.tsx', content);
    console.log("Rewrote app/admin/inquiries/page.tsx");
};

rewritePosts();
rewriteInquiries();
