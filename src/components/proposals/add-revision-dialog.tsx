
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '../ui/textarea';

const revisionSchema = z.object({
  notes: z.string().min(10, 'Please provide detailed notes for this revision.'),
});

type RevisionFormValues = z.infer<typeof revisionSchema>;

interface AddRevisionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRevision: (notes: string) => void;
}

export function AddRevisionDialog({ isOpen, onOpenChange, onAddRevision }: AddRevisionDialogProps) {
  const form = useForm<RevisionFormValues>({
    resolver: zodResolver(revisionSchema),
    defaultValues: {
      notes: '',
    },
  });

  const onSubmit = (values: RevisionFormValues) => {
    onAddRevision(values.notes);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Revision</DialogTitle>
          <DialogDescription>
            Describe the changes made in this new version of the proposal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-revision-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Revision Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Updated pricing for Service X, adjusted project timeline based on client feedback."
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="add-revision-form">
            Add Revision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
