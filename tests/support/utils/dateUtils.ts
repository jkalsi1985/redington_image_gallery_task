export function getFormattedDate(offsetDays: number): string {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
  
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${month}/${day}/${year}`;
}
  