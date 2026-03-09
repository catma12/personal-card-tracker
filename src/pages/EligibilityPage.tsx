import { useMemo, useState } from 'react';
import { useCards } from '@/context/CardContext';
import { knownCards, EligibilityRule, WelcomeOffer } from '@/data/knownCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, ShieldX, ShieldAlert, Info, Gift, TrendingUp } from 'lucide-react';
import { differenceInMonths, parseISO } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type EligibilityStatus = 'eligible' | 'ineligible' | 'warning' | 'unknown';

interface CardEligibility {
  cardName: string;
  issuer: string;
  annualFee: number;
  status: EligibilityStatus;
  reasons: string[];
  rules: EligibilityRule[];
}

export default function EligibilityPage() {
  const { cards } = useCards();
  const [statusFilter, setStatusFilter] = useState<EligibilityStatus | 'all'>('all');
  const [issuerFilter, setIssuerFilter] = useState<string>('all');

  const eligibility = useMemo(() => {
    const now = new Date();
    const results: CardEligibility[] = [];

    for (const known of knownCards) {
      const reasons: string[] = [];
      let status: EligibilityStatus = 'eligible';

      if (!known.eligibilityRules || known.eligibilityRules.length === 0) {
        // No rules known — mark as unknown
        reasons.push('No known eligibility restrictions for this card.');
        results.push({
          cardName: known.name,
          issuer: known.issuer,
          annualFee: known.annualFee,
          status: 'eligible',
          reasons,
          rules: [],
        });
        continue;
      }

      for (const rule of known.eligibilityRules) {
        const conflictNames = rule.conflictCards?.length
          ? rule.conflictCards.map(n => n.toLowerCase())
          : [known.name.toLowerCase()];

        const matchingCards = cards.filter(c =>
          conflictNames.includes(c.name.toLowerCase())
        );

        if (rule.type === 'once-per-lifetime') {
          const everHad = matchingCards.length > 0;
          if (everHad) {
            const gotBonus = matchingCards.some(c => c.signupBonusDate);
            const currentlyHolds = matchingCards.some(c => c.status === 'active');

            if (gotBonus) {
              status = 'ineligible';
              reasons.push(`You previously received the signup bonus on this card. Amex once-per-lifetime rule applies.`);
            } else if (currentlyHolds) {
              status = 'warning';
              reasons.push(`You currently hold this card. Amex typically won't approve a new application for a card you already have.`);
            } else {
              status = 'warning';
              reasons.push(`You previously held this card. If you received a signup bonus, you are ineligible (Amex once-per-lifetime).`);
            }
          }
        }

        if (rule.type === 'same-card-bonus' || rule.type === 'product-family') {
          const cooldown = rule.cooldownMonths || 24;
          const activeConflict = matchingCards.find(c => c.status === 'active');
          if (activeConflict && rule.type === 'product-family') {
            status = 'ineligible';
            reasons.push(`You currently hold "${activeConflict.name}", which is in the same product family.`);
          }

          for (const mc of matchingCards) {
            if (mc.signupBonusDate) {
              const bonusDate = parseISO(mc.signupBonusDate);
              const monthsSince = differenceInMonths(now, bonusDate);
              if (monthsSince < cooldown) {
                status = 'ineligible';
                const remaining = cooldown - monthsSince;
                reasons.push(`Received "${mc.name}" bonus ${monthsSince} months ago. Must wait ${remaining} more month(s) (${cooldown}-month cooldown).`);
              }
            } else if (mc.status === 'active') {
              if (status !== 'ineligible') status = 'warning';
              reasons.push(`You hold "${mc.name}" but have no bonus date recorded. If you received a bonus within ${cooldown} months, you may be ineligible.`);
            }
          }
        }

        if (rule.type === 'velocity') {
          const recentCards = cards.filter(c => {
            const openDate = parseISO(c.openDate);
            return differenceInMonths(now, openDate) < 24 && c.countsToward524;
          });
          if (recentCards.length >= 5 && known.issuer === 'Chase') {
            status = 'ineligible';
            reasons.push(`You are at ${recentCards.length}/24 — over the Chase 5/24 limit.`);
          }
        }
      }

      if (reasons.length === 0 && status === 'eligible') {
        reasons.push('No conflicts found based on your current cards.');
      }

      results.push({
        cardName: known.name,
        issuer: known.issuer,
        annualFee: known.annualFee,
        status,
        reasons,
        rules: known.eligibilityRules,
      });
    }

    const order: Record<EligibilityStatus, number> = { ineligible: 0, warning: 1, eligible: 2, unknown: 3 };
    results.sort((a, b) => order[a.status] - order[b.status]);

    return results;
  }, [cards]);

  const counts = useMemo(() => ({
    eligible: eligibility.filter(e => e.status === 'eligible').length,
    ineligible: eligibility.filter(e => e.status === 'ineligible').length,
    warning: eligibility.filter(e => e.status === 'warning').length,
  }), [eligibility]);

  const issuers = useMemo(() => {
    const set = new Set(eligibility.map(e => e.issuer));
    return Array.from(set).sort();
  }, [eligibility]);

  const filtered = useMemo(() => {
    return eligibility.filter(e => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (issuerFilter !== 'all' && e.issuer !== issuerFilter) return false;
      return true;
    });
  }, [eligibility, statusFilter, issuerFilter]);

  const statusIcon = (s: EligibilityStatus) => {
    switch (s) {
      case 'eligible': return <ShieldCheck className="h-5 w-5 text-success" />;
      case 'ineligible': return <ShieldX className="h-5 w-5 text-destructive" />;
      case 'warning': return <ShieldAlert className="h-5 w-5 text-warning" />;
      default: return <Shield className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const statusBadge = (s: EligibilityStatus) => {
    switch (s) {
      case 'eligible': return <Badge className="status-success">Eligible</Badge>;
      case 'ineligible': return <Badge variant="destructive">Ineligible</Badge>;
      case 'warning': return <Badge className="status-warning">Check Required</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleStatusClick = (status: EligibilityStatus) => {
    setStatusFilter(prev => prev === status ? 'all' : status);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Bonus Eligibility</h1>
        <p className="text-sm text-muted-foreground">
          Check whether you're eligible for signup bonuses based on your current cards and issuer rules
        </p>
      </div>

      {/* Summary — clickable */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className={`stat-card cursor-pointer transition-all ${statusFilter === 'eligible' ? 'ring-2 ring-success' : 'hover:ring-1 hover:ring-success/50'}`}
          onClick={() => handleStatusClick('eligible')}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-success" />
            <div>
              <p className="stat-value text-success">{counts.eligible}</p>
              <p className="stat-label">Eligible</p>
            </div>
          </div>
        </Card>
        <Card
          className={`stat-card cursor-pointer transition-all ${statusFilter === 'warning' ? 'ring-2 ring-warning' : 'hover:ring-1 hover:ring-warning/50'}`}
          onClick={() => handleStatusClick('warning')}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-warning" />
            <div>
              <p className="stat-value text-warning">{counts.warning}</p>
              <p className="stat-label">Needs Review</p>
            </div>
          </div>
        </Card>
        <Card
          className={`stat-card cursor-pointer transition-all ${statusFilter === 'ineligible' ? 'ring-2 ring-destructive' : 'hover:ring-1 hover:ring-destructive/50'}`}
          onClick={() => handleStatusClick('ineligible')}
        >
          <div className="flex items-center gap-3">
            <ShieldX className="h-6 w-6 text-destructive" />
            <div>
              <p className="stat-value text-destructive">{counts.ineligible}</p>
              <p className="stat-label">Ineligible</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={issuerFilter} onValueChange={setIssuerFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Banks</SelectItem>
            {issuers.map(issuer => (
              <SelectItem key={issuer} value={issuer}>{issuer}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(statusFilter !== 'all' || issuerFilter !== 'all') && (
          <button
            className="text-sm text-muted-foreground hover:text-foreground underline"
            onClick={() => { setStatusFilter('all'); setIssuerFilter('all'); }}
          >
            Clear filters
          </button>
        )}
        <span className="text-sm text-muted-foreground ml-auto">
          Showing {filtered.length} of {eligibility.length} cards
        </span>
      </div>

      <Card className="p-1">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Signup Bonus Eligibility by Card
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Eligibility is determined by your current cards, signup bonus dates, and issuer-specific rules (e.g., Chase 48-month Sapphire rule, Amex once-per-lifetime, Citi 48-month rule). Add signup bonus dates to your cards for more accurate results.</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.cardName}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card"
            >
              <div className="mt-0.5">{statusIcon(item.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{item.cardName}</span>
                  <span className="text-xs text-muted-foreground">— {item.issuer}</span>
                  {item.annualFee > 0 && (
                    <span className="text-xs text-muted-foreground">${item.annualFee}/yr</span>
                  )}
                  {statusBadge(item.status)}
                </div>
                <div className="mt-1 space-y-1">
                  {item.reasons.map((reason, i) => (
                    <p key={i} className="text-sm text-muted-foreground">{reason}</p>
                  ))}
                </div>
                {item.rules.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.rules.map((rule, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {rule.type === 'once-per-lifetime' && 'Once Per Lifetime'}
                        {rule.type === 'same-card-bonus' && `${rule.cooldownMonths || 24}mo Cooldown`}
                        {rule.type === 'product-family' && 'Product Family'}
                        {rule.type === 'velocity' && '5/24 Rule'}
                        {rule.type === 'card-count' && 'Card Count Limit'}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No cards match the current filters.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
