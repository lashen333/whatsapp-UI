// src\components\inbox\chat\message-list.tsx
import { MessageItem } from "@/types/inbox";
import { MessageBubble } from "@/components/inbox/chat/message-bubble";

type MessageListProps = {
  messages: MessageItem[];
  selectedMessageWamid: string | null;
  onSelectMessage: (message: MessageItem) => void;
};

export function MessageList({
  messages,
  selectedMessageWamid,
  onSelectMessage,
}: MessageListProps) {
  function getReplyPreview(message: MessageItem) {
    if (!message.contextMessageId) return null;

    const original = messages.find(
      (item) => item.wamid === message.contextMessageId
    );

    if (!original) return "Replied to message";

    return original.textBody || original.caption || `[${original.messageType || "message"}]`;
  }

  return (
    <div className="space-y-2 p-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isSelected={selectedMessageWamid === message.wamid}
          onSelect={() => onSelectMessage(message)}
          replyPreviewText={getReplyPreview(message)}
        />
      ))}
    </div>
  );
}
