type ID = number

export type Desk = {
  id: ID
  name: string
}

export type List = {
  id: ID
  desk_id: ID
  name: string
}

export type Card = {
  id: ID
  list_id: ID
  name: string
}
