import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChatMessage from "@/components/chat/ChatMessage";
import Thinking from "@/components/chat/Thinking";
import ResultsPanel from "@/components/chat/ResultsPanel";
import PromptInput from "@/components/ui/PromptInput";
import QuickReplies from "@/components/chat/QuickReplies";
import { createSession, getSession, sendMessage } from "@/api/chat";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { chatContent, quickRepliesFor } from "@/data/chatPage";
import { previousRoute } from "@/utils/routeHistory";

// While a turn is in flight the thread is polled, so a reply that was saved but
// whose response never came back still reaches the screen.
const POLL_MS = 4000;

export default function Chat() {
  const content = chatContent;
  const [params, setParams] = useSearchParams();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();

  const sessionId = params.get("session");
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(null);
  const [threadSize, setThreadSize] = useState(0);
  const endRef = useRef(null);

  const [handoff] = useState(() => {
    const names = params.get("compare");
    if (names) return `Compare these products: ${names}`;
    return params.get("ask") ?? "";
  });
  const handedOff = useRef(false);

  // Captured on arrival: later navigation inside the chat must not change the
  // openers under the visitor.
  const [replies] = useState(() => quickRepliesFor(previousRoute(pathname)));

  const mention = (name) =>
    setDraft((current) => (current ? `${current.trim()} ${name}` : name));

  const session = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getSession(sessionId),
    enabled: Boolean(user && sessionId),
    retry: false,
    refetchInterval: sent ? POLL_MS : false,
  });

  const messages = useMemo(
    () => session.data?.data?.messages ?? [],
    [session.data],
  );

  // A turn saves the question and its answer together, so the thread growing is
  // what says the turn is done — not the request still being open. Counting
  // rather than matching text also survives sending the same words twice.
  const awaitingReply = sent !== null && messages.length <= threadSize;

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
    onMutate: (message) => {
      setThreadSize(messages.length);
      setSent(message);
    },
    // Keep the echoed message on screen until the refetch carries the real one.
    onSuccess: async (id) => {
      await queryClient.invalidateQueries({ queryKey: ["session", id] });
      setSent(null);
    },
    onError: async (err, message) => {
      setSent(null);
      await queryClient.invalidateQueries({ queryKey: ["session"] });

      // A lost response does not mean a lost message: if the thread grew, the
      // turn worked and there is nothing to apologise for.
      const delivered = queryClient
        .getQueriesData({ queryKey: ["session"] })
        .some(([, data]) => (data?.data?.messages ?? []).length > threadSize);
      if (delivered) return;

      if (err?.timedOut) {
        toast.error(content.sendTimedOut);
        return;
      }

      setDraft(message);
      toast.error(err?.message ?? content.sendFailed);
    },
  });

  const runSend = send.mutate;

  useEffect(() => {
    if (!handoff || !user || handedOff.current) return;
    handedOff.current = true;

    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete("ask");
        next.delete("compare");
        return next;
      },
      { replace: true },
    );
    runSend(handoff);
  }, [handoff, user, runSend, setParams]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, awaitingReply]);

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
          {messages.length === 0 && !awaitingReply && (
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

          {awaitingReply && (
            <div className="sb-chat-turn is-user">
              <div className="sb-bubble sb-bubble-user">{sent}</div>
            </div>
          )}

          {awaitingReply && (
            <div className="sb-chat-turn">
              <Thinking />
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div className="sb-chat-composer">
          <QuickReplies
            replies={replies}
            label={content.quickChat}
            collapsed={messages.length > 0}
            disabled={awaitingReply}
            onPick={(reply) => send.mutate(reply)}
          />

          <PromptInput
            value={draft}
            onChange={setDraft}
            placeholder={content.placeholder}
            disabled={awaitingReply}
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
