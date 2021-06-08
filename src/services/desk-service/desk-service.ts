import { combine, createDomain, sample } from 'effector'
import { List } from '../../pages/types'
import { attachLogger } from 'effector-logger/attach'
import { memoryId } from './index'

const deskDomain = createDomain()

const createList = deskDomain.createEvent<number>()
const changeShowInput = deskDomain.createEvent()
const setListName = deskDomain.createEvent<string>()
const deleteList = deskDomain.createEvent<number>()
const deleteListFromDesk = deskDomain.createEvent<number>()
const loadData = deskDomain.createEvent()

const $listsMock = deskDomain.createStore<List[]>([])
$listsMock.on($listsMock.updates, (state, stateAfter) => {
  if (state === null) return []
  localStorage.setItem('lists', JSON.stringify(stateAfter))
})
$listsMock.on(loadData, () => JSON.parse(localStorage.getItem('lists')!))

const $showInput = deskDomain
  .createStore<boolean>(false)
  .on(changeShowInput, (store, _) => !store)
  .reset($listsMock.updates)
const $listName = deskDomain
  .createStore<string>('')
  .on(setListName, (_, title) => title)
  .reset(changeShowInput, $listsMock.updates)

sample({
  clock: createList,
  source: combine({
    lists: $listsMock,
    listName: $listName,
  }),
  target: $listsMock,
  fn: ({ lists, listName }, id) => [...lists, { id: memoryId(), desk_id: id, name: listName, show_card_input: false }],
})

attachLogger(deskDomain)

export const deskService = {
  showInput: $showInput,
  listName: $listName,
  lists: $listsMock,
  createList,
  changeShowInput,
  setListName,
  deleteList,
  deleteListFromDesk,
  loadData,
}
