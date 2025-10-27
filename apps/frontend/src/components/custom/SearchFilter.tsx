import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  onSearchChange: (searchTerm: string) => void;
}

const SearchFilter = ({ onSearchChange }: SearchFilterProps) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Debounce the search input by 500ms
    const timerId = setTimeout(() => {
      onSearchChange(query);
    }, 500);

    // Cleanup function to clear the timer if the user types again
    return () => {
      clearTimeout(timerId);
    };
  }, [query, onSearchChange]);

  return (
    <div className="mb-4">
      <Input
        placeholder="Search by title, director, or type..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};

export default SearchFilter;