import { useCards } from '@/context/CardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RotateCcw, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { sampleCards, sampleBenefits, defaultSettings } from '@/data/sampleData';

export default function SettingsPage() {
  const { settings, updateSettings } = useCards();
  const [newTag, setNewTag] = useState('');

  function resetData() {
    localStorage.setItem('cc-cards', JSON.stringify(sampleCards));
    localStorage.setItem('cc-benefits', JSON.stringify(sampleBenefits));
    localStorage.setItem('cc-settings', JSON.stringify(defaultSettings));
    window.location.reload();
  }

  function addTag() {
    if (!newTag.trim()) return;
    if (settings.customTags.includes(newTag.trim().toLowerCase())) { toast.error('Tag exists'); return; }
    updateSettings({ ...settings, customTags: [...settings.customTags, newTag.trim().toLowerCase()] });
    setNewTag('');
    toast.success('Tag added');
  }

  function removeTag(tag: string) {
    updateSettings({ ...settings, customTags: settings.customTags.filter(t => t !== tag) });
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your dashboard</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Reminder Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Reminder Window (days before)</Label>
            <Select value={String(settings.reminderDays)} onValueChange={v => updateSettings({...settings, reminderDays: Number(v)})}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={settings.defaultHideBusiness} onCheckedChange={v => updateSettings({...settings, defaultHideBusiness: v})} />
            <Label>Hide business cards by default</Label>
          </div>
          <div>
            <Label>Date Format</Label>
            <Select value={settings.dateFormat} onValueChange={v => updateSettings({...settings, dateFormat: v})}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Custom Tags</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {settings.customTags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button onClick={() => removeTag(tag)}><X className="h-3 w-3" /></button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="New tag..." className="max-w-[200px]"
              onKeyDown={e => e.key === 'Enter' && addTag()} />
            <Button variant="outline" size="sm" onClick={addTag}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Data Management</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={resetData} className="text-destructive">
            <RotateCcw className="h-4 w-4 mr-2" />Reset to Sample Data
          </Button>
          <p className="text-xs text-muted-foreground mt-2">This will replace all your data with sample cards and benefits.</p>
        </CardContent>
      </Card>
    </div>
  );
}
