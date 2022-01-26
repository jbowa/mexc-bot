export default function isValidSpread(bid: number, ask: number): void {
  // if user has set both bid and ask
  // warn them about their strategy.
  if (bid && ask && bid >= ask) {
    console.log(`--------------------------------------------------------------`);
    console.log('‼️\tbid price is higher than the ask price');
    console.log('\tyou are selling low and buying high.');
    console.log(`--------------------------------------------------------------`);
    process.exit(1);
  }
}
