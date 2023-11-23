export function generateColor(index, saturation = 50, lightness = 50) {
    let hue = (index * (360 / 10)) % 360;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
