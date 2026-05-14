const fs = require('fs');

let content = fs.readFileSync('components/admin/PostEditor.tsx', 'utf-8');

// Title/Header
content = content.replace(/className="text-3xl font-bold tracking-tight text-gray-900"/g, 'className="text-3xl font-bold tracking-tighter uppercase text-white"');

// Inputs
content = content.replace(/className="max-w-2xl text-sm text-gray-500"/g, 'className="max-w-2xl text-sm text-neutral-500 font-medium tracking-wide"');
content = content.replace(/className="bg-white px-4 py-5 shadow-sm sm:rounded-lg sm:p-6 border"/g, 'className="bg-[#0a0a0a] px-4 py-5 sm:p-6 border border-[#222] rounded-2xl shadow-soft"');

content = content.replace(/className="block text-sm font-medium text-gray-700"/g, 'className="block text-xs font-bold uppercase tracking-widest text-neutral-400"');
content = content.replace(/className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm bg-gray-50\/50"/g, 'className="mt-2 block w-full rounded-xl border-[#222] bg-[#050505] text-white shadow-sm focus:border-[#7c6cf6] focus:ring-[#7c6cf6] sm:text-sm transition-colors py-3 px-4 outline-none"');
content = content.replace(/className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"/g, 'className="h-4 w-4 bg-[#050505] text-[#7c6cf6] focus:ring-[#7c6cf6] border-[#222] rounded"');

// Form grid
content = content.replace(/className="grid grid-cols-1 gap-6 sm:grid-cols-2"/g, 'className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4"');

// Markdown toolbar
content = content.replace(/className="bg-gray-50 border-b px-3 py-2 flex gap-2 flex-wrap rounded-t-md"/g, 'className="bg-[#050505] border-b border-[#222] px-3 py-2 flex gap-2 flex-wrap rounded-t-xl"');
content = content.replace(/className="px-2 py-1 text-sm text-gray-600 hover:text-black hover:bg-gray-200 rounded transition"/g, 'className="px-2 py-1 text-sm font-bold text-neutral-400 hover:text-white hover:bg-[#111] rounded transition"');

// Textarea
content = content.replace(/className="block w-full rounded-b-md border-0 focus:ring-black sm:text-sm resize-y font-mono bg-white min-h-\[400px\]"/g, 'className="block w-full rounded-b-xl border-[#222] bg-[#0a0a0a] text-white outline-none focus:ring-[#7c6cf6] sm:text-sm resize-y font-mono min-h-[400px] p-4"');

// Help texts
content = content.replace(/className="mt-2 text-sm text-gray-500"/g, 'className="mt-2 text-xs font-semibold tracking-wide text-neutral-500"');
content = content.replace(/className="ml-2 block text-sm text-gray-900"/g, 'className="ml-2 block text-sm font-bold tracking-wide text-white"');

// Divider
content = content.replace(/<div className="hidden sm:block" aria-hidden="true">[\s\S]*?<div className="border-t">/g, '<div className="hidden sm:block" aria-hidden="true">\n<div className="py-5">\n<div className="border-t border-[#222]">');
content = content.replace(/<div className="border-t border-gray-200">/g, '<div className="border-t border-[#222]">');
content = content.replace(/<div className="border-t border-gray-200" \/>/g, '<div className="border-t border-[#222]" />');
content = content.replace(/className="border-t pt-5 mt-5"/g, 'className="border-t border-[#222] pt-5 mt-5"');

// Buttons
content = content.replace(/className="inline-flex justify-center py-2 px-4 border shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition disabled:opacity-50"/g, 'className="inline-flex justify-center py-3 px-6 shadow-sm text-xs font-bold tracking-widest uppercase rounded-xl text-white bg-[#7c6cf6] border border-[#7c6cf6] hover:bg-transparent hover:text-[#7c6cf6] transition-all disabled:opacity-50"');
content = content.replace(/className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"/g, 'className="inline-flex justify-center py-3 px-6 shadow-sm text-xs font-bold tracking-widest uppercase rounded-xl text-white bg-red-950/30 border border-red-900/50 hover:bg-red-900/40 transition-all"');
content = content.replace(/className="bg-white py-2 px-4 border text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"/g, 'className="py-3 px-6 border border-[#222] text-xs font-bold uppercase tracking-widest rounded-xl text-neutral-400 bg-[#0a0a0a] hover:bg-[#111] hover:text-white transition-all"');

content = content.replace(/className="mt-2 block w-full rounded-xl border-\[\#222\] bg-\[\#050505\] text-white shadow-sm focus:border-\[\#7c6cf6\] focus:ring-\[\#7c6cf6\] sm:text-sm transition-colors py-3 px-4 outline-none border-gray-300"/g, 'className="mt-2 block w-full rounded-xl border-[#222] border bg-[#050505] text-white shadow-sm focus:border-[#7c6cf6] focus:ring-[#7c6cf6] sm:text-sm transition-colors py-3 px-4 outline-none"');

fs.writeFileSync('components/admin/PostEditor.tsx', content);

