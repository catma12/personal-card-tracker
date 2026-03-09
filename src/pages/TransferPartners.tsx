import { useState, useMemo } from 'react';
import { transferPartnersData } from '@/data/transferPartners';
import { useCards } from '@/context/CardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plane, Hotel, Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function TransferPartners() {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const { cards } = useCards();

  const userIssuers = useMemo(() => {
    const issuers = new Set(cards.map(c => c.issuer));
    return issuers;
  }, [cards]);

  const displayedIssuers = useMemo(() => {
    if (showAll || userIssuers.size === 0) return transferPartnersData;
    return transferPartnersData.filter(ip => userIssuers.has(ip.issuer));
  }, [showAll, userIssuers]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transfer Partners</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Points transfer partners and ratios by issuer program
        </p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="show-all" checked={showAll} onCheckedChange={setShowAll} />
          <Label htmlFor="show-all" className="text-sm text-muted-foreground cursor-pointer">
            Show all issuers
          </Label>
        </div>
      </div>

      {displayedIssuers.length > 0 ? (
        <Tabs defaultValue={displayedIssuers[0].issuer} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            {displayedIssuers.map((issuer) => (
              <TabsTrigger key={issuer.issuer} value={issuer.issuer}>
                {issuer.issuer}
              </TabsTrigger>
            ))}
          </TabsList>

          {displayedIssuers.map((issuer) => {
            const filtered = issuer.partners.filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase())
            );
            const airlines = filtered.filter((p) => p.type === 'airline');
            const hotels = filtered.filter((p) => p.type === 'hotel');

            return (
              <TabsContent key={issuer.issuer} value={issuer.issuer}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {issuer.program}
                      <Badge variant="secondary" className="font-normal text-xs">
                        {issuer.partners.length} partners
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {airlines.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
                          <Plane className="h-4 w-4" /> Airlines
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Partner</TableHead>
                              <TableHead className="text-right w-[100px]">Ratio</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {airlines.map((p) => (
                              <TableRow key={p.name}>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell className="text-right">
                                  <Badge variant="outline">{p.ratio}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {hotels.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
                          <Hotel className="h-4 w-4" /> Hotels
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Partner</TableHead>
                              <TableHead className="text-right w-[100px]">Ratio</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {hotels.map((p) => (
                              <TableRow key={p.name}>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell className="text-right">
                                  <Badge variant="outline">{p.ratio}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {filtered.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No partners match your search.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      ) : (
        <p className="text-muted-foreground">
          {userIssuers.size === 0
            ? 'No transfer partner data available.'
            : 'None of your card issuers have transfer partners. Toggle "Show all issuers" to see all partners.'}
        </p>
      )}
    </div>
  );
}