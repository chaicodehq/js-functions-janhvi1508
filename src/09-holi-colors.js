/**
 * 🎨 Holi Color Mixer - Pure Functions
 *
 * Holi ka festival hai! Rang mix karne hain. Lekin PURE FUNCTIONS use
 * karne hain — matlab:
 *   1. Input ko KABHI modify mat karo (no mutation)
 *   2. Same input pe HAMESHA same output aaye
 *   3. Koi side effects nahi (no console.log, no external state changes)
 *
 * Har color object: { name: string, r: number, g: number, b: number }
 *   where r, g, b are 0-255 (RGB values)
 *
 * Functions:
 *
 *   1. mixColors(color1, color2)
 *      - Mix two colors by averaging their RGB values
 *      - New name: `${color1.name}-${color2.name}`
 *      - Round RGB values to integers
 *      - MUST NOT modify color1 or color2
 *      - Agar either color null/invalid, return null
 *
 *   2. adjustBrightness(color, factor)
 *      - Multiply each RGB by factor, clamp to 0-255 range
 *      - Round to integers using Math.round
 *      - Name stays same
 *      - MUST NOT modify original color
 *      - Agar color null or factor not number, return null
 *
 *   3. addToPalette(palette, color)
 *      - Return NEW array with color added at end
 *      - MUST NOT modify original palette array
 *      - Agar palette not array, return [color]
 *      - Agar color null/invalid, return copy of palette
 *
 *   4. removeFromPalette(palette, colorName)
 *      - Return NEW array without the color with that name
 *      - MUST NOT modify original palette
 *      - Agar palette not array, return []
 *
 *   5. mergePalettes(palette1, palette2)
 *      - Merge two palettes into NEW array
 *      - No duplicate names (keep first occurrence)
 *      - MUST NOT modify either original palette
 *      - Agar either not array, treat as empty array
 *
 * Hint: Use spread operator [...arr], Object spread {...obj} to create
 *   copies. NEVER use push, splice, or direct property assignment on inputs.
 *
 * @example
 *   const red = { name: "red", r: 255, g: 0, b: 0 };
 *   const blue = { name: "blue", r: 0, g: 0, b: 255 };
 *   mixColors(red, blue)
 *   // => { name: "red-blue", r: 128, g: 0, b: 128 }
 *   // red and blue objects are UNCHANGED
 */
function isValidColor(color) {
  return color && typeof color.name === "string" && typeof color.r === "number";
}
export function mixColors(color1, color2) {
  if (!isValidColor(color1) || !isValidColor(color2)) {
    return null;
  }
  return {
    name: color1.name + "-" + color2.name,
    r: Math.round((color1.r + color2.r) / 2),
    g: Math.round((color1.g + color2.g) / 2),
    b: Math.round((color1.b + color2.b) / 2),
  };
}

export function adjustBrightness(color, factor) {
  if (!isValidColor(color) || typeof factor !== "number") {
    return null;
  }
  let newR = Math.round(color.r * factor);
  if (newR > 255) newR = 255;
  if (newR < 0) newR = 0;
  let newG = Math.round(color.g * factor);
  if (newG > 255) newG = 255;
  if (newG < 0) newG = 0;
  let newB = Math.round(color.b * factor);
  if (newB > 255) newB = 255;
  if (newB < 0) newB = 0;
  return {
    name: color.name,
    r: newR,
    g: newG,
    b: newB,
  };
}

export function addToPalette(palette, color) {
  if (!Array.isArray(palette)) {
    return isValidColor(color) ? [color] : [];
  }
  if (!isValidColor(color)) {
    return [...palette];
  }
  return [...palette, color];
}

export function removeFromPalette(palette, colorName) {
  if (!Array.isArray(palette)) {
    return [];
  }
  return palette.filter(function (color) {
    return color.name !== colorName;
  });
}

export function mergePalettes(palette1, palette2) {
  const p1 = Array.isArray(palette1) ? palette1 : [];
  const p2 = Array.isArray(palette2) ? palette2 : [];
  const mergedList = [];
  const namesWeHaveSeen = {};
  for (let i = 0; i < p1.length; i++) {
    const currentColor = p1[i];
    if (!namesWeHaveSeen[currentColor.name]) {
      mergedList.push(currentColor);
      namesWeHaveSeen[currentColor.name] = true;
    }
  }
  for (let i = 0; i < p2.length; i++) {
    const currentColor = p2[i];
    if (!namesWeHaveSeen[currentColor.name]) {
      mergedList.push(currentColor);
      namesWeHaveSeen[currentColor.name] = true;
    }
  }
  return mergedList;
}
