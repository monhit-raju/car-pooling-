import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RideSearchProps {
  onSearch: (criteria: SearchCriteria) => void;
  isLoading?: boolean;
}

export interface SearchCriteria {
  from?: string;
  to?: string;
  date?: Date;
  seats?: number;
}

const RideSearch: React.FC<RideSearchProps> = ({ onSearch, isLoading = false }) => {
  const [criteria, setCriteria] = useState<SearchCriteria>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCriteria(prev => ({
      ...prev,
      [name]: name === 'seats' ? parseInt(value) || undefined : value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setCriteria(prev => ({
      ...prev,
      date
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(criteria);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="from">From</Label>
          <Input
            id="from"
            name="from"
            placeholder="Departure city"
            value={criteria.from || ''}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            name="to"
            placeholder="Destination city"
            value={criteria.to || ''}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !criteria.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {criteria.date ? format(criteria.date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={criteria.date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="seats">Seats</Label>
          <Input
            id="seats"
            name="seats"
            type="number"
            min="1"
            max="6"
            placeholder="Number of seats"
            value={criteria.seats || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search Rides"}
      </Button>
    </form>
  );
};

export default RideSearch;


