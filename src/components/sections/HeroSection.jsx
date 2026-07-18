import { Fragment } from "react";
import Badge from "@/components/ui/Badge";
import Chip from "@/components/ui/Chip";
import PromptInput from "@/components/ui/PromptInput";
import ChatPreview from "@/components/ui/ChatPreview";
import { heroContent, chatPreview } from "@/data/home";

export default function HeroSection({
  content = heroContent,
  chat = chatPreview,
  onAsk,
}) {
  const { badge, title, lead, placeholder, suggestions } = content;

  return (
    <section className="sb-gradient-hero sb-section">
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <Badge className="mb-4">
            <i className="bi bi-stars" /> {badge}
          </Badge>

          <h1 className="sb-display mb-3">
            {title.map((line, i) => (
              <Fragment key={i}>
                {line}
                {i < title.length - 1 && <br />}
              </Fragment>
            ))}
          </h1>

          <p className="sb-lead mb-4">{lead}</p>

          <PromptInput onSubmit={onAsk} placeholder={placeholder} />

          <div className="d-flex flex-wrap gap-2 mt-3">
            {suggestions.map((s) => (
              <Chip key={s.label} onClick={() => onAsk?.(s.label)}>
                <i className={`bi ${s.icon}`} /> {s.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="col-lg-6">
          <ChatPreview data={chat} />
        </div>
      </div>
    </section>
  );
}
