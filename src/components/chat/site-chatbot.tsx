'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { simpleGeminiChat } from '@/ai/flows/simple-gemini-chat';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function SiteChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Namaste! I am your AI assistant for G V Hallikeri PU college. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await simpleGeminiChat({
        message: userMessage,
        history: messages,
      });
      setMessages([...newMessages, { role: 'model', content: response.reply }]);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "I'm sorry, I'm having trouble connecting right now. Please try again later.";
      setMessages([...newMessages, { role: 'model', content: message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start">
      {isOpen ? (
        <Card className="mb-4 w-[320px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300 rounded-2xl overflow-hidden border-none ring-1 ring-black/5">
          <CardHeader className="p-4 bg-primary text-primary-foreground flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <CardTitle className="text-base font-bold">College Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/20 text-white rounded-full" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 bg-background">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                      m.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none"
                    )}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2 text-sm flex items-center gap-2 text-muted-foreground italic">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2 bg-muted/50 rounded-full px-3 py-1 ring-1 ring-black/5 focus-within:ring-primary/20 transition-all">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow py-0 h-9"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-8 w-8 rounded-full shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full shadow-2xl animate-bounce hover:animate-none bg-primary text-primary-foreground flex items-center justify-center p-0 group overflow-hidden"
          onClick={() => setIsOpen(true)}
        >
          <div className="absolute inset-0 bg-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
