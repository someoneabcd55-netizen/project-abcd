import { cn } from "@/lib/utils";

export function TextBlock({ title, content }: { title?: string, content: string }) {
    if (!content) return null;
    
    // A simple markdown to HTML converter
    const toHtml = (text: string) => {
        return text
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6">$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-primary hover:underline">$1</a>')
            .split('\n').map(line => line.trim() ? `<p>${line}</p>` : '<br/>').join('');
    }

    return (
        <div className={cn("container mx-auto px-4 py-8 md:px-6 lg:py-12")}>
            {title && <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>}
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: toHtml(content) }} />
        </div>
    );
}
