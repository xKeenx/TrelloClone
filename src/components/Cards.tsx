import React from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from 'effector-react'
import { deskTableService } from '../services/desk-table-service'
import { deskService } from '../services/desk-service'
import { cardService } from '../services/desk-service/card-service'

import DeleteIcon from '@material-ui/icons/Delete'
import { IconButton } from '@material-ui/core'
import CardStyles from './CardStyles.module.scss'

import { Draggable } from 'react-beautiful-dnd'

type ParamsType = {
  id: string
}

export const Cards = (props: { list_id: number }) => {
  const params = useParams<ParamsType>()
  const desks = useStore(deskTableService.deskList)
  const desk = desks[desks.findIndex((desk) => desk.id === Number(params.id))]
  const cards = useStore(cardService.cards)
  const lists = useStore(deskService.lists)

  const getStyle = (style: any, snapshot: any) => {
    if (!snapshot.isDropAnimating) {
      return style
    }
    return {
      ...style,
      transitionDuration: `0.001s`,
    }
  }

  return (
    <main>
      <div className={CardStyles.cardBar}>
        {cards.map((card, index) => {
          return lists[lists.findIndex((list) => list.id === props.list_id)].desk_id === desk.id &&
            card.list_id === props.list_id ? (
            <Draggable draggableId={String(card.id)} index={index} key={card.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getStyle(provided.draggableProps.style, snapshot)}
                >
                  <div className={CardStyles.CardContent}>
                    <div className={CardStyles.CardLabel}>{card.name}</div>
                    <IconButton aria-label='delete' onClick={(_) => cardService.deleteCard(card.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              )}
            </Draggable>
          ) : (
            false
          )
        })}
      </div>
    </main>
  )
}
