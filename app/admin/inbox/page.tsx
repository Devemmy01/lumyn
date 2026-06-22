import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import InboundEmail from "@/models/InboundEmail";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Email Inbox | Admin" };

export default async function AdminInboxPage() {
  await connectDB();
  const messages = await InboundEmail.find().sort({ receivedAt: -1 }).limit(100).lean();

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Inbound email</h1>
        <p className="mt-2 text-neutral-500">Messages received through your Resend receiving domain.</p>
      </div>
      <div className="space-y-4">
        {messages.length ? messages.map((message) => (
          <article key={message._id.toString()} className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-semibold text-white">{message.subject}</h2>
                <p className="mt-1 text-sm text-neutral-500">From {message.from} · to {message.to.join(", ")}</p>
              </div>
              <time className="text-xs text-neutral-600">{new Date(message.receivedAt).toLocaleString()}</time>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-neutral-300">
              {message.text || "HTML email received. Open the message in Resend to inspect its formatted content."}
            </p>
            {message.attachments.length > 0 && <p className="mt-4 text-xs text-[#9b8cff]">{message.attachments.length} attachment{message.attachments.length === 1 ? "" : "s"}: {message.attachments.map((item) => item.filename).join(", ")}</p>}
          </article>
        )) : <div className="rounded-2xl border border-dashed border-[#222] p-12 text-center text-neutral-600">No inbound messages yet.</div>}
      </div>
    </div>
  );
}
