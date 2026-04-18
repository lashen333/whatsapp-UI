// src\components\inbox\chat-thread.tsx
import { MessageItem } from "@/types/inbox";
import { MessageBubble } from "@/components/inbox/message-bubble";
import { SendBox } from "@/components/inbox/send-box";

type ChatThreadProps = {
  title: string;
  subtitle: string;
  messages: MessageItem[];
  selectedMessageWamid: string | null;
  onSelectMessage: (message: MessageItem) => void;
  onSendMessage: (text: string) => Promise<void>;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export function ChatThread({
  title,
  subtitle,
  messages,
  selectedMessageWamid,
  onSelectMessage,
  onSendMessage,
  isLoading = false,
  isDisabled = false,
}: ChatThreadProps) {
  return (
    <section className="flex h-full flex-col bg-white">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex-1 space-y-4 overflow-auto bg-slate-100 p-5">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-slate-500">No messages in this conversation.</p>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isSelected={selectedMessageWamid === message.wamid}
              onSelect={() => onSelectMessage(message)}
            />
          ))
        )}
      </div>

      <SendBox disabled={isDisabled} onSend={onSendMessage} />
    </section>
  );
}