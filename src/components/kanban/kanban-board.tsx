'use client';
import React, { useState, useEffect } from 'react';
import { KanbanColumn } from './kanban-column';
import { columns as initialColumns, leads as initialLeads, type Lead, type Column, type User } from '@/lib/data';
import { LeadDetailsDialog } from './lead-details-dialog';

export function KanbanBoard({ currentUser }: { currentUser: User }) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    // Filter leads based on user role
    if (currentUser.role === 'Sales Rep') {
      setLeads(initialLeads.filter(lead => lead.ownerId === currentUser.id));
    } else {
      setLeads(initialLeads);
    }
  }, [currentUser]);

  const handleDragStart = (cardId: string) => {
    setDraggingCardId(cardId);
  };

  const handleDrop = (columnId: string) => {
    if (!draggingCardId) return;

    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === draggingCardId ? { ...lead, columnId: columnId } : lead
      )
    );
    setDraggingCardId(null);
  };
  
  const handleCardClick = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            leads={leads.filter((lead) => lead.columnId === column.id)}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onCardClick={handleCardClick}
            isDraggingOver={!!draggingCardId}
            currentUser={currentUser}
          />
        ))}
      </div>
      <LeadDetailsDialog 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onOpenChange={(isOpen) => !isOpen && setSelectedLead(null)} 
        currentUser={currentUser}
      />
    </>
  );
}
