import { combine, createDomain, sample } from 'effector'
import { Card, List } from '../../pages/types'
import { attachLogger } from 'effector-logger/attach'
import { deskService } from './desk-service'
import { memoryId } from './index'

const cardDomain = createDomain()

attachLogger(cardDomain)
//-----------------------------------------------------------------Events
const deleteCardList = cardDomain.createEvent<number>()
const createCard = cardDomain.createEvent<number>()
const changeShowInputCard = cardDomain.createEvent<number>()
const setCardName = cardDomain.createEvent<string>()
const deleteCard = cardDomain.createEvent<number>()
const deleteCardFromList = cardDomain.createEvent<number>()
const deleteCardFromListFromDesk = cardDomain.createEvent<List[]>()
const loadData = cardDomain.createEvent()
//-----------------------------------------------------------------Stores

const $cardsMock = cardDomain.createStore<Card[]>([])
$cardsMock.on($cardsMock.updates, (state, stateAfter) => {
  if (state === null) return []
  localStorage.setItem('cards', JSON.stringify(stateAfter))
})
$cardsMock.on(loadData, () => JSON.parse(localStorage.getItem('cards')!))
const $showInputCard = cardDomain
  .createStore<boolean[]>(Array(deskService.lists.getState().length).fill(false))
  .on(deskService.lists.updates, (state, _) => state.map((_) => false))
  .on([changeShowInputCard, createCard], (state, _) => state.map((_) => false))

const $cardName = cardDomain
  .createStore<string>('')
  .on(setCardName, (_, title) => title)
  .reset($cardsMock.updates, changeShowInputCard)

//-----------------------------------------------------------------Samples

sample({
  clock: changeShowInputCard,
  source: combine({
    showInputCard: $showInputCard,
    lists: deskService.lists,
  }),
  target: $showInputCard,
  fn: ({ showInputCard, lists }, id) => {
    const index = lists.findIndex((l) => l.id === id)
    if (index >= 0) {
      showInputCard[index] = !showInputCard[index]
      return [...showInputCard]
    }

    return showInputCard
  },
})

sample({
  clock: createCard,
  source: combine({
    cards: $cardsMock,
    cardName: $cardName,
  }),
  target: $cardsMock,
  fn: ({ cards, cardName }, id) => [
    ...cards,
    {
      id: memoryId(),
      list_id: id,
      name: cardName,
    },
  ],
})

sample({
  clock: deleteCard,
  source: { cards: $cardsMock },
  target: $cardsMock,
  fn: ({ cards }, id) => {
    const newCardsList = cards.filter((cards) => cards.id !== id)
    return [...newCardsList]
  },
})

sample({
  source: { cards: $cardsMock },
  clock: deleteCardList,
  target: $cardsMock,
  fn: ({ cards }, id) => {
    const newCardsList = cards.filter((cards) => cards.list_id !== id)
    return [...newCardsList]
  },
})

sample({
  clock: deleteCardFromListFromDesk,
  source: $cardsMock,
  target: $cardsMock,
  fn: (cards, lists) => {
    lists.forEach((list) => (cards = cards.filter((newCard) => newCard.list_id !== list.id)))
    return [...cards]
  },
})

//--------------------------------------Export Service
export const cardService = {
  showInputCard: $showInputCard,
  cardName: $cardName,
  cards: $cardsMock,
  deleteCard,
  createCard,
  setCardName,
  changeShowInputCard,
  deleteCardList,
  deleteCardFromList,
  deleteCardFromListFromDesk,
  loadData,
}
