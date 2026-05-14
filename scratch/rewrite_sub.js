const fs = require('fs');

const rewriteSub = () => {
    let content = fs.readFileSync('app/admin/subscribers/page.tsx', 'utf-8');
    
    content = content.replace(/className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900"/g, 'className="text-2xl sm:text-3xl font-bold tracking-tighter uppercase text-white"');
    content = content.replace(/className="bg-white border  shadow-sm"/g, 'className="bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-soft overflow-hidden"');
    content = content.replace(/className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50\/50 lg"/g, 'className="p-6 border-b border-[#222] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#050505]"');
    
    content = content.replace(/className="text-xs sm:text-sm text-gray-500 font-medium"/g, 'className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500"');
    content = content.replace(/className="text-charcoal"/g, 'className="text-white ml-2"');
    
    content = content.replace(/<tr className="border-b bg-gray-50\/50">/g, '<tr className="border-b border-[#222] bg-[#050505]">');
    content = content.replace(/className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider"/g, 'className="px-4 sm:px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500"');
    content = content.replace(/<tbody className="divide-y text-sm">/g, '<tbody className="divide-y divide-[#222] text-sm">');
    
    content = content.replace(/className="px-6 py-8 text-center text-gray-500"/g, 'className="px-6 py-12 text-center text-neutral-600 uppercase tracking-widest text-sm font-semibold"');
    content = content.replace(/className="hover:bg-gray-50\/50 transition-colors"/g, 'className="hover:bg-[#111] transition-colors"');
    content = content.replace(/className="px-4 sm:px-6 py-4 font-medium text-gray-900 break-all"/g, 'className="px-4 sm:px-6 py-4 font-bold text-white tracking-wide break-all"');
    content = content.replace(/className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap"/g, 'className="px-4 sm:px-6 py-4 text-neutral-500 font-semibold tracking-wider whitespace-nowrap"');
    content = content.replace(/className="p-4 border-t"/g, 'className="p-6 border-t border-[#222] bg-[#050505]"');

    fs.writeFileSync('app/admin/subscribers/page.tsx', content);
    console.log("Rewrote app/admin/subscribers/page.tsx");
}
rewriteSub();
