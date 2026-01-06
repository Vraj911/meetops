import { DotChatbot } from "@/components/chatbot/DotChatbot";

export default function Docs() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
      <nav className="lg:sticky lg:top-20 h-fit space-y-2">
        <h3 className="font-semibold mb-4">Contents</h3>
        {['The Problem', 'How MeetOps Works', "AI's Role", 'Design Principles', 'Integrations', 'API'].map((s) => (
          <a key={s} href={`#${s.toLowerCase().replace(/\s/g, '-')}`} className="block text-sm text-muted-foreground hover:text-foreground">{s}</a>
        ))}
      </nav>
      <div className="lg:col-span-3 space-y-12">
        <section id="the-problem">
          <h1 className="text-3xl font-semibold mb-4">MeetOps Documentation</h1>
          <h2 className="text-xl font-semibold mt-8 mb-3">The Problem</h2>
          <p className="text-muted-foreground">Meetings waste time when actions don't get tracked. MeetOps fixes this by extracting, reviewing, and syncing action items automatically.</p>
        </section>
        <section id="how-meetops-works">
          <h2 className="text-xl font-semibold mb-3">How MeetOps Works</h2>
          <div className="flex items-center gap-4 text-sm font-mono bg-card p-4 rounded-lg border">
            <span>1. Upload</span><span>→</span><span>2. AI Process</span><span>→</span><span>3. Human Review</span><span>→</span><span>4. Sync</span>
          </div>
        </section>
        <section id="ais-role">
          <h2 className="text-xl font-semibold mb-3">AI's Role</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Understands, doesn't execute</li>
            <li>• Provides confidence scores</li>
            <li>• Humans make final decisions</li>
          </ul>
        </section>
        <section id="design-principles">
          <h2 className="text-xl font-semibold mb-3">Design Principles</h2>
          <p className="text-muted-foreground">Calm & trustworthy. Human-in-the-loop. Enterprise-grade.</p>
        </section>
      </div>
    </div>
      <DotChatbot />
    </>
  );
}
