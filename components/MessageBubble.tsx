import { Message } from "@/types";
import {
  Message as AiMessage,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

export default function MessageBubble({
  message,
  personaName,
}: {
  message: Message;
  personaName: string;
}) {
  const isUser = message.role === "user";

  return (
    <AiMessage from={message.role}>
      <MessageContent>
        {!isUser && (
          <p className="text-xs font-semibold text-indigo-500 mb-1">{personaName}</p>
        )}
        <MessageResponse>{message.content}</MessageResponse>
      </MessageContent>
    </AiMessage>
  );
}
