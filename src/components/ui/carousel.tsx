import { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { currencies } from '@/data/currencies';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';

interface CurrencyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = 'USD',
  error = false,
}: CurrencyInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCurrencies = useMemo(() => {
    if (!inputValue) return currencies.slice(0, 10);
    const search = inputValue.toUpperCase();
    return currencies.filter(
      c => c.code.includes(search) || c.name.toUpperCase().includes(search)
    ).slice(0, 10);
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase().slice(0, 3);
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelect = (code: string) => {
    setInputValue(code);
    onChange(code);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter' && filteredCurrencies.length > 0) {
      handleSelect(filteredCurrencies[0].code);
    }
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={3}
              className={cn(
                'font-mono text-lg h-12 text-center uppercase tracking-widest pr-8',
                'transition-colors duration-200',
                error && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            <ChevronDown
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent className="z-[99999] mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden min-w-[8rem]">
            {filteredCurrencies.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto py-1">
                {filteredCurrencies.map((currency) => (
                  <li key={currency.code}>
                    <DropdownMenuItem
                      onClick={() => handleSelect(currency.code)}
                      className={cn(
                        "w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-accent transition-colors",
                        currency.code === value && "bg-accent"
                      )}
                    >
                      <span className="font-mono font-medium">{currency.code}</span>
                      <span className="text-sm text-muted-foreground truncate">
                        {currency.name}
                      </span>
                    </DropdownMenuItem>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                No currencies found
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
}
