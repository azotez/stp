type StpQ =
  | StpAccountEvent
  | StpSiteTypeEvent
  | StpEmailEvent
  | StpTrackTransactionEvent
  | StpViewHomeEvent
  | StpViewItemEvent
  | StpViewListEvent

interface StpEvent {
  event: string
}

interface StpAccountEvent extends StpEvent {
  event: 'setAccount'
  account: string
}

interface StpSiteTypeEvent extends StpEvent {
  event: 'setSiteType'
  type: 'm' | 't' | 'd'
}

interface StpEmailEvent extends StpEvent {
  event: 'setEmail'
  email: string[]
}

interface StpPixelEvent {
  tms: 'gtm-vtex'
}

interface StpViewHomeEvent extends StpEvent, StpPixelEvent {
  event: 'viewHome'
}

interface StpViewListEvent extends StpEvent, StpPixelEvent {
  event: 'viewList'
  item: string[]
}

interface StpViewItemEvent extends StpEvent, StpPixelEvent {
  event: 'viewItem'
  item: string
}

interface StpTrackTransactionEvent extends StpEvent, StpPixelEvent {
  event: 'trackTransaction'
  id: string
  item: StpTrackTransactionItem[]
}

interface StpTrackTransactionItem {
  id: string
  price: number
  quantity: number
}
