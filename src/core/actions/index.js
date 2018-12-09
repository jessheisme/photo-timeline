import {
  ADD_ITEM,
} from '../constants/action-types';

export const addItem = item => ({
  type: ADD_ITEM,
  payload: { item },
});