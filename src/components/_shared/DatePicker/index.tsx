import {
  DatePicker as MantineDatePicker,
  DatePickerProps,
} from "@mantine/dates";

import "dayjs/locale/pt-br";

function DatePicker(props: any) {
  return (
    <MantineDatePicker {...props} firstDayOfWeek="sunday" locale="pt-br" />
  );
}

export default DatePicker;
