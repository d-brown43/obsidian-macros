const formatDatetimeApi = () => {
  const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
    formatMatcher: 'best fit',
    day: 'numeric',
    month: 'long',
    minute: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    weekday: 'short',
  });

  return {
    formatDatetime: (date: Date): string => {
      return dateTimeFormat.format(date);
    },
  };
};

export type FormatDatetime = ReturnType<typeof formatDatetimeApi>;

export default formatDatetimeApi;
