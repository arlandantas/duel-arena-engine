pub struct DamageRemover;

impl DamageRemover {
    pub fn remove_damage(&self, damageable: &mut Damageable, amount: f64) {
        damageable.remove_damage(amount);
    }
}
