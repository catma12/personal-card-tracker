import { useState, useMemo } from 'react';
import { useCards } from '@/context/CardContext';
import { CreditCard as CreditCardType, CardNetwork, CardType, CardStatus, CardCategory, CardDecision } from '@/types/cards';
import { formatDate, getMonthName } from '@/lib/dateUtils';
import { knownCards, findKnownCard, KnownCardInfo } from '@/data/knownCards';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Plus, Pencil, Trash2, Search, Download, ChevronsUpDown, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const emptyCard: Omit<CreditCardType, 'id'> = {
  name: '', issuer: '', network: 'Visa', cardType: 'personal', status: 'active',
  openDate: new Date().toISOString().split('T')[0], annualFee: 0, annualFeeMonth: 1,
  countsToward524: true, category: 'other', decision: 'undecided', tags: [], notes: '',
};

export default function MyCards() {
  const { cards, addCard, updateCard, deleteCard, addBenefit } = useCards();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | CardStatus>('all');
  const [filterType, setFilterType] = useState<'all' | CardType>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CreditCardType | null>(null);
  const [form, setForm] = useState<Omit<CreditCardType, 'id'>>(emptyCard);
  const [selectedKnown, setSelectedKnown] = useState<string>('');
  const [quickSelectOpen, setQuickSelectOpen] = useState(false);
  const filtered = useMemo(() => {
    return cards.filter(c => {
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      if (filterType !== 'all' && c.cardType !== filterType) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.issuer.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [cards, search, filterStatus, filterType]);

  function prefillFromKnown(cardName: string) {
    const known = findKnownCard(cardName);
    if (known) {
      setForm({
        ...emptyCard,
        name: known.name,
        issuer: known.issuer,
        network: known.network,
        annualFee: known.annualFee,
        category: known.category,
        openDate: form.openDate,
      });
    }
    setSelectedKnown(cardName);
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyCard);
    setSelectedKnown('');
    setDialogOpen(true);
  }
  function openEdit(card: CreditCardType) {
    setEditing(card);
    setForm({ ...card });
    setSelectedKnown('');
    setDialogOpen(true);
  }
  function handleSave() {
    if (!form.name || !form.issuer) { toast.error('Name and issuer required'); return; }
    if (editing) {
      updateCard({ ...form, id: editing.id });
      toast.success('Card updated');
    } else {
      const newId = crypto.randomUUID();
      addCard({ ...form, id: newId });
      // Auto-add benefits from known cards database
      const known = findKnownCard(form.name);
      if (known && known.benefits.length > 0) {
        known.benefits.forEach(kb => {
          addBenefit({
            id: crypto.randomUUID(),
            cardId: newId,
            name: kb.name,
            creditType: kb.creditType,
            valueType: kb.valueType,
            totalAmount: kb.totalAmount,
            amountUsed: 0,
            notes: kb.notes,
          });
        });
        toast.success(`Card added with ${known.benefits.length} benefits`);
      } else {
        toast.success('Card added');
      }
    }
    setDialogOpen(false);
  }
  function handleDelete(id: string) {
    deleteCard(id);
    toast.success('Card deleted');
  }
  function exportCSV() {
    const headers = ['Name', 'Issuer', 'Network', 'Type', 'Status', 'Open Date', 'Annual Fee', 'Fee Month', 'Category', 'Decision', 'Notes'];
    const rows = cards.map(c => [c.name, c.issuer, c.network, c.cardType, c.status, c.openDate, c.annualFee, c.annualFeeMonth, c.category, c.decision, c.notes]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'cards.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const decisionColor = (d: CardDecision) => {
    switch(d) {
      case 'keep': return 'status-success';
      case 'downgrade': return 'status-warning';
      case 'cancel': return 'status-danger';
      default: return 'status-info';
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Cards</h1>
          <p className="text-sm text-muted-foreground">{cards.length} cards total · {cards.filter(c => c.status === 'active').length} active</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-1" />Export</Button>
          <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Add Card</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cards..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={v => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={v => setFilterType(v as typeof filterType)}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card</TableHead>
                  <TableHead>Issuer</TableHead>
                  
                  <TableHead>Type</TableHead>
                  <TableHead>Opened</TableHead>
                  <TableHead>Annual Fee</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(card => (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">{card.name}</TableCell>
                    <TableCell>{card.issuer}</TableCell>
                    
                    <TableCell className="capitalize">{card.cardType}</TableCell>
                    <TableCell className="font-mono text-xs">{formatDate(card.openDate, 'MMM yyyy')}</TableCell>
                    <TableCell>${card.annualFee}{card.annualFee > 0 && <span className="text-xs text-muted-foreground ml-1">/{getMonthName(card.annualFeeMonth).slice(0,3)}</span>}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(card)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(card.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No cards found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Card' : 'Add Card'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {/* Card picker for pre-fill (only when adding) */}
            {!editing && (
              <div>
                <Label>Quick Select (auto-fills details)</Label>
                <Popover open={quickSelectOpen} onOpenChange={setQuickSelectOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={quickSelectOpen}
                      className="w-full justify-between font-normal"
                    >
                      {selectedKnown
                        ? `${selectedKnown} — ${findKnownCard(selectedKnown)?.issuer} ($${findKnownCard(selectedKnown)?.annualFee}/yr)`
                        : "Search for a card..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[460px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search cards by name or issuer..." />
                      <CommandList>
                        <CommandEmpty>No card found.</CommandEmpty>
                        <CommandGroup>
                          {knownCards.map((c) => (
                            <CommandItem
                              key={c.name}
                              value={`${c.name} ${c.issuer}`}
                              onSelect={() => {
                                prefillFromKnown(c.name);
                                setQuickSelectOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", selectedKnown === c.name ? "opacity-100" : "opacity-0")} />
                              <span className="flex-1">{c.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">{c.issuer} · ${c.annualFee}/yr</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Card Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><Label>Issuer</Label><Input value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Network</Label>
                <Select value={form.network} onValueChange={v => setForm({...form, network: v as CardNetwork})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['Visa','Mastercard','Amex','Discover'] as const).map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.cardType} onValueChange={v => setForm({...form, cardType: v as CardType})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v as CardStatus})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Open Date</Label><Input type="date" value={form.openDate} onChange={e => setForm({...form, openDate: e.target.value})} /></div>
              <div><Label>Product Change Date</Label><Input type="date" value={form.productChangeDate || ''} onChange={e => setForm({...form, productChangeDate: e.target.value || undefined})} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Annual Fee ($)</Label><Input type="number" value={form.annualFee} onChange={e => setForm({...form, annualFee: Number(e.target.value)})} /></div>
              <div>
                <Label>Fee Month</Label>
                <Select value={String(form.annualFeeMonth)} onValueChange={v => setForm({...form, annualFeeMonth: Number(v)})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({length:12},(_,i)=>i+1).map(m => <SelectItem key={m} value={String(m)}>{getMonthName(m)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({...form, category: v as CardCategory})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['travel','hotel','airline','cashback','business','other'] as const).map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Decision</Label>
                <Select value={form.decision} onValueChange={v => setForm({...form, decision: v as CardDecision})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['keep','downgrade','cancel','undecided'] as const).map(d => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Signup Bonus Date</Label><Input type="date" value={form.signupBonusDate || ''} onChange={e => setForm({...form, signupBonusDate: e.target.value || undefined})} /></div>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Add Card'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
