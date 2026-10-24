export class SeededRandom {
  constructor(seed=Date.now()){ this.state=(Number(seed)>>>0)||0x6d2b79f5; }
  next(){
    let t=this.state+=0x6d2b79f5;
    t=Math.imul(t^(t>>>15),t|1);
    t^=t+Math.imul(t^(t>>>7),t|61);
    return ((t^(t>>>14))>>>0)/4294967296;
  }
  int(max){ if(!Number.isInteger(max)||max<1)throw new RangeError('max must be a positive integer');return Math.floor(this.next()*max); }
  pick(items){ if(!items.length)throw new RangeError('cannot pick from an empty list');return items[this.int(items.length)]; }
  snapshot(){ return this.state>>>0; }
  static restore(state){ return new SeededRandom(state); }
}
