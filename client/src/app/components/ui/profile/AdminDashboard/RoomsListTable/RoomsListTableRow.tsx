import { t, useLocale, formatMoney } from "../../../../../i18n/locale";
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse, IconButton, TableCell, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBookingsByRoomId } from '../../../../../store/bookings';
import { RoomType } from '../../../../../types/types';
import Chip from '../../../../common/Chip/Chip';
import Tooltip from '../../../../common/Tooltip';
import RoomEditModal from '../../../modals/RoomEditModal';
import BookingTable from '../BookingTable/BookingTable';
type RoomsListTableRowProps = {
  row: RoomType;
};
const RoomsListTableRow: React.FC<RoomsListTableRowProps> = ({
  row
}) => {
  useLocale();
  const [open, setOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const bookings = useSelector(getBookingsByRoomId(row._id));
  useEffect(() => {
    if (bookings.length === 0) {
      setOpen(false);
    }
  }, [bookings]);
  return <>
      <TableRow sx={{
      '& > *': {
        borderBottom: 'unset'
      }
    }}>
        <TableCell component='th' scope='row'>
          <Link to={`/rooms/${row._id}`}>{row.roomNumber}</Link>
        </TableCell>
        <TableCell>{t(row.type || "")}</TableCell>
        <TableCell align='right'>{row.rate}</TableCell>
        <TableCell align='right'>{formatMoney(row.price)}</TableCell>
        <TableCell align='right'>
          {bookings.length > 0 ? <>
              <Chip label={t("Заброньовано")} color='error' onMouseDown={e => {
            e.stopPropagation();
          }} onDelete={() => setOpen(!open)} deleteIcon={<Tooltip title={t("Докладніше")} disableInteractive>
                    <IconButton aria-label={t("Докладніше")} size='small'>
                      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </Tooltip>} />
            </> : <Chip label={t("Вільний")} color='success' />}
        </TableCell>
        <TableCell align='right'>
          <Tooltip title={t("Редагувати номер")} disableInteractive={true}>
            <IconButton aria-label={t("Редагувати номер")} size='small' color='primary' onClick={() => setShowEditModal(true)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{
        padding: 0
      }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <BookingTable bookings={bookings} roomNumber={row.roomNumber} />
          </Collapse>
        </TableCell>
      </TableRow>
      {showEditModal && <RoomEditModal open={showEditModal} onClose={() => setShowEditModal(false)} roomId={row._id} />}
    </>;
};
export default RoomsListTableRow;
