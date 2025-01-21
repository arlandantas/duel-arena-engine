pub struct Damageable {
    life: f64,
}

impl Damageable {
    pub fn new(initial_life: f64) -> Self {
        Damageable { life: initial_life }
    }

    pub fn apply_damage(&mut self, damage: f64) -> f64 {
        self.life -= damage;
        self.life
    }

    pub fn remove_damage(&mut self, damage: f64) -> f64 {
        self.life += damage;
        self.life
    }

    pub fn get_life(&self) -> f64 {
        self.life
    }
}
