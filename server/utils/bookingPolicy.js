const DAY = 86400000;
function stayDates(arrival, departure) {
  const parse = value => {
    const date = new Date(value);
    if (!Number.isFinite(+date)) throw Object.assign(new Error('INVALID_DATES'), { status: 400 });
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  };
  const start = parse(arrival), end = parse(departure);
  const today = new Date();
  const earliest = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (start < earliest || end <= start || (end - start) / DAY > 90) throw Object.assign(new Error('INVALID_DATES'), { status: 400 });
  return { start: new Date(start), end: new Date(end), days: Array.from({ length: (end - start) / DAY }, (_, i) => new Date(start + i * DAY).toISOString().slice(0, 10)) };
}
function priceForStay(price, nights) { return Math.round((price * nights * 0.9 + 300) * 100) / 100; }
function overlaps(a, b) { return new Date(a.arrivalDate) < new Date(b.departureDate) && new Date(b.arrivalDate) < new Date(a.departureDate); }
module.exports = { stayDates, priceForStay, overlaps };
