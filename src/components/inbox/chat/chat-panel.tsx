import { MessageItem } from "@/types/inbox";
import { ChatHeader } from "@/components/inbox/chat/chat-header";
import { MessageList } from "@/components/inbox/chat/message-list";
import { ComposerBar} from "@/components/inbox/composer/composer-bar";

type ChatPanelProps = {
  title: string;
  subtitle: string;
  messages: MessageItem[];
  selectedMessageWamid: string | null;
  onSelectMessage: (message: MessageItem) => void;
  onSendMessage: (text: string) => Promise<void>;
  onSendMedia:(file:File,caption?:string)=>Promise<void>;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export function ChatPanel({
  title,
  subtitle,
  messages,
  selectedMessageWamid,
  onSelectMessage,
  onSendMessage,
  onSendMedia,
  isLoading = false,
  isDisabled = false,
}: ChatPanelProps) {
  return (
    <section className="flex h-full flex-col bg-[url('/chat-bg-light.png')] bg-slate-100">
      <ChatHeader title={title} subtitle={subtitle} />

      <div className="flex-1 overflow-auto">
        {isLoading && messages.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">No messages yet.</p>
        ) : (
          <MessageList
            messages={messages}
            selectedMessageWamid={selectedMessageWamid}
            onSelectMessage={onSelectMessage}
          />
        )}
      </div>

      <ComposerBar
      disabled={isDisabled}
      onSendText={onSendMessage}
      onSendMedia={onSendMedia}
      />
    </section>
  );
}
