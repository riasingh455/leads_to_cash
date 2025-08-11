'use client';
import React, { useState, useEffect } from 'react';
import { KanbanColumn } from './kanban-column';
import { columns as initialColumns, leads as initialLeads, type Lead, type Column, type User } from '@/lib/data';
import { LeadDetailsDialog } from './lead-details-dialog';
import { AddLeadDialog } from '../leads/add-lead-dialog';
import { users } from '@/lib/data';

export function KanbanBoard({ currentUser }: { currentUser: User }) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    // Filter leads based on user role
    const filteredLeads = currentUser.role === 'Sales Rep'
      ? initialLeads.filter(lead => lead.ownerId === currentUser.id)
      : initialLeads;
    setLeads(filteredLeads);
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
    // Also update the master list
    const leadIndex = initialLeads.findIndex(l => l.id === draggingCardId);
    if(leadIndex !== -1) {
      initialLeads[leadIndex].columnId = columnId;
    }
    setDraggingCardId(null);
  };
  
  const handleCardClick = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
    }
  };

  const handleAddLead = (newLead: Lead) => {
    initialLeads.unshift(newLead);
    setLeads(prev => [newLead, ...prev]);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start">
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
