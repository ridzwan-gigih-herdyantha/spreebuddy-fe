import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChatMessage from "@/components/chat/ChatMessage";
import Thinking from "@/components/chat/Thinking";
import ResultsPanel from "@/components/chat/ResultsPanel";
import PromptInput from "@/components/ui/PromptInput";
import { createSession, getSession, sendMessage } from "@/api/chat";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { chatContent } from "@/data/chatPage";

export default function Chat() {
  const content = chatContent;
  const [params, setParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addItem } = useCart();

  const sessionId = params.get("session");
  const [draft, setDraft] = useState(() => {
    const names = params.get("compare");
    return names ? `Compare these products: ${names}` : "";
  });
  const [sent, setSent] = useState(null);
  const endRef = useRef(null);

  const mention = (name) =>
    setDraft((current) => (current ? `${current.trim()} ${name}` : name));

  const session = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getSession(sessionId),
    enabled: Boolean(user && sessionId),
    retry: false,
  });

  const messages = useMemo(
    () => session.data?.data?.messages ?? [],
    [session.data],
  );

  const send = useMutation({
    mutationFn: async (message) => {
      let id = sessionId;
      if (!id) {
        const created = await createSession(message.slice(0, 60));
        id = created.data.id;
        setParams({ session: id }, { replace: true });
      }
      await sendMessage({ id, message });
      return id;
    },
    onMutate: (message) => setSent(message),
    // Keep the echoed message on screen until the refetch carries the real one.
    onSuccess: async (id) => {
      await queryClient.invalidateQueries({ queryKey: ["session", id] });
      setSent(null);
    },
    onError: (_err, message) => {
      setSent(null);
      setDraft(message);
    },
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, sent, send.isPending]);

  const products = useMemo(() => {
    const withProducts = [...messages]
      .reverse()
      .find((message) => message.attachments?.products?.length);
    return withProducts?.attachments?.products ?? [];
  }, [messages]);

  if (!user) {
    return (
      <section className="sb-section text-center">
        <h1 className="sb-h1 mb-2">{content.signedOut.title}</h1>
        <p className="sb-lead sb-measure mx-auto mb-4">
          {content.signedOut.lead}
        </p>
        <Link to="/login" className="btn btn-primary rounded-pill px-4">
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <div className="sb-chat">
      <div className="sb-chat-main">
        <div className="sb-chat-thread">
          {messages.length === 0 && !send.isPending && (
            <div className="text-center py-5">
              <h1 className="sb-h1 mb-2">{content.greeting.title}</h1>
              <p className="sb-lead sb-measure mx-auto mb-0">
                {content.greeting.lead}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onMention={mention}
            />
          ))}

          {sent && (
            <div className="sb-chat-turn is-user">
              <div className="sb-bubble sb-bubble-user">{sent}</div>
            </div>
          )}

          {send.isPending && (
            <div className="sb-chat-turn">
              <Thinking />
            </div>
          )}

          {send.isError && (
            <p className="sb-form-error" role="alert">
              <i className="bi bi-exclamation-triangle-fill" />{" "}
              {send.error.message}
            </p>
          )}

          <div ref={endRef} />
        </div>

        <div className="sb-chat-composer">
          <div className="d-flex flex-wrap gap-2 mb-3">
            {content.quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                className="sb-pill sb-pill-outline"
                disabled={send.isPending}
                onClick={() => send.mutate(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          <PromptInput
            value={draft}
            onChange={setDraft}
            placeholder={content.placeholder}
            disabled={send.isPending}
            onSubmit={(message) => {
              send.mutate(message);
              setDraft("");
            }}
          />
        </div>
      </div>

      <ResultsPanel
        products={products}
        onAddToCart={addItem}
        onMention={mention}
      />
    </div>
  );
}
