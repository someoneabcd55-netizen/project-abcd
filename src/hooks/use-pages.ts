'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { Page } from '@/firebase/services/pages';

export function usePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { firestore } = useFirebase();

  useEffect(() => {
    if (!firestore) {
        setIsLoading(false); // Can't load if firestore isn't available
        return;
    }

    const q = query(collection(firestore, "pages"), orderBy("order_position"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
      // Only show visible pages in the hook used by the public site header
      setPages(pagesData.filter(p => p.visible));
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching pages:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);

  return { pages, isLoading };
}
