import { MegoTicketsPublicDeployed } from "./types/MegoTicketsFactory/MegoTicketsFactory";
import { TicketContract } from "./types/schema";
import { MegoTicketsPublic } from "./types/templates";

export function handleTicketCreated(event: MegoTicketsPublicDeployed): void {
  MegoTicketsPublic.create(event.params.deployedAddress);
  let entity = new TicketContract(event.params.deployedAddress.toHexString());
  entity.user = event.params.deployer;
  entity.block = event.block.number;
  entity.name = event.params.name;
  entity.ticker = event.params.ticker;
  entity.block = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.txid = event.transaction.hash;
  entity.save();
}
