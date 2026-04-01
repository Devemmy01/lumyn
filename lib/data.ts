import { IPost } from "@/types";

export const samplePosts: Omit<IPost, "_id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Why Modern Software Is Too Noisy",
    slug: "why-modern-software-is-too-noisy",
    excerpt:
      "Most apps compete for your attention through notifications, badges, and endless feeds. We explore why this happened and what a calmer path looks like.",
    content: `## The Noise Problem

Open your phone. How many notifications are waiting? How many of them actually matter?

Modern software has a noise problem. Not a technical problem — a philosophical one. Somewhere along the way, engagement became the primary metric, and engagement meant more interruptions, more stimulation, more urgency.

The result is a digital environment that feels like Times Square at midnight.

## Where It Went Wrong

The attention economy isn't an accident. It was designed. Product teams learned that variable reward schedules — the mechanism behind slot machines — kept users returning. Red notification badges trigger the same dopamine response as physical danger.

Every feature added was another hook. Every animation a nudge. Every dark pattern a gentle push toward staying longer, clicking more, spending more.

We built systems that are excellent at capturing attention and terrible at protecting it.

## A Different Approach

What if software was designed to get out of your way?

What if the measure of a great tool was not time-on-app but quality of thought produced?

This is the question Lumyn is trying to answer. Each product we build starts with a different constraint: what can we remove? What creates clarity instead of noise?

The tools that help you think are almost always quieter than the ones that don't.

## The Cost of Noise

Constant interruption doesn't just feel unpleasant — it has measurable cognitive costs. Research shows it takes an average of 23 minutes to regain deep focus after an interruption. With dozens of interruptions per day, meaningful work becomes nearly impossible.

The apps that seem most helpful are often the ones causing the most damage.

## Building Differently

At Lumyn, we're starting with restraint. Every notification has to earn its place. Every feature has to prove it adds clarity rather than friction. We remove before we add.

This is harder than it sounds. Adding feels like progress. Removing feels like regression. But the best tools — a sharp knife, a quiet room, a clear brief — are always the ones where everything unnecessary has been taken away.

The future of software is calmer than its present. We intend to build it.`,
    tags: ["digital-minimalism", "focus", "product-design"],
    coverImage: "",
    published: true,
    readingTime: 4,
  },
  {
    title: "The Future of Calm Technology",
    slug: "the-future-of-calm-technology",
    excerpt:
      "Calm technology is not just a design aesthetic. It's a philosophy about how software should relate to human attention — and it points toward a fundamentally different kind of tool.",
    content: `## What Is Calm Technology?

The term "calm technology" was coined by Mark Weiser and John Seely Brown at Xerox PARC in 1995. Their insight was prescient: as computation became ambient, as it wove itself into the fabric of daily life, the relationship between people and technology would need to change.

Weiser and Brown proposed that the best technology should move from the center of our attention to the periphery. It should be present without demanding presence.

Three decades later, we've mostly built the opposite.

## The Peripheral vs. The Center

Think about the difference between a clock on the wall and a smartphone. Both tell time. But the clock waits for you. The phone does not.

Calm technology lives at the edge of awareness. It provides information when you need it. It steps back when you don't. It respects the rhythm of human attention rather than fighting it.

The core principle: technology should convey information without demanding focus.

## Signals Without Storms

One of the clearest examples of calm design is the fax machine light. When it glows, there's a fax. You don't have to do anything about it immediately. It waits in the periphery until you're ready.

Compare this to email. Email arrives with a number. Numbers demand resolution. They sit in your peripheral vision like an open wound. The number goes up, anxiety rises. You check. You respond. You close the loop — and five minutes later the loop opens again.

Calm technology informs without demanding. The difference sounds subtle. Cognitively, it's enormous.

## What This Means for Software We Build

Building calm software requires a different evaluation framework:

Does this feature demand attention, or offer information?
Does this notification add urgency, or provide signal?
Does this interface resolve quickly, or hold you?

These questions lead to different product decisions. Fewer notifications. Simpler flows. Interfaces that complete tasks and close, rather than drawing you deeper.

## The Opportunity

The market for calm software is enormous and underserved. We have built an entire ecosystem of attention-capturing tools. We have almost nothing designed to protect attention.

The people who will pay for calm technology are the ones who have realized what disrupted attention actually costs them. That's a growing group.

Calm technology is not a niche. It may be the most important design direction of the next decade.`,
    tags: ["calm-technology", "intentional-technology", "focus"],
    coverImage: "",
    published: true,
    readingTime: 5,
  },
  {
    title: "Designing Tools That Respect Attention",
    slug: "designing-tools-that-respect-attention",
    excerpt:
      "Attention is not infinite. Every design decision either borrows from it or gives it back. Here's how we think about building software that respects the people who use it.",
    content: `## Attention as a Resource

We don't usually think about attention the way we think about money or time. But it behaves the same way. It's finite. It depletes. It can be spent well or wasted.

The interfaces we design are either drawing from that resource or replenishing it. There is no neutral ground.

Most software draws. The best software gives back — by completing tasks cleanly, by reducing cognitive load, by making the next action obvious and the previous action forgettable.

## The Designer's Responsibility

When you design an interface, you are designing an experience of someone's time and focus. You are choosing what they will notice, what they will ignore, and what anxiety they will carry.

This is not a small responsibility. It is the central one.

The question "is this usable?" is insufficient. A notification is usable. A dark pattern is usable. The real question is: "does this respect the person using it?"

## Principles We Build With

**Clarity before completeness.** A simpler tool that does its job cleanly is worth more than a complete tool that confuses. We would rather ship less and have every inch of it be clear.

**Don't speak unless spoken to.** Features should respond to intent. They should not interrupt, suggest, or nudge unless the user has explicitly asked for that behavior.

**Resolve and close.** Every interaction should have an end. A task completed should feel complete — not like the beginning of a longer engagement.

**Default to silence.** Notifications off by default. Badges off by default. Let users opt into noise rather than opt out.

**Design for depth.** Short sessions of deep work are more valuable than long sessions of distracted interaction. Design for the former.

## What This Looks Like in Practice

These principles sound abstract. In practice they look like:

- A writing tool that hides the word count until you ask for it
- A finance app that summarizes, not alerts
- A reading tool that starts in full-screen silence
- A dashboard that shows what you need, then steps back

It's not about minimalism as an aesthetic. It's about minimalism as respect. Every element we add costs the user something. We should only ask for that payment when what we're offering is genuinely worth it.

## The Test

Before shipping any feature, we ask one question: does this feature help the person think, or does it interrupt the person thinking?

That single question eliminates more than half the features that would otherwise ship.

The rest is just craft.`,
    tags: ["design", "attention", "product-philosophy", "focus"],
    coverImage: "",
    published: true,
    readingTime: 5,
  },
];
