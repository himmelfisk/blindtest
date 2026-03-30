const CATEGORY_EMOJIS: Record<string, string> = {
  Beer: '🍺',
  Wine: '🍷',
  Coffee: '☕',
  Whiskey: '🥃',
  Chocolate: '🍫',
  Cheese: '🧀',
  'Olive Oil': '🫒',
  Tea: '🍵',
  Other: '🧪',
};

export function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category] ?? '🧪';
}
