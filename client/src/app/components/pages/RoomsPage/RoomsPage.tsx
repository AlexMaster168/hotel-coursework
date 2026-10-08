import { t, useLocale } from "../../../i18n/locale";
import React, { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { useFiltersQuery, usePagination, useSort } from '../../../hooks';
import useSearch from '../../../hooks/useSearch';
import { setSessionStorageData } from '../../../services/sessionStorage.service';
import { useAppDispatch } from '../../../store/createStore';
import { getFilteredRooms, getRoomsLoadingStatus, loadFilteredRoomsList } from '../../../store/rooms';
import Pagination from '../../common/Pagination';
import Searchbar from '../../common/Searchbar';
import RoomsDisplayCount from '../../ui/rooms/RoomsDisplayCount';
import RoomsFilter from '../../ui/rooms/RoomsFilters';
import RoomsList from '../../ui/rooms/RoomsList';
import RoomsListSkeleton from '../../ui/rooms/RoomsList/RoomsListSkeleton';
import RoomsSort from '../../ui/rooms/RoomsSort';
const setPageSizeOptions = [{
  name: '6',
  value: 6
}, {
  name: '12',
  value: 12
}, {
  name: '18',
  value: 18
}, {
  name: '24',
  value: 24
}];
const RoomsPage = () => {
  useLocale();
  const mobile = useMediaQuery('(max-width:900px)');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const rooms = useSelector(getFilteredRooms());
  const dispatch = useAppDispatch();
  const roomsIsLoading = useSelector(getRoomsLoadingStatus());
  const {
    searchFilters,
    handleResetSearchFilters
  } = useFiltersQuery();
  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    handleChangeSearch
  } = useSearch(rooms, {
    searchBy: 'roomNumber'
  });
  const {
    sortedItems,
    sortBy,
    setSortBy
  } = useSort(filteredData || [], {
    path: 'roomNumber',
    order: 'desc'
  });
  const {
    itemsListCrop: roomsListCrop,
    currentPage,
    pageSize,
    handleChangePage,
    handleChangePageSize
  } = usePagination(sortedItems || [], setPageSizeOptions[1].value);
  const handleSort = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(JSON.parse(event.target.value));
    handleChangePage(event, 1);
  }, [handleChangePage, setSortBy]);
  const handleResetFilters = useCallback(() => {
    handleResetSearchFilters();
    setSearchTerm('');
    setSortBy({
      path: 'roomNumber',
      order: 'desc'
    });
    handleChangePageSize({
      target: setPageSizeOptions[1]
    });
  }, [handleChangePageSize, handleResetSearchFilters]);
  useEffect(() => {
    const oneDayMs = 86_400_000;
    const initialSearchFilters = {
      arrivalDate: Date.now(),
      departureDate: Date.now() + oneDayMs
    };
    setSessionStorageData(searchFilters);
    dispatch(loadFilteredRoomsList({
      ...initialSearchFilters,
      ...searchFilters
    }));
  }, [searchFilters]);
  return <main className='rooms-page'>
      <aside className='rooms-page__filters'>
        <details className='filters-panel' open={!mobile || filtersOpen} onToggle={e => {
        if (mobile) setFiltersOpen(e.currentTarget.open);
      }}>
          <summary>{t("Дати, гості та фільтри")}</summary>
        <RoomsFilter onReset={handleResetFilters} />
        </details>
      </aside>
      <section className='rooms-page__rooms'>
        <div className='rooms-page__sorting'>
          <Searchbar value={searchTerm} onChange={handleChangeSearch} />
          <RoomsSort sortBy={sortBy} onSort={handleSort} />
          <RoomsDisplayCount count={pageSize} setCount={handleChangePageSize} options={setPageSizeOptions} />
        </div>
        <h2 className='rooms__title'>{t("Номери, які ми для вас підібрали")}</h2>
        {roomsIsLoading ? <RoomsListSkeleton pageSize={pageSize} /> : <RoomsList rooms={roomsListCrop} />}
        {roomsListCrop.length === 0 && <h2>{t("Ми не знайшли для вас відповідних номерів за вашими параметрами 🙁")}</h2>}

        {sortedItems.length > pageSize && <div className='rooms-page__pagination'>
            <Pagination items={sortedItems} pageSize={pageSize} currentPage={currentPage} onChange={handleChangePage} />
            <p className='rooms-page__pagination-info'>
              {t("{v0} - {v1} з {v2} варіантів оренди", {
            v0: (currentPage - 1) * pageSize || 1,
            v1: pageSize * currentPage > rooms.length ? rooms.length : pageSize * currentPage,
            v2: rooms.length
          })}
            </p>
          </div>}
      </section>
    </main>;
};
export default RoomsPage;
