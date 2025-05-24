"use client"

import styles from "./search.module.css"
import type React from "react"
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { api } from './../../services/api'; // Adjust the import path as needed

interface SearchProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearchResults?: (results: any[]) => void
  placeholder?: string
  modelName: string // Required to know which model to search
  debounceDelay?: number
}


// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };

  return debounced as T & { cancel: () => void };
}

function Search({ 
  value, 
  onChange, 
  onSearchResults,
  placeholder, 
  modelName,
  debounceDelay = 400 
}: SearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perform the search
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      // Don't call onSearchResults with empty array
      // Let the parent component handle showing all courses
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Use searchModel (POST method) which has csrf_exempt
      const response = await api.searchModel(modelName, query);
      onSearchResults?.(response.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      onSearchResults?.([]);
    } finally {
      setIsSearching(false);
    }
  }, [modelName, onSearchResults]);

  // Create debounced search function
  const debouncedSearch = useMemo(() => {
    console.log('Creating debounced search function');
    return debounce(performSearch, debounceDelay);
  }, [performSearch, debounceDelay]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('🔍 Input changed to:', newValue);
    setSearchTerm(newValue);
    
    // Call the parent's onChange if provided
    onChange?.(e);
    
    // Cancel any pending search
    debouncedSearch.cancel();
    
    // Trigger debounced search only if there's text
    if (newValue.trim()) {
      console.log('📝 Triggering debounced search...');
      debouncedSearch(newValue);
    }
  }, [onChange, debouncedSearch]);

  // Update internal state if external value changes
  useEffect(() => {
    if (value !== undefined && value !== searchTerm) {
      setSearchTerm(value);
    }
  }, [value, searchTerm]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <>
      <div className={styles.group}>
        <svg className={styles.icon} aria-hidden="true" viewBox="0 0 24 24">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
          </g>
        </svg>
        <input 
          placeholder={placeholder || t('header.search')} 
          type="search" 
          className={styles.input} 
          value={searchTerm} 
          onChange={handleInputChange}
          aria-label="Search"
          aria-busy={isSearching}
        />
        {isSearching && (
          <span className={styles.loadingIndicator} aria-live="polite">
            Searching...
          </span>
        )}
      </div>
      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
    </>
  )
}

export default Search