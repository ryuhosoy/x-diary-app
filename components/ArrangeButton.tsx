import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArrangeButtonProps {
  content: string;
  onArrange: (arrangedContent: string) => void;
  className?: string;
}

export function ArrangeButton({
  content,
  onArrange,
  className,
}: ArrangeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleArrange = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/arrange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("アレンジに失敗しました");
      }

      const data = await response.json();
      onArrange(data.content);
    } catch (error) {
      console.error("アレンジエラー:", error);
      alert("Failed to arrange post content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleArrange}
      disabled={isLoading}
      className={cn("w-full", className)}
    >
      {isLoading ? "Arranging..." : "Arrange with AI"}
    </Button>
  );
} 