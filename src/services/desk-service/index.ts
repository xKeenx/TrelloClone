import { forward, sample } from 'effector'
import { deskService } from './desk-service'
import { cardService } from './card-service'
import { deskTableService } from '../desk-table-service'

export * from './desk-service'

sample({
  clock: deskService.deleteList,
  source: {
    lists: deskService.lists,
  },
  target: deskService.lists,
  fn: ({ lists }, id) => {
    const newLists = lists.filter((lists) => lists.id !== id)

    return [...newLists]
  },
})

sample({
  clock: deskService.deleteListFromDesk,
  source: { lists: deskService.lists },
  target: deskService.lists,
  fn: ({ lists }, desk_id) => {
    const findLists = lists.filter((lists) => lists.desk_id === desk_id)

    cardService.deleteCardFromListFromDesk(findLists) ///---------------ВАЖНО БЛЯТЬ , ТАК МОЖНО БЫЛО !!!!!!!!!!!!!!!

    const newListInDesk = lists.filter((lists) => lists.desk_id !== desk_id)
    return [...newListInDesk]
  },
})

forward({
  from: deskService.deleteList,
  to: cardService.deleteCardList,
})

forward({
  from: deskTableService.deleteDesk,
  to: deskService.deleteListFromDesk,
})

let maxId = 0
export const memoryId = () => {
  deskService.lists.getState().forEach((list) => {
    if (maxId < list.id) maxId = list.id
  })
  cardService.cards.getState().forEach((card) => {
    if (maxId < card.id) maxId = card.id
  })

  return maxId + 1
}
