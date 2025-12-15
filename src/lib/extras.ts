import { extras, type ExtraId, getExtra } from '@/data/extras';

export type ExtraItem = {
  id: ExtraId;
  label: string;
  price: number | null;
};

export type ExtrasSummary = {
  items: ExtraItem[];
  extrasTotal: number;
  hasByAgreement: boolean;
};

/**
 * Calculate extras pricing based on selected extras
 */
export function calcExtras(selectedExtraIds: ExtraId[]): ExtrasSummary {
  const items: ExtraItem[] = [];
  let extrasTotal = 0;
  let hasByAgreement = false;

  for (const extraId of selectedExtraIds) {
    const extra = getExtra(extraId);
    if (!extra) continue;

    let price: number | null = null;

    switch (extra.pricingRule) {
      case 'free':
        price = 0;
        break;

      case 'fixed':
        price = extra.price || null;
        break;

      case 'by_agreement':
        price = null;
        hasByAgreement = true;
        break;
    }

    items.push({
      id: extraId,
      label: extra.label,
      price,
    });

    if (price !== null) {
      extrasTotal += price;
    }
  }

  return {
    items,
    extrasTotal,
    hasByAgreement,
  };
}

/**
 * Format extras for display
 */
export function formatExtrasSummary(summary: ExtrasSummary): string {
  if (summary.items.length === 0) {
    return 'None';
  }

  return summary.items
    .map((item) => {
      if (item.price === null) {
        return `${item.label} (by agreement)`;
      }
      if (item.price === 0) {
        return `${item.label} (free)`;
      }
      return `${item.label} (€${item.price})`;
    })
    .join(', ');
}

