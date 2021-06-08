import React from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from 'effector-react'
import { deskTableService } from '../services/desk-table-service'
import { deskService } from '../services/desk-service'
import { Cards } from './Cards'
import { Button, IconButton, TextField } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import ListStyles from './ListStyles.module.scss'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { CardInput } from './CardInput'

type ParamsType = {
  id: string
}

export const Lists = () => {
  const params = useParams<ParamsType>()
  const desks = useStore(deskTableService.deskList)
  const desk = desks[desks.findIndex((desk) => desk.id === Number(params.id))]
  const showInput = useStore(deskService.showInput)
  const lists = useStore(deskService.lists)
  const listName = useStore(deskService.listName)

  const listDisplayFlex = {
    display: 'flex',
  }
  const listStyle = {
    backgroundColor: '#dfe3e6',
    borderRadius: '3px',
    width: '250px',
    padding: '8px',
    margin: '0 8px 0 0',
    maxHeight: '100%',
  }

  return (
    <main>
      <Droppable droppableId={String(desk.id)} direction='horizontal' type='list'>
        {(provided) => (
          <div style={listDisplayFlex} {...provided.droppableProps} ref={provided.innerRef}>
            {lists.map((list, index) => {
              return (
                list.desk_id === desk.id && (
                  <Draggable draggableId={String(list.id)} index={index} key={list.id}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Droppable droppableId={String(list.id)} key={list.id} type='card'>
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} style={listStyle}>
                              <div className={ListStyles.listTitleWithDelButton}>
                                <div className={ListStyles.listTitle}>{list.name}</div>
                                <IconButton aria-label='delete' onClick={(_) => deskService.deleteList(list.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </div>

                              <div>
                                <Cards list_id={list.id} />
                                {provided.placeholder}
                                <CardInput list_id={list.id} />
                              </div>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                )
              )
            })}
            {provided.placeholder}
            <div>
              {showInput ? (
                <>
                  <TextField
                    label='Введите название колонки'
                    variant='filled'
                    color='secondary'
                    type='text'
                    value={listName}
                    onChange={(event) => deskService.setListName(event.target.value)}
                  />
                  <Button
                    color='primary'
                    variant='contained'
                    type='button'
                    disabled={listName === ''}
                    onClick={(_) => deskService.createList(desk.id)}
                  >
                    Создать список
                  </Button>
                  <Button
                    color='primary'
                    variant='contained'
                    type='button'
                    onClick={(_) => deskService.changeShowInput()}
                  >
                    Отмена
                  </Button>
                </>
              ) : (
                <Button
                  color='primary'
                  variant='contained'
                  type='button'
                  onClick={(_) => deskService.changeShowInput()}
                >
                  Добавить список
                </Button>
              )}
            </div>
          </div>
        )}
      </Droppable>
    </main>
  )
}
