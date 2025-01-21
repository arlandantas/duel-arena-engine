use crate::controllers::VehicleController;
use crate::models::{Bullet, Vehicle, Action, Heart};
use crate::helpers::math::check_boundaries_overlap;
use crate::interfaces::Position;
use std::collections::HashMap;

pub struct World {
    fps_counter: FPSCounter,
    vehicles: WorldVehicles,
    bullets: Vec<Bullet>,
    hearts: Vec<Heart>,
    vehicle_controllers: Vec<VehicleController>,
    vehicle_actions_order: Vec<String>,
    update_interval: Option<std::time::Duration>,
    executing_vehicle_actions: bool,
    updating_objects: bool,
    width: f64,
    height: f64,
}

impl World {
    pub const ACTIONS: [&'static str; 1] = ["ADD_BULLET"];

    pub fn new(width: f64, height: f64) -> Self {
        World {
            fps_counter: FPSCounter::new(),
            vehicles: HashMap::new(),
            bullets: Vec::new(),
            hearts: Vec::new(),
            vehicle_controllers: Vec::new(),
            vehicle_actions_order: Vec::new(),
            update_interval: None,
            executing_vehicle_actions: false,
            updating_objects: false,
            width,
            height,
        }
    }

    pub fn start_updates(&mut self) {
        self.stop_updates();
        self.update_interval = Some(std::time::Duration::from_millis(10)); // Placeholder for actual timer
    }

    pub fn stop_updates(&mut self) {
        self.update_interval = None;
    }

    pub fn add_heart(&mut self, heart: Heart) {
        self.hearts.push(heart);
    }

    pub fn add_heart_on_random_position(&mut self) {
        self.add_heart(Heart::new(
            rand::random::<f64>() * (self.width - 20.0) + 10.0,
            rand::random::<f64>() * (self.height - 20.0) + 10.0,
        ));
    }

    pub fn remove_heart(&mut self, index: usize) -> Heart {
        self.hearts.remove(index)
    }

    pub fn add_vehicle_controller(&mut self, controller: VehicleController) {
        controller.set_action_listener(|action| {
            if let Some(vehicle) = self.get_vehicle(controller.get_vehicle_id()) {
                vehicle.add_action(action);
                self.vehicle_actions_order.push(controller.get_vehicle_id());
            }
        });
        controller.set_world(self);
        self.vehicle_controllers.push(controller);
    }

    pub fn execute_action(&mut self, action: Action, vehicle_id: &str) {
        match action.get_type() {
            "ADD_BULLET" => {
                self.bullets.push(Bullet::new(
                    action.get_param("x", 10.0),
                    action.get_param("y", 10.0),
                    action.get_param("angle", 0.0),
                    vehicle_id.to_string(),
                    action.get_param("speed", 50.0),
                ));
            }
            _ => {
                eprintln!("World action type not found: {}", action.get_type());
            }
        }
    }

    pub fn execute_vehicle_actions(&mut self) {
        if self.executing_vehicle_actions {
            return;
        }
        let current_actions = self.vehicle_actions_order.clone();
        self.vehicle_actions_order.clear();
        self.executing_vehicle_actions = true;
        for vehicle_id in current_actions {
            if let Some(vehicle) = self.get_vehicle(&vehicle_id) {
                if let Some(result_action) = vehicle.execute_action() {
                    self.execute_action(result_action, &vehicle_id);
                }
            }
        }
        self.executing_vehicle_actions = false;
    }

    pub fn update_objects(&mut self) {
        self.execute_loops();
        if !self.executing_vehicle_actions && !self.vehicle_actions_order.is_empty() {
            self.execute_vehicle_actions();
        }
        if self.updating_objects {
            return;
        }
        self.updating_objects = true;
        for vehicle in self.vehicles.values_mut() {
            vehicle.update();
        }
        for bullet in self.bullets.iter_mut() {
            bullet.update();
        }
        self.check_collisions();
        self.fps_counter.add_tick_to_current_second();
        self.updating_objects = false;
    }

    pub fn get_fps_last_second(&self) -> f64 {
        self.fps_counter.get_last_second_counter()
    }

    pub fn check_collisions(&mut self) {
        for vehicle in self.vehicles.values_mut() {
            let vehicle_boundaries = vehicle.get_boundaries();
            for (k, bullet) in self.bullets.iter_mut().enumerate() {
                let bullet_boundaries = bullet.get_boundaries();
                if check_boundaries_overlap(&vehicle_boundaries, &bullet_boundaries) {
                    vehicle.apply_damage(bullet.get_damage_to_apply(vehicle));
                    self.remove_bullet(k);
                }
            }
            for (k, heart) in self.hearts.iter_mut().enumerate() {
                let heart_boundaries = heart.get_boundaries();
                if check_boundaries_overlap(&vehicle_boundaries, &heart_boundaries) {
                    vehicle.remove_damage(heart.get_damage_to_remove(vehicle));
                    self.remove_heart(k);
                }
            }
            if vehicle.get_life() <= 0 {
                self.remove_vehicle(vehicle.get_vehicle_id());
            }
        }
        for (k, bullet) in self.bullets.iter_mut().enumerate() {
            let bullet_position = bullet.get_position();
            if bullet_position.x < 0.0 - Bullet::RADIUS || bullet_position.y < 0.0 - Bullet::RADIUS || bullet_position.x > self.width + Bullet::RADIUS || bullet_position.y > self.height + Bullet::RADIUS {
                self.remove_bullet(k);
            }
            let bullet_boundaries = bullet.get_boundaries();
            if check_boundaries_overlap(&self.get_boundaries(), &bullet_boundaries) {
                self.remove_bullet(k);
            }
        }
    }

    pub fn execute_loops(&mut self) {
        for controller in &mut self.vehicle_controllers {
            if let Some(vehicle) = self.vehicles.get(controller.get_vehicle_id()) {
                controller.loop();
            }
        }
    }

    pub fn add_vehicle(&mut self, vehicle: Vehicle) -> String {
        let mut random_id = rand::random::<u64>().to_string();
        while self.vehicles.contains_key(&random_id) {
            random_id = rand::random::<u64>().to_string();
        }
        self.vehicles.insert(random_id.clone(), vehicle);
        vehicle.set_vehicle_id(random_id.clone());
        vehicle.set_max_boundaries(self.width, self.height);
        random_id
    }

    pub fn remove_vehicle(&mut self, vehicle_id: &str) -> Option<Vehicle> {
        self.vehicles.remove(vehicle_id)
    }

    pub fn get_vehicle(&self, id: &str) -> Option<&Vehicle> {
        self.vehicles.get(id)
    }

    pub fn get_vehicles(&self) -> Vec<&Vehicle> {
        self.vehicles.values().collect()
    }

    pub fn add_bullet(&mut self, bullet: Bullet) {
        self.bullets.push(bullet);
    }

    pub fn remove_bullet(&mut self, index: usize) -> Bullet {
        self.bullets.remove(index)
    }

    pub fn get_bullets(&self) -> Vec<&Bullet> {
        self.bullets.iter().collect()
    }

    pub fn get_hearts(&self) -> Vec<&Heart> {
        self.hearts.iter().collect()
    }

    pub fn get_width(&self) -> f64 {
        self.width
    }

    pub fn get_height(&self) -> f64 {
        self.height
    }

    pub fn get_boundaries(&self) -> Vec<Position> {
        vec![
            Position { x: 0.0, y: 0.0 },
            Position { x: self.width, y: 0.0 },
            Position { x: self.width, y: self.height },
            Position { x: 0.0, y: self.height },
        ]
    }
}

pub type WorldVehicles = HashMap<String, Vehicle>;
