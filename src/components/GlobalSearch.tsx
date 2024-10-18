import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import theme from '@/styles/theme';

interface SearchResult {
  id: string;
  type: 'case' | 'user';
  title: string;
  subtitle: string;
}

const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setIsSearching(true);
        // In a real application, this would be an API call
        const mockSearch = async () => {
          // Simulating API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          const results: SearchResult[] = [
            { id: '1', type: 'case', title: 'Server Outage', subtitle: 'Open' },
            { id: '2', type: 'case', title: 'Network Issues', subtitle: 'In Progress' },
            { id: '3', type: 'user', title: 'John Doe', subtitle: 'Staff' },
            { id: '4', type: 'user', title: 'Jane Smith', subtitle: 'Manager' },
          ].filter(result => 
            result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
          );

          setSearchResults(results);
          setIsSearching(false);
        };

        mockSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search cases and users..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            borderColor: theme.colors.textLight,
            focusRingColor: theme.colors.primary,
          }}
        />
        <Search className="absolute left-3 top-2.5" size={18} style={{ color: theme.colors.textLight }} />
      </div>
      {searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg" style={{ borderColor: theme.colors.textLight }}>
          {isSearching ? (
            <div className="p-4 text-center" style={{ color: theme.colors.textLight }}>Searching...</div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((result) => (
                <li key={result.id} className="border-b last:border-b-0" style={{ borderColor: theme.colors.textLight }}>
                  <Link
                    href={result.type === 'case' ? `/cases/${result.id}` : `/users/${result.id}`}
                    className="flex items-center p-4 hover:bg-gray-50 transition duration-200"
                  >
                    <div>
                      <div className="font-medium" style={{ color: theme.colors.text }}>{result.title}</div>
                      <div className="text-sm" style={{ color: theme.colors.textLight }}>{result.subtitle}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center" style={{ color: theme.colors.textLight }}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;