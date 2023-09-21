import {
  Claimed as ClaimedEvent,
  Minted as MintedEvent,
  Transfer as TransferEvent,
  MegoTicketsPublic
} from "../generated/MegoTicketsPublic/MegoTicketsPublic"
import {
  Claimed,
  Minted,
  Transfer,
  Token
} from "../generated/schema"
import { Bytes } from '@graphprotocol/graph-ts'

export function handleClaimed(event: ClaimedEvent): void {
  let entity = new Claimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMinted(event: MintedEvent): void {
  let entity = new Minted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  let contract = MegoTicketsPublic.bind(event.address)
  let tier = contract._idToTier(event.params.tokenId)

  entity.tokenId = event.params.tokenId
  entity.tier = tier
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  let contract = MegoTicketsPublic.bind(event.address)
  let tier = contract._idToTier(event.params.tokenId)

  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId
  entity.tier = tier
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  let id = Bytes.fromByteArray(Bytes.fromBigInt(event.params.tokenId))
  let token = Token.load(id)
  if (token == null) {
    token = new Token(id)
  }
  token.owner = event.params.to
  token.tokenId = event.params.tokenId
  token.tier = tier
  token.save()
}
