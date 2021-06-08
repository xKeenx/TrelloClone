import { combine, createDomain, sample } from 'effector'
import { Desk } from '../../pages/types'

import { attachLogger } from 'effector-logger/attach'

const deskTableDomain = createDomain()

attachLogger(deskTableDomain)
const createDesk = deskTableDomain.createEvent()
const changeShowInput = deskTableDomain.createEvent()
const setDeskName = deskTableDomain.createEvent<string>()
const deleteDesk = deskTableDomain.createEvent<number>()
const loadData = deskTableDomain.createEvent()

const $deskList = deskTableDomain.createStore<Desk[]>([])
const $showInput = deskTableDomain
  .createStore<boolean>(false)
  .on(changeShowInput, (store, _) => !store)
  .reset($deskList.updates)
const $deskName = deskTableDomain
  .createStore<string>('')
  .on(setDeskName, (_, title) => title)
  .reset(changeShowInput, $deskList.updates)

$deskList.on($deskList.updates, (state, newState) => {
  if (state === null) return []
  localStorage.setItem('desks', JSON.stringify(newState))
})
$deskList.on(loadData, () => JSON.parse(localStorage.getItem('desks')!))

sample({
  source: combine({
    deskList: $deskList,
    deskName: $deskName,
  }),
  clock: createDesk,
  target: $deskList,
  fn: ({ deskList, deskName }) => [
    ...deskList,
    {
      id: deskList.length ? deskList[deskList.length - 1].id + 1 : 0,
      name: deskName,
    },
  ],
})

sample({
  source: $deskList,
  clock: deleteDesk,
  target: $deskList,
  fn: (deskList, id) => deskList.filter((desk) => desk.id !== id),
})

export const deskTableService = {
  deskList: $deskList,
  showInput: $showInput,
  deskName: $deskName,
  deleteDesk,
  setDeskName,
  createDesk,
  changeShowInput,
  loadData,
}
