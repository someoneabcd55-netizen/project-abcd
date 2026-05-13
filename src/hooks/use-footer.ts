'use client';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { FooterContent } from '@/firebase/services/footer';

export function useFooterContent() {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { firestore } = useFirebase();

  useEffect(() => {
    if (!firestore) {
        setIsLoading(false);
        return;
    }
    const footerDocRef = doc(firestore, "footer_content/main");
    
    const unsubFooter = onSnapshot(footerDocRef, (doc) => {
        setContent(doc.exists() ? doc.data() as FooterContent : null);
        setIsLoading(false);
    }, (error) => {
        console.error("Failed to fetch footer content:", error);
        setIsLoading(false);
    });
    
    return () => unsubFooter();
  }, [firestore]);

  return { content, isLoading };
}

