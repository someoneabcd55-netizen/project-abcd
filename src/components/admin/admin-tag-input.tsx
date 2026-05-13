'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminTagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function AdminTagInput({ value = [], onChange, placeholder = "e.g., Accounting" }: AdminTagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-grow"
        />
        <Button type="button" onClick={addTag} size="sm" className="bg-navy hover:bg-navy/90">
          Add
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="flex items-center gap-1.5 px-3 py-1 bg-muted/50 text-foreground border-none hover:bg-muted"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="hover:text-destructive transition-colors"
            >
              <X size={12} />
            </button>
          </Badge>
        ))}
        {value.length === 0 && (
          <p className="text-[10px] text-muted-foreground italic">No expertise areas added yet.</p>
        )}
      </div>
    </div>
  );
}
