import React, { useEffect, useState } from 'react'
import { RouterService } from './pages/router'
import { cardService } from './services/desk-service/card-service'
import { deskTableService } from './services/desk-table-service'
import { deskService } from './services/desk-service'

function App() {
  const desks = deskTableService.loadData
  const lists = deskService.loadData
  const cards = cardService.loadData
  useEffect(() => {
    desks()
  }, [])

  useEffect(() => {
    lists()
  }, [])

  useEffect(() => {
    cards()
  }, [])
  return (
    <div>
      <RouterService />
    </div>
  )
}

export default App
