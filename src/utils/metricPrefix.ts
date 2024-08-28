const ranges = [
  { divider: 1e18, suffix: "E" },
  { divider: 1e15, suffix: "P" },
  { divider: 1e12, suffix: "T" },
  { divider: 1e9, suffix: "G" },
  { divider: 1e6, suffix: "M" },
  { divider: 1e3, suffix: "k" },
];

export function metricPrefixFormatter(
  value: number,
  maximumFractionDigits: number = 1,
  withPrefix: boolean = true
) {
  const formatter = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits,
  });


  for (let i = 0; i < ranges.length; i += 1) {
    if (value >= ranges[i].divider) {
      return ( withPrefix ?
        formatter.format(value / ranges[i].divider).toString() +
        ranges[i].suffix : formatter.format(value / ranges[i].divider).toString()
      );
    }
  }
  return formatter.format(value).toString();
}
