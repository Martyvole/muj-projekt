import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Beer, Wine, Coffee, Droplet, Calculator,
  Receipt, Download, Percent, Spa
} from 'lucide-react';

// Types
type Villa = 'ohyeah' | 'castle' | 'pool';
type Currency = 'czk' | 'eur';
type PaymentStatus = 'unpaid' | 'paid-cash' | 'paid-card';

interface ItemData {
  priceCZK: number | null;
  priceEUR: number | null;
  category: 'beer' | 'wine' | 'spirits' | 'soft' | 'other';
  quantity: number;
}

// Villa-specific themes
const villaThemes = {
  ohyeah: {
    gradient: 'from-rose-400 to-orange-300',
    accent: 'bg-rose-500',
    button: 'from-rose-500 to-orange-400'
  },
  castle: {
    gradient: 'from-blue-600 to-indigo-500',
    accent: 'bg-blue-600',
    button: 'from-blue-600 to-indigo-500'
  },
  pool: {
    gradient: 'from-green-400 to-emerald-500',
    accent: 'bg-green-500',
    button: 'from-green-500 to-emerald-400'
  }
};

// Inventory data for all villas
const itemsData = {
  ohyeah: {
    "Budvar": { priceCZK: 59, priceEUR: null, category: 'beer', quantity: 30 },
    "Malibu": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 20 },
    "Jack s colou": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 20 },
    "Moscow Mule": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Gin-Tonic": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Mojito": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Prosecco": { priceCZK: 390, priceEUR: null, category: 'wine', quantity: 10 },
    "Pivo sud 30l": { priceCZK: null, priceEUR: 125, category: 'beer', quantity: 2 },
    "Pivo sud 50l": { priceCZK: null, priceEUR: 175, category: 'beer', quantity: 1 },
    "Plyn": { priceCZK: null, priceEUR: 12, category: 'other', quantity: 5 }
  },
  castle: {
    "Budvar": { priceCZK: 59, priceEUR: null, category: 'beer', quantity: 30 },
    "Malibu": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 20 },
    "Jack s colou": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 20 },
    "Moscow Mule": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Gin-Tonic": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Mojito": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Prosecco": { priceCZK: 390, priceEUR: null, category: 'wine', quantity: 10 },
    "Pivo sud 30l": { priceCZK: null, priceEUR: 125, category: 'beer', quantity: 2 },
    "Pivo sud 50l": { priceCZK: null, priceEUR: 175, category: 'beer', quantity: 1 },
    "Plyn": { priceCZK: null, priceEUR: 12, category: 'other', quantity: 5 }
  },
  pool: {
    "Budvar": { priceCZK: 59, priceEUR: null, category: 'beer', quantity: 30 },
    "Coca-Cola": { priceCZK: 32, priceEUR: null, category: 'soft', quantity: 40 },
    "Sprite": { priceCZK: 32, priceEUR: null, category: 'soft', quantity: 40 },
    "Red Bull": { priceCZK: 59, priceEUR: null, category: 'soft', quantity: 20 },
    "Malibu": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Jack s colou": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Moscow Mule": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Gin-Tonic": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Mojito": { priceCZK: 99, priceEUR: null, category: 'spirits', quantity: 15 },
    "Prosecco": { priceCZK: 390, priceEUR: null, category: 'wine', quantity: 8 },
    "Pivo sud 30l": { priceCZK: null, priceEUR: 125, category: 'beer', quantity: 2 },
    "Pivo sud 50l": { priceCZK: null, priceEUR: 175, category: 'beer', quantity: 1 },
    "Plyn": { priceCZK: null, priceEUR: 12, category: 'other', quantity: 5 }
  }
};

// Category Icons component
const CategoryIcon = ({ category, className = "w-6 h-6" }: { category: string; className?: string }) => {
  switch (category) {
    case 'beer': return <Beer className={className} />;
    case 'wine': return <Wine className={className} />;
    case 'spirits': return <Coffee className={className} />;
    case 'soft': return <Droplet className={className} />;
    default: return <Calculator className={className} />;
  }
};

// Mobile-optimized villa selector
const VillaSelector = ({ selectedVilla, onSelect, theme }: {
  selectedVilla: Villa;
  onSelect: (villa: Villa) => void;
  theme: typeof villaThemes[Villa];
}) => {
  const villaNames = {
    ohyeah: "Oh Yeah Villa",
    castle: "The Little Castle",
    pool: "Amazing Pool"
  };

  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {Object.entries(villaNames).map(([key, name]) => (
        <button
          key={key}
          onClick={() => onSelect(key as Villa)}
          className={`p-3 rounded-lg text-sm md:text-base font-medium transition-all
            ${selectedVilla === key ? `${theme.accent} text-white` : 'bg-gray-100 text-gray-700'}
            hover:opacity-90 touch-manipulation`}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

// Mobile-optimized guest details form
const GuestDetails = ({ 
  guests, 
  nights, 
  wellness,
  discount,
  onGuestsChange, 
  onNightsChange,
  onWellnessChange,
  onDiscountChange,
  errors
}: {
  guests: number;
  nights: number;
  wellness: number;
  discount: boolean;
  onGuestsChange: (value: number) => void;
  onNightsChange: (value: number) => void;
  onWellnessChange: (value: number) => void;
  onDiscountChange: (value: boolean) => void;
  errors: Record<string, string>;
}) => (
  <div className="space-y-4 mb-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Guests</label>
        <input
          type="number"
          min={1}
          max={50}
          value={guests}
          onChange={(e) => onGuestsChange(parseInt(e.target.value))}
          className="w-full p-3 border rounded-lg text-lg touch-manipulation"
        />
        {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Nights</label>
        <input
          type="number"
          min={1}
          max={30}
          value={nights}
          onChange={(e) => onNightsChange(parseInt(e.target.value))}
          className="w-full p-3 border rounded-lg text-lg touch-manipulation"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Wellness (€)</label>
        <input
          type="number"
          min={0}
          value={wellness}
          onChange={(e) => onWellnessChange(parseInt(e.target.value))}
          className="w-full p-3 border rounded-lg text-lg touch-manipulation"
        />
      </div>
      <div className="flex items-center">
        <label className="flex items-center space-x-2 cursor-pointer touch-manipulation">
          <input
            type="checkbox"
            checked={discount}
            onChange={(e) => onDiscountChange(e.target.checked)}
            className="w-6 h-6 rounded border-gray-300"
          />
          <span className="text-sm font-medium">10% Discount</span>
        </label>
      </div>
    </div>
  </div>
);

// Mobile-optimized inventory item
const InventoryItem = ({
  name,
  item,
  count,
  onChange,
  currency,
  theme
}: {
  name: string;
  item: ItemData;
  count: number;
  onChange: (value: number) => void;
  currency: Currency;
  theme: typeof villaThemes[Villa];
}) => {
  const formatPrice = (item: ItemData) => {
    if (currency === 'czk' && item.priceCZK) return `${item.priceCZK} Kč`;
    if (currency === 'eur' && item.priceEUR) return `${item.priceEUR} €`;
    if (item.priceCZK) return `${(item.priceCZK / 25).toFixed(2)} €`;
    if (item.priceEUR) return `${(item.priceEUR * 25).toFixed(0)} Kč`;
    return '0';
  };

  return (
    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
      <div className={`w-10 h-10 rounded-full ${theme.accent} text-white flex items-center justify-center`}>
        <CategoryIcon category={item.category} />
      </div>
      <div className="flex-grow">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500">
          {formatPrice(item)} | Stock: {item.quantity}
        </div>
      </div>
      <input
        type="number"
        min={0}
        max={item.quantity}
        value={count}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-20 p-3 border rounded-lg text-lg touch-manipulation"
      />
    </div>
  );
};

// Main component
const MiniBarManagement = () => {
  const [selectedVilla, setSelectedVilla] = useState<Villa>('ohyeah');
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(1);
  const [wellness, setWellness] = useState(0);
  const [currency, setCurrency] = useState<Currency>('czk');
  const [discount, setDiscount] = useState(false);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  
  // Get current theme
  const theme = villaThemes[selectedVilla];

  // Calculate total
  const calculateTotal = useCallback(() => {
    let subtotal = 0;
    const items = itemsData[selectedVilla];
    
    // Add items
    Object.entries(itemCounts).forEach(([itemName, count]) => {
      if (count > 0) {
        const item = items[itemName];
        if (item.priceCZK) {
          subtotal += count * (currency === 'czk' ? item.priceCZK : item.priceCZK / 25);
        }
        if (item.priceEUR) {
          subtotal += count * (currency === 'eur' ? item.priceEUR : item.priceEUR * 25);
        }
      }
    });
    
    // Add wellness
    subtotal += currency === 'eur' ? wellness : wellness * 25;
    
    // Apply discount (except city tax)
    if (discount) {
      subtotal = subtotal * 0.9;
    }
    
    // Add city tax (not discounted)
    const cityTax = guests * nights * 2;
    subtotal += currency === 'eur' ? cityTax : cityTax * 25;
    
    return subtotal;
  }, [selectedVilla, itemCounts, wellness, currency, discount, guests, nights]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-4`}>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            Mini Bar Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <VillaSelector
            selectedVilla={selectedVilla}
            onSelect={setSelectedVilla}
            theme={theme}
          />

          <GuestDetails
            guests={guests}
            nights={nights}
            wellness={wellness}
            discount={discount}
            onGuestsChange={setGuests}
            onNightsChange={setNights}
            onWellnessChange={setWellness}
            onDiscountChange={setDiscount}