import { canUseDOM } from 'vtex.render-runtime'
import { PixelMessage } from './typings/events'
import { fetchEmail, getSiteType } from './helpers'

async function dispatchEvent(event: StpQ) {
  const { Stp_q = [], stpMail: account } = window
  const setAccount: StpAccountEvent = { event: 'setAccount', account }
  const setEmail: StpEmailEvent = {
    event: 'setEmail',
    email: [await fetchEmail()],
  }
  const setSiteType: StpSiteTypeEvent = {
    event: 'setSiteType',
    type: getSiteType(),
  }
  Stp_q.push(setAccount, setEmail, setSiteType, event)
}

function handleMessages(event: PixelMessage) {
  const { Stp_q = [], stpMail: account } = window
  if (!account) return

  switch (event.data.eventName) {
    case 'vtex:pageInfo': {
      if (event.data.eventType === 'homeView') {
        const setHomeView: StpViewHomeEvent = {
          event: 'viewHome',
          tms: 'gtm-vtex',
        }
        dispatchEvent(setHomeView)
      }
      break
    }
    case 'vtex:departmentView':
    case 'vtex:internalSiteSearchView':
    case 'vtex:categoryView': {
      const {
        data: { products },
      } = event
      const item: string[] = products
        .slice(0, 3)
        .map<string>(({ productId }) => productId)
      const setViewList: StpViewListEvent = {
        event: 'viewList',
        tms: 'gtm-vtex',
        item,
      }
      dispatchEvent(setViewList)
      break
    }
    case 'vtex:productView': {
      const {
        data: {
          product: { productId },
        },
      } = event
      const setViewItem: StpViewItemEvent = {
        event: 'viewItem',
        tms: 'gtm-vtex',
        item: productId,
      }
      dispatchEvent(setViewItem)
      break
    }
    case 'vtex:orderPlaced': {
      const {
        data: { transactionId, transactionProducts },
      } = event

      const item: StpTrackTransactionItem[] = transactionProducts.map<
        StpTrackTransactionItem
      >(({ id, sellingPrice, quantity }) => ({
        id,
        price: sellingPrice,
        quantity,
      }))

      const setTrackTransaction: StpTrackTransactionEvent = {
        event: 'trackTransaction',
        id: transactionId,
        tms: 'gtm-vtex',
        item,
      }

      dispatchEvent(setTrackTransaction)
      break
    }
    default:
      break
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleMessages)
}
