import React from 'react'
import { useStore } from 'effector-react'
import { cardService } from '../services/desk-service/card-service'
import Button from '@material-ui/core/Button'
import { TextField } from '@material-ui/core'
import CardStyles from './CardStyles.module.scss'
import { deskService } from '../services/desk-service'
export const CardInput = (props: { list_id: number }) => {
  const cardName = useStore(cardService.cardName)
  const showInputCard = useStore(cardService.showInputCard)
  const lists = useStore(deskService.lists)
  return (
    <div>
      {showInputCard[lists.findIndex((list) => list.id === props.list_id)] ? (
        <div className={CardStyles.AddCardBlockButton}>
          <TextField
            variant='outlined'
            label='Введите название карточки'
            type='text'
            value={cardName}
            onChange={(event) => cardService.setCardName(event.target.value)}
          />
          <Button
            color='primary'
            variant='outlined'
            type='button'
            disabled={cardName === ''}
            onClick={(_) => cardService.createCard(props.list_id)}
          >
            Создать карточку
          </Button>
          <Button color='primary' variant='outlined' onClick={(_) => cardService.changeShowInputCard(props.list_id)}>
            Отмена
          </Button>
        </div>
      ) : (
        <div className={CardStyles.AddCardButton}>
          <Button color='primary' variant='outlined' onClick={(_) => cardService.changeShowInputCard(props.list_id)}>
            Добавить карточку
          </Button>
        </div>
      )}
    </div>
  )
}
