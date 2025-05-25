import { ChatRequestOptions, Message } from 'ai';
import { Button } from './ui/button';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { useUserMessageId } from '@/hooks/use-user-message-id';

export type MessageEditorProps = {
  message: Message;
  setMode: Dispatch<SetStateAction<'view' | 'edit'>>; 
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
};

export function MessageEditor({
  message,
  setMode,
  setMessages,
  reload,
}: MessageEditorProps) {
  const { userMessageIdFromServer } = useUserMessageId();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [draftContent, setDraftContent] = useState<string>(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftContent(event.target.value);
    adjustHeight();
  };

  const handleDeleteTrailingMessages = async () => {
    try {
      const response = await fetch('/api/messages/delete_trailing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ messageId: userMessageIdFromServer ?? message.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete trailing messages');
      }
    } catch (error) {
      toast.error('Failed to delete trailing messages');
      console.error(error);
    }
  };

  const handleSaveMessage = async () => {
    setIsSubmitting(true);

    const messageId = userMessageIdFromServer ?? message.id;

    if (!messageId) {
      toast.error('Something went wrong, please try again!');
      setIsSubmitting(false);
      return;
    }

    try {
      // First, delete any trailing messages if needed
      await handleDeleteTrailingMessages();

      // Send the update to the server
      const response = await fetch('/api/messages/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          messageId,
          content: draftContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save the message');
      }

      // Get the updated message and update the UI
      const updatedMessage = { ...message, content: draftContent };

      setMessages((messages) => {
        const index = messages.findIndex((m) => m.id === message.id);

        if (index !== -1) {
          return [...messages.slice(0, index), updatedMessage, ...messages.slice(index + 1)];
        }

        return messages;
      });

      setMode('view');
      reload();
      toast.success('Message saved successfully!');
    } catch (error) {
      toast.error('Failed to save the message');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Textarea
        ref={textareaRef}
        className="bg-transparent outline-none overflow-hidden resize-none !text-base rounded-xl w-full"
        value={draftContent}
        onChange={handleInput}
      />

      <div className="flex flex-row gap-2 justify-end">
        <Button
          variant="outline"
          className="h-fit py-2 px-3"
          onClick={() => {
            setMode('view');
          }}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          className="h-fit py-2 px-3"
          disabled={isSubmitting}
          onClick={handleSaveMessage}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
