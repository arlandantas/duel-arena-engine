use crate::interfaces::Damageable;

pub struct Damager;

impl Damager {
    pub fn get_damage_to_apply(&self, _damageable: &Damageable) -> f64 {
        0.0
    }
}
