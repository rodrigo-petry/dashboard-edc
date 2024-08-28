export function formatDate(date: any) {
    return (
      [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('/') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
      ].join(':')
    );
}

export function padTo2Digits(num: string) {
    return num.toString().padStart(2, '0');
}
  