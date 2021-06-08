import React, { useRef } from 'react'
import { useStore } from 'effector-react'
import { deskTableService } from '../services/desk-table-service'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { TextField } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

export const DeskTable = () => {
  const desks = useStore(deskTableService.deskList)
  const showInput = useStore(deskTableService.showInput)
  const deskName = useStore(deskTableService.deskName)

  //------------------------------------------------------------styles
  const desksFlex = {
    display: 'flex',
    gap: '50px',
  }
  const deskContainer = {
    height: '120px',
    width: '120px',
    background: 'gray',
    padding: '10px',
    margin: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '3px',
    boxShadow: '0 2px 4px grey',
  }

  const linkDiv = {
    display: 'block',
  }

  //------------------------------------------------------------Desk-Table
  return (
    <div>
      <div>Доски</div>
      <div style={desksFlex}>
        {desks.map((desk) => (
          <div key={desk.id}>
            <div style={deskContainer} onClick={(_) => {}}>
              <div style={linkDiv}>
                <Link to={`/desk/${desk.id}`}>{desk.name}</Link>
              </div>
              <IconButton aria-label='delete' onClick={(_) => deskTableService.deleteDesk(desk.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))}
        <div>
          {showInput ? (
            <>
              <TextField
                variant='filled'
                color='secondary'
                size='small'
                label='Введите название доски'
                type='text'
                value={deskName}
                onChange={(event) => deskTableService.setDeskName(event.target.value)}
              />

              <Button
                variant='contained'
                color='primary'
                type='button'
                disabled={deskName === ''}
                onClick={(_) => deskTableService.createDesk()}
              >
                Создать доску
              </Button>
              <IconButton aria-label='delete' type='button' onClick={(_) => deskTableService.changeShowInput()}>
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <Button
              type='button'
              variant='contained'
              color='primary'
              onClick={(_) => deskTableService.changeShowInput()}
            >
              Добавить доску
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
