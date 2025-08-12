
'use client';
import React, { useState } from 'react';
import { KanbanCard } from './kanban-card';
import type { Column, Lead, User } from '@/lib/data';
import { Button } from '../ui/button';

const INITIAL_VISIBLE_CARDS = 5;
const CARDS_TO_LOAD = 5;

interface KanbanColumnProps {
  column: Column;
  leads: Lead[];
  onDrop: (columnId: string) => void;
  onDragStart: (cardId: string) => void;
  onCardClick: (leadId: string) => void;
  isDraggingOver: boolean;
  currentUser: User;
}

export function KanbanColumn({ column, leads, onDrop, onDragStart, onCardClick, currentUser }: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CARDS);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(column.id);
    setIsOver(false);
  };
  
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + CARDS_TO_LOAD);
  };

  const visibleLeads = leads.slice(0, visibleCount);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col gap-4 rounded-lg transition-colors duration-300 ${isOver ? 'bg-secondary' : 'bg-muted/50'}`}
    >
      <div className="p-4 pb-0">
        <h2 className="text-lg font-semibold font-headline flex justify-between items-center">
          {column.title}
          <span className="text-sm font-normal bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
            {leads.length}
          </span>
        </h2>
      </div>
      <div className="flex flex-col gap-4 p-4 pt-0 min-h-[200px]">
        {visibleLeads.map((lead) => (
          <KanbanCard
            key={lead.id}
            lead={lead}
            onDragStart={onDragStart}
            onClick={onCardClick}
            currentUser={currentUser}
          />
        ))}
        {leads.length > visibleCount && (
            <Button variant="secondary" onClick={handleLoadMore}>
                Load More ({leads.length - visibleCount} hidden)
            </Button>
        )}
      </div>
    </div>
  );
}
