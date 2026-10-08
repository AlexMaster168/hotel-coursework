import { t, useLocale } from "../../../../i18n/locale";
import { DialogContent } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getRoomById } from '../../../../store/rooms';
import Modal from '../../../common/Modal';
import { RoomEditForm } from '../../forms';
type RoomModalProps = {
  open: boolean;
  onClose: () => void;
  roomId: string;
};
const RoomEditModal: React.FC<RoomModalProps> = ({
  open,
  onClose,
  roomId
}) => {
  useLocale();
  const currentRoom = useSelector(getRoomById(roomId));
  return <Modal title={t("Редагування")} open={open} onClose={onClose}>
      <DialogContent>
        <h2>{t("Редагувати номер")}{currentRoom?.roomNumber}</h2>
        <RoomEditForm roomData={currentRoom} onCloseModal={onClose} />
      </DialogContent>
    </Modal>;
};
export default React.memo(RoomEditModal);
