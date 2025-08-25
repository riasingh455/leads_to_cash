
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
import { read, utils } from 'xlsx';
import { Loader2, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface BulkImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadsImported: (leads: Lead[]) => void;
  users: User[];
}

// Expected columns in the CSV file (for parsing logic - case-insensitive)
const expectedHeaders = ['name', 'title', 'company', 'address', 'phone', 'email'];
// Headers for the downloadable template
const templateHeaders = ['Name', 'Title', 'Company', 'Address', 'Phone', 'Email'];


export function BulkImportDialog({ isOpen, onOpenChange, onLeadsImported, users }: BulkImportDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [parsedLeads, setParsedLeads] = useState<Omit<Lead, 'id'>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + templateHeaders.join(",") + "\n" + "John Doe,CEO,\"Acme, Inc.\",\"123 Main St, Anytown USA\",555-123-4567,john.doe@acme.com";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Lead_Import_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setParsedLeads([]);
    
    try {
      const text = await file.text();
      const workbook = read(text, { type: 'string', raw: true });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const json: any[] = utils.sheet_to_json(worksheet, { header: 1 });

      if (json.length < 2) {
        throw new Error("CSV file is empty or only contains a header row.");
      }

      const headers: string[] = json[0].map((h: any) => String(h).toLowerCase().trim());
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }
      
      const headerMap = headers.reduce((acc, header, index) => {
        acc[header] = index;
        return acc;
      }, {} as {[key: string]: number});

      const leadsData: Omit<Lead, 'id'>[] = json.slice(1).map((row: any[], rowIndex) => {
          if (row.every(cell => !cell)) return null; // Skip empty rows
          
          const initialStatus: StatusUpdate = {
              status: 'Unaware',
              date: new Date().toISOString(),
              notes: 'Lead created via bulk import.',
              updatedBy: 'system',
          };
          
          return {
            title: row[headerMap['title']] || 'New Lead from Import',
            company: row[headerMap['company']] || 'N/A',
            contact: {
              name: row[headerMap['name']] || 'N/A',
              title: row[headerMap['title']] || 'N/A',
              email: row[headerMap['email']] || '',
              phone: String(row[headerMap['phone']] || ''),
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
            region: row[headerMap['address']] || 'N/A',
            followUpCadence: [],
          };
      }).filter(Boolean) as Omit<Lead, 'id'>[];

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
            Upload a CSV (.csv) file with lead information. You can download a template to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto space-y-4 pr-4 -mr-4">
            <div className="flex gap-2">
                <Input 
                    id="file-upload"
                    type="file" 
                    accept=".csv"
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
