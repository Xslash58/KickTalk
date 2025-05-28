import emojiData from "emoji-datasource-apple/emoji.json";

// Group emojis by category
export const emojisByCategory = emojiData.reduce((acc, emoji) => {
  if (!acc[emoji.category]) {
    acc[emoji.category] = [];
  }
  acc[emoji.category].push(emoji);
  return acc;
}, {});

// Get available categories
export const categories = Object.keys(emojisByCategory).sort();

// Helper function to get emoji image URL
export const getEmojiImageUrl = (emoji, size = 64) => {
  return `/emoji-images/${emoji.image}`;
};

// Helper function to convert Unicode to emoji object
export const unicodeToEmoji = (unicode) => {
  // Remove variation selectors and normalize
  const normalized = unicode.replace(/[\uFE0F\u200D]/g, "").toUpperCase();
  return emojiData.find(
    (emoji) => emoji.unified.replace(/-/g, "") === normalized || emoji.non_qualified?.replace(/-/g, "") === normalized,
  );
};

// Helper function to search emojis
export const searchEmojis = (searchTerm, category = null) => {
  let emojis = category ? emojisByCategory[category] || [] : emojiData;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    emojis = emojis.filter(
      (emoji) =>
        emoji.name.toLowerCase().includes(term) ||
        emoji.short_name.toLowerCase().includes(term) ||
        emoji.short_names.some((name) => name.toLowerCase().includes(term)),
    );
  }

  return emojis;
};

// Convert old emoji format to new format
export const convertLegacyEmoji = (legacyEmoji) => {
  // Find matching emoji by character
  const found = emojiData.find((emoji) => {
    // Try to match by Unicode character
    const emojiChar = String.fromCodePoint(...emoji.unified.split("-").map((code) => parseInt(code, 16)));
    return emojiChar === legacyEmoji.char;
  });

  if (found) {
    return {
      id: found.unified,
      name: found.short_name,
      image: found.image,
      platform: "apple",
      category: found.category,
      short_names: found.short_names,
    };
  }

  return null;
};

export default emojiData;
