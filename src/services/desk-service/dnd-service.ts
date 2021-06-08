import { createDomain, createEvent, sample } from 'effector'
import { Card } from '../../pages/types'
import { attachLogger } from 'effector-logger/attach'
import { deskService } from './desk-service'
import { cardService } from './card-service'
import { DropResult } from 'react-beautiful-dnd'

const dndDomain = createDomain()
attachLogger(dndDomain)

//----------------------------------------------Events

const dndEnd = createEvent<DropResult>()

//----------------------------------------------Samples

const reorder = (cards: Card[], startIndex: number, endIndex: number) => {
  const result = Array.from(cardService.cards.getState())
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

sample({
  source: {
    cards: cardService.cards,
  },
  clock: dndEnd,
  target: cardService.cards,
  fn: ({ cards }, dndEnd) => {
    if (!dndEnd.destination) return cards

    if (dndEnd.type === 'card') {
      if (dndEnd.destination.droppableId !== dndEnd.source.droppableId) {
        cards[dndEnd.source.index].list_id = Number(dndEnd.destination.droppableId)
        if (dndEnd.destination.index > dndEnd.source.index) return cards
      }
      return reorder(cards, dndEnd.source.index, dndEnd.destination!.index)
    } else return cards
  },
})

sample({
  source: { lists: deskService.lists },
  clock: dndEnd,
  target: deskService.lists,
  fn: ({ lists }, dndEnd) => {
    console.log(dndEnd)
    if (!dndEnd.destination) return lists
    if (dndEnd.type === 'list') {
      const result = Array.from(lists)
      const [removed] = result.splice(dndEnd.source.index, 1)
      result.splice(dndEnd.destination.index, 0, removed)
      return result
    } else return lists
  },
})

export const dndService = {
  dndEnd,
}
