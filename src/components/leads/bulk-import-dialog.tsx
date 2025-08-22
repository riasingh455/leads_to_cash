
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import type { Lead, User, StatusUpdate } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { read, utils, writeFile } from 'xlsx';
import { Loader2, Upload, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface BulkImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadsImported: (leads: Lead[]) => void;
  users: User[];
}

// Expected columns in the Excel file
const expectedHeaders = ['name', 'title', 'company', 'address', 'phone', 'email'];

export function BulkImportDialog({ isOpen, onOpenChange, onLeadsImported, users }: BulkImportDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [parsedLeads, setParsedLeads] = useState<Omit<Lead, 'id'>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const worksheet = utils.json_to_sheet([
      { name: 'John Doe', title: 'CEO', company: 'Acme Inc.', address: '123 Main St, Anytown USA', phone: '555-123-4567', email: 'john.doe@acme.com' }
    ]);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Leads Template");
    utils.sheet_add_aoa(worksheet, [expectedHeaders], { origin: "A1" });
    writeFile(workbook, "Lead_Import_Template.xlsx");
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setParsedLeads([]);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const json: any[] = utils.sheet_to_json(worksheet, { header: 1 });

      if (json.length < 2) {
        throw new Error("Spreadsheet is empty or only contains a header row.");
      }

      const headers: string[] = json[0].map((h: any) => String(h).toLowerCase().trim());
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const leadsData: Omit<Lead, 'id'>[] = json.slice(1).map((row: any[], rowIndex) => {
          const leadObject: { [key: string]: any } = {};
          headers.forEach((header, index) => {
              leadObject[header] = row[index];
          });
        
          const initialStatus: StatusUpdate = {
              status: 'Unaware',
              date: new Date().toISOString(),
              notes: 'Lead created via bulk import.',
              updatedBy: 'system',
          };
          
          return {
            title: leadObject.title || 'New Lead from Import',
            company: leadObject.company || 'N/A',
            contact: {
              name: leadObject.name || 'N/A',
              title: leadObject.title || 'N/A',
              email: leadObject.email || '',
              phone: String(leadObject.phone || ''),
            },
            value: 0,
            currency: 'USD',
            score: 50,
            priority: 'Medium',
            columnId: 'col-1',
            status: 'Unaware',
            stage: 'Lead',
            statusHistory: [initialStatus],
            ownerId: users[0].id, // Assign to first user by default
            entryDate: new Date().toISOString(),
            lastContact: new Date().toISOString(),
            nextAction: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'Bulk Import',
            companySize: '11-50',
            industry: 'N/A',
            region: leadObject.address || 'N/A',
            followUpCadence: [],
          };
      });

      setParsedLeads(leadsData);
       toast({
        title: 'File Parsed',
        description: `${leadsData.length} leads found. Review and confirm to import.`,
      });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Parsing File',
        description: error.message || 'An unknown error occurred.',
      });
      setParsedLeads([]);
    } finally {
      setIsLoading(false);
       if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleConfirmImport = () => {
    if (parsedLeads.length > 0) {
      onLeadsImported(parsedLeads as Lead[]);
      onOpenChange(false);
      setParsedLeads([]);
    }
  };
  
  const handleClose = () => {
    setParsedLeads([]);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Import Leads</DialogTitle>
          <DialogDescription>
            Upload an Excel (.xlsx) file with lead information. You can download a template to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto space-y-4 pr-4 -mr-4">
            <div className="flex gap-2">
                <Input 
                    id="file-upload"
                    type="file" 
                    accept=".xlsx"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    ref={fileInputRef}
                    className="flex-grow"
                />
                 <Button variant="outline" onClick={handleDownloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Template
                </Button>
            </div>
            {isLoading && (
                <div className='flex items-center justify-center py-8'>
                    <Loader2 className='h-8 w-8 animate-spin' />
                    <p className='ml-2'>Processing file...</p>
                </div>
            )}
            
            {parsedLeads.length > 0 && (
                <div className='space-y-2'>
                    <h3 className='font-semibold'>Leads Preview</h3>
                    <Alert>
                        <AlertTitle>Review Your Data</AlertTitle>
                        <AlertDescription>
                           This is a preview of the leads found in your file. If it looks correct, click "Confirm Import".
                        </AlertDescription>
                    </Alert>
                    <ScrollArea className='h-72 w-full rounded-md border'>
                        <Table>
                            <TableHeader className='sticky top-0 bg-background'>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {parsedLeads.map((lead, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{lead.contact.name}</TableCell>
                                        <TableCell>{lead.contact.title}</TableCell>
                                        <TableCell>{lead.company}</TableCell>
                                        <TableCell>{lead.region}</TableCell>
                                        <TableCell>{lead.contact.phone}</TableCell>
                                        <TableCell>{lead.contact.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </DialogClose>
            <Button onClick={handleConfirmImport} disabled={parsedLeads.length === 0 || isLoading}>
                Confirm Import ({parsedLeads.length})
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
