import React from 'react'
import { useParams, Link, Redirect } from 'react-router-dom'
import { useStore } from 'effector-react'
import { deskTableService } from '../services/desk-table-service'
import { Lists } from '../components/Lists'
import DeskStyles from './DeskStyles.module.scss'
import { DragDropContext } from 'react-beautiful-dnd'
import { dndService } from '../services/desk-service/dnd-service'

type ParamsType = {
  id: string
}

export const Desk = () => {
  const params = useParams<ParamsType>()
  const desks = useStore(deskTableService.deskList)

  const desk = desks[desks.findIndex((desk) => desk.id === Number(params.id))]

  return !desk ? (
    <Redirect to='/' />
  ) : (
    <>
      <Link to='/'>Назад к доскам</Link>
      <div>
        <div className={DeskStyles.DeskTitle}>Доска: {desk.name}</div>
      </div>
      <DragDropContext onDragEnd={(result) => dndService.dndEnd(result)}>
        <Lists />
      </DragDropContext>
    </>
  )
}
