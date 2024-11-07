import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, useForm } from '../../../../hooks';
import { updateRoomData } from '../../../../store/rooms';
import { RoomType } from '../../../../types/types';
import Button from '../../../common/Button';
import { Checkbox, CheckBoxList, InputField, RadioGroup, SelectField } from '../../../common/Fields';
import validatorConfig from './validatorConfig';

type RoomEditFormProps = {
  roomData: RoomType | undefined;
  onCloseModal: () => void;
};

const roomType = [
  { id: 'Стандарт', title: 'Стандарт' },
  { id: 'Люкс', title: 'Люкс' },
];
const roomComfortsOptions = [
  { name: 'Wi-Fi', value: 'hasWifi' },
  { name: 'Робоче місце', value: 'hasWorkSpace' },
  { name: 'Кондиціонер', value: 'hasConditioner' },
];

const RoomEditForm: React.FC<RoomEditFormProps> = ({ roomData, onCloseModal }) => {
  const initialData: RoomType = {
    _id: roomData?._id || 'not found',
    roomNumber: roomData?.roomNumber || '',
    type: roomData?.type || 'Стандарт',
    price: roomData?.price || 0,
    comforts: roomData?.comforts || [],
    canPets: roomData?.canPets || false,
    canSmoke: roomData?.canSmoke || false,
    canInvite: roomData?.canInvite || false,
    hasWideCorridor: roomData?.hasWideCorridor || false,
    hasDisabledAssistant: roomData?.hasDisabledAssistant || false,
  };

  const { data, errors, handleInputChange, handleKeyDown, validate } = useForm(initialData, true, validatorConfig);

  const dispatch = useDispatch();

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (validate(data)) {
      dispatch(updateRoomData(data));
      onCloseModal();
    }
  };

  return (
    <>
      <Form data={data} errors={errors} handleChange={handleInputChange} handleKeyDown={handleKeyDown}>
        <InputField name='roomNumber' label='№ номера' autoFocus />
        <RadioGroup label='Тип номеру' name='type' items={roomType} value={roomData?.type} />
        <InputField name='price' label='Оренда за добу(UAH)' />
        <SelectField label='Зручності' name='comforts' options={roomComfortsOptions} multiple />
        <CheckBoxList>
          <Checkbox label='Можна з улюбленцями' name='canPets' />
          <Checkbox label='Можна палити' name='canSmoke' />
          <Checkbox label='Можна запросити гостей (до 10 осіб)' name='canInvite' />
        </CheckBoxList>
        <CheckBoxList>
          <Checkbox
            label='Широкий коридор'
            name='hasWideCorridor'
            labelDetails='Ширина коридорів у номері не менше 91см'
          />
          <Checkbox
            label='Помічник для інвалідів'
            name='hasDisabledAssistant'
            labelDetails='На 1 поверсі вас зустріне фахівець та проводить до номера'
          />
        </CheckBoxList>

        <Button type='submit' onClick={handleSubmit} fullWidth disabled={Object.keys(errors).length !== 0}>
          Оновити
        </Button>
      </Form>
    </>
  );
};

export default RoomEditForm;
