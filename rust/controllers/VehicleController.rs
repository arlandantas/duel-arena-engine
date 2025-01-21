use crate::models::{Action, Vehicle, World};

pub struct VehicleController {
    vehicle_id: String,
    world: Option<World>,
    action_listener: Box<dyn Fn(Action)>,
}

impl VehicleController {
    pub fn new(vehicle_id: String) -> Self {
        if vehicle_id.is_empty() {
            panic!("Vehicle id should not be empty");
        }
        VehicleController {
            vehicle_id,
            world: None,
            action_listener: Box::new(|_| {}),
        }
    }

    pub fn set_action_listener<F>(&mut self, listener: F)
    where
        F: Fn(Action) + 'static,
    {
        self.action_listener = Box::new(listener);
    }

    fn add_action(&self, action: Action) {
        (self.action_listener)(action);
    }

    pub fn loop(&mut self) { }

    pub fn move_forward(&mut self, speed: f64) {
        self.add_action(Action::new(Vehicle::ACTIONS.MOVEFORWARD, vec!["speed", speed]));
    }

    pub fn move_backward(&mut self, speed: f64) {
        self.add_action(Action::new(Vehicle::ACTIONS.MOVEBACKWARD, vec!["speed", speed]));
    }

    pub fn rotate_clockwise(&mut self, speed: f64) {
        self.add_action(Action::new(Vehicle::ACTIONS.ROTATECLOCKWISE, vec!["speed", speed]));
    }

    pub fn rotate_anticlockwise(&mut self, speed: f64) {
        self.add_action(Action::new(Vehicle::ACTIONS.ROTATEANTICLOCKWISE, vec!["speed", speed]));
    }

    pub fn rotate_gun_clockwise(&mut self, speed: f64) {
        self.add_action(Action::new(Vehicle::ACTIONS.ROTATEGUNCLOCKWISE, vec!["speed", speed]));
    }

    pub fn rotate_gun_anticlockwise(&mut self, speed: f64) {
        self.add_action(Action::new(Vehicle::ACTIONS.ROTATEGUNANTICLOCKWISE, vec!["speed", speed]));
    }

    pub fn fire(&mut self) {
        self.add_action(Action::new(Vehicle::ACTIONS.FIRE, vec![]));
    }

    pub fn get_vehicle(&self) -> Option<&Vehicle> {
        self.world.as_ref().and_then(|w| w.get_vehicle(&self.vehicle_id))
    }

    pub fn get_vehicles(&self) -> Vec<&Vehicle> {
        self.world.as_ref().map_or_else(Vec::new, |w| w.get_vehicles())
    }

    pub fn set_world(&mut self, world: World) {
        self.world = Some(world);
    }

    pub fn get_vehicle_id(&self) -> &String {
        &self.vehicle_id
    }
}
