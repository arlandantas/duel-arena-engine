use crate::interfaces::{Position, Damager, Damageable};
use crate::helpers::math::{degree_to_rad};

pub struct Bullet {
    x: f64,
    y: f64,
    speed: f64,
    angle: f64,
    angle_rad: f64,
    vehicle_id: String,
}

impl Bullet {
    pub const RADIUS: f64 = 2.0;

    pub fn new(x: f64, y: f64, angle: f64, vehicle_id: String, speed: f64) -> Self {
        let angle_rad = degree_to_rad(angle);
        Bullet { x, y, speed, angle, angle_rad, vehicle_id }
    }

    pub fn get_position(&self) -> Position {
        Position { x: self.x, y: self.y }
    }

    pub fn get_speed(&self) -> f64 { self.speed }
    pub fn get_angle(&self) -> f64 { self.angle }
    pub fn get_angle_rad(&self) -> f64 { self.angle_rad }
    pub fn get_vehicle_id(&self) -> &String { &self.vehicle_id }

    pub fn update(&mut self) {
        self.y += self.angle_rad.sin() * self.speed;
        self.x += self.angle_rad.cos() * self.speed;
    }

    pub fn get_boundaries(&self) -> Vec<Position> {
        vec![
            Position { x: self.x, y: self.y - Bullet::RADIUS },
            Position { x: self.x + Bullet::RADIUS, y: self.y },
            Position { x: self.x, y: self.y + Bullet::RADIUS },
            Position { x: self.x - Bullet::RADIUS, y: self.y },
        ]
    }

    pub fn get_damage_to_apply(&self, damageable: &Damageable) -> f64 {
        if let Some(vehicle) = damageable.as_vehicle() {
            if vehicle.get_vehicle_id() == self.vehicle_id {
                return 0.0;
            }
            return 30.0;
        }
        2.0
    }
}
