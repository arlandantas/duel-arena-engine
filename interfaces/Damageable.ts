class Damageable {
  life: number = 100

  constructor(initialLife: number = 100) {
    this.life = initialLife
  }
  
  applyDamage(damage: number): number {
    this.life -= damage
    return this.life
  }
  
  removeDamage(damage: number): number {
    this.life += damage
    return this.life
  }

  getLife(): number {
    return this.life
  }
}

export default Damageable