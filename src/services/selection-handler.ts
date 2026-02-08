/**
 * @file selection-handler.ts
 * @description Helper to process user selections from DataCard components
 */

/**
 * Format selected items from DataCard into a readable summary
 * This helps the AI understand what the user selected
 */
export function formatSelectionSummary(selectedItems: string[], category: string): string {
  if (!selectedItems || selectedItems.length === 0) {
    return `No ${category} selected`;
  }
  
  if (selectedItems.length === 1) {
    return `Selected: ${selectedItems[0]}`;
  }
  
  const lastItem = selectedItems[selectedItems.length - 1];
  const otherItems = selectedItems.slice(0, -1).join(', ');
  return `Selected: ${otherItems}, and ${lastItem}`;
}

/**
 * Process multiple selections from different categories
 */
export function formatMultipleSelections(
  selections: Record<string, string | string[] | undefined>
): string {
  const parts: string[] = [];
  
  for (const [category, value] of Object.entries(selections)) {
    if (!value) continue;
    
    const displayValue = Array.isArray(value) 
      ? value.join(', ')
      : value;
    
    const categoryLabel = category
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase();
    
    parts.push(`${categoryLabel}: ${displayValue}`);
  }
  
  return parts.join(' | ');
}
