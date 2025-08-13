
'use client';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Lead, User } from '@/lib/data';
import { users } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { Target } from 'lucide-react';

interface KanbanCardProps {
  lead: Lead;
  onDragStart: (cardId: string) => void;
  onClick: (leadId: string) => void;
  currentUser: User;
}

export function KanbanCard({ lead, onDragStart, onClick, currentUser }: KanbanCardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('cardId', lead.id);
    onDragStart(lead.id);
  };

  const owner = users.find(u => u.id === lead.ownerId);

  const getScoreColor = (score: number) => {
    if (score > 75) return 'bg-green-500';
    if (score > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const canDrag = currentUser.role === 'Admin' || currentUser.id === lead.ownerId;

  return (
    <Card
      draggable={canDrag}
      onDragStart={handleDragStart}
      onClick={() => onClick(lead.id)}
      className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow duration-200"
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold font-headline truncate">{lead.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="font-bold text-lg">{lead.score}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{lead.company}</p>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getScoreColor(lead.score)}`}
            style={{ width: `${lead.score}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Lead Score</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          {owner && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={owner.avatar} alt={owner.name}/>
              <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(lead.lastContact), { addSuffix: true })}
          </span>
        </div>
        <Badge variant={lead.priority === 'High' ? 'destructive' : 'secondary'}>{lead.priority}</Badge>
      </CardFooter>
    </Card>
  );
}
