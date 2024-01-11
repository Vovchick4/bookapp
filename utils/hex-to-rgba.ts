export default function hexToRgba(hex: string, opacity: number): string | null {
    // Check if the hex color is valid
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (!hexRegex.test(hex)) {
        console.error('Invalid hex color format');
        return null;
    }

    // Remove the hash character, if present
    hex = hex.replace(/^#/, '');

    // Parse the hex color
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Ensure opacity is within the valid range (0 to 1)
    const validOpacity = Math.min(1, Math.max(0, opacity));

    // Construct the RGBA color
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${validOpacity})`;

    return rgbaColor;
}