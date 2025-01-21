use crate::interfaces::{Position, Damageable, Damager};

pub struct Heart {
    x: f64,
    y: f64,
}

impl Heart {
    pub const RADIUS: f64 = 2.0;

    pub fn new(x: f64, y: f64) -> Self {
        Heart { x, y }
    }

    pub fn get_position(&self) -> Position {
        Position { x: self.x, y: self.y }
    }

    pub fn get_boundaries(&self) -> Vec<Position> {
        vec![
            Position { x: self.x, y: self.y },
            Position { x: self.x + 3.0, y: self.y - 3.0 },
            Position { x: self.x + 6.0, y: self.y },
            Position { x: self.x, y: self.y + 6.0 },
            Position { x: self.x - 6.0, y: self.y },
            Position { x: self.x - 3.0, y: self.y - 3.0 },
        ]
    }

    pub fn get_damage_to_remove(&self, damageable: &Damageable) -> f64 {
        if let Some(vehicle) = damageable.as_vehicle() {
            return 30.0;
        }
        2.0
    }
}
