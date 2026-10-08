import { t, useLocale } from "../../../../../i18n/locale";
import React from 'react';
import { BookingType } from '../../../../../types/types';
import { Table, TableBody, TableHeader } from '../../../../common/Table';
import BookingTableRow from './BookingTableRow';
type BookingTableProps = {
  bookings: BookingType[];
  roomNumber: string | number;
};
const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  roomNumber
}) => {
  useLocale();
  const headCells = [{
    id: 'bookingId',
    label: 'ID'
  }, {
    id: 'arrivalDate',
    label: 'Дата заїзду'
  }, {
    id: 'departureDate',
    label: 'Дата виїзду'
  }, {
    id: 'guests',
    label: 'Кількість гостей'
  }, {
    id: 'totalPrice',
    label: 'Ціна',
    numeric: true
  }];
  return <>
      <h3 style={{
      margin: 10
    }}>{t("Список бронювань номера №{v0}", {
        v0: roomNumber
      })}</h3>
      <Table size='small' aria-label='purchases'>
        <TableHeader headCells={headCells} />
        <TableBody>
          {bookings.map(bookingRow => <BookingTableRow key={bookingRow._id} row={bookingRow} />)}
        </TableBody>
      </Table>
    </>;
};
export default BookingTable;
