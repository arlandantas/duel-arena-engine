use crate::interfaces::{Position, Damageable, Angle, Action};

pub struct Vehicle {
    x: f64,
    y: f64,
    speed: f64,
    max_x: Option<f64>,
    max_y: Option<f64>,
    angle_speed: f64,
    angle: Angle,
    output_angle: Angle,
    gun_angle: f64,
    gun_angle_rad: f64,
    gun_angle_speed: f64,
    vehicle_id: String,
    colors: VehicleColors,
    actions: Vec<Action>,
}

impl Vehicle {
    pub const ACTIONS: [&'static str; 7] = [
        "MOVEFORWARD",
        "MOVEBACKWARD",
        "ROTATECLOCKWISE",
        "ROTATEANTICLOCKWISE",
        "ROTATEGUNCLOCKWISE",
        "ROTATEGUNANTICLOCKWISE",
        "FIRE",
    ];

    pub const SIZE: (f64, f64) = (40.0, 40.0);

    pub fn new(x: f64, y: f64, angle: f64, colors: Option<VehicleColors>) -> Self {
        let angle = Angle::new(angle);
        let output_angle = Angle::new(angle);
        Vehicle {
            x,
            y,
            speed: 0.0,
            max_x: None,
            max_y: None,
            angle_speed: 0.0,
            angle,
            output_angle,
            gun_angle: 0.0,
            gun_angle_rad: 0.0,
            gun_angle_speed: 0.0,
            vehicle_id: String::new(),
            colors: colors.unwrap_or_default(),
            actions: Vec::new(),
        }
    }

    pub fn get_position(&self) -> Position {
        Position { x: self.x, y: self.y }
    }

    private fn set_x(&mut self, x: f64) { self.x = x; }
    private fn set_y(&mut self, y: f64) { self.y = y; }

    pub fn set_max_boundaries(&mut self, max_x: f64, max_y: f64) {
        self.max_x = Some(max_x);
        self.max_y = Some(max_y);
    }

    private fn normalize_y(&mut self) {
        if let Some(max_y) = self.max_y {
            let boundaries_ys = self.get_boundaries().iter().map(|p| p.y).collect::<Vec<_>>();
            let smallest_y = boundaries_ys.iter().cloned().fold(f64::INFINITY, f64::min);
            if smallest_y < 0.0 {
                self.y += smallest_y.abs();
            }
            let greatest_y = boundaries_ys.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
            if greatest_y > max_y {
                self.y -= greatest_y - max_y;
            }
        }
    }

    private fn normalize_x(&mut self) {
        if let Some(max_x) = self.max_x {
            let boundaries_xs = self.get_boundaries().iter().map(|p| p.x).collect::<Vec<_>>();
            let smallest_x = boundaries_xs.iter().cloned().fold(f64::INFINITY, f64::min);
            if smallest_x < 0.0 {
                self.x += smallest_x.abs();
            }
            let greatest_x = boundaries_xs.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
            if greatest_x > max_x {
                self.x -= greatest_x - max_x;
            }
        }
    }

    pub fn add_action(&mut self, action: Action) {
        self.actions.push(action);
    }

    pub fn set_vehicle_id(&mut self, vehicle_id: String) {
        self.vehicle_id = vehicle_id;
    }

    pub fn set_speed(&mut self, speed: f64) {
        self.speed = speed.min(30.0);
    }

    pub fn set_angle_speed(&mut self, angle_speed: f64) {
        self.angle_speed = angle_speed.min(90.0);
    }

    pub fn set_gun_angle_speed(&mut self, gun_angle_speed: f64) {
        self.gun_angle_speed = gun_angle_speed.min(90.0);
    }

    pub fn execute_action(&mut self) -> Option<Action> {
        let curr_action = self.actions.pop();
        match curr_action {
            Some(action) => {
                match action {
                    Action::MoveForward => self.move(),
                    Action::MoveBackward => self.move_backward(),
                    Action::RotateClockwise => self.rotate_clockwise(),
                    Action::RotateAntiClockwise => self.rotate_anti_clockwise(),
                    Action::RotateGunClockwise => self.rotate_gun_clockwise(),
                    Action::RotateGunAntiClockwise => self.rotate_gun_anti_clockwise(),
                    Action::Fire => self.fire(),
                }
                Some(action)
            }
            None => None,
        }
    }

    pub fn get_boundaries(&self) -> Vec<Position> {
        let mut boundaries = Vec::new();
        let size_x = Vehicle::SIZE.0;
        let size_y = Vehicle::SIZE.1;
        let angle_rad = self.angle.radian;
        let cos_angle = angle_rad.cos();
        let sin_angle = angle_rad.sin();
        let x1 = self.x + size_x / 2.0 * cos_angle - size_y / 2.0 * sin_angle;
        let y1 = self.y + size_x / 2.0 * sin_angle + size_y / 2.0 * cos_angle;
        let x2 = self.x + size_x / 2.0 * cos_angle + size_y / 2.0 * sin_angle;
        let y2 = self.y + size_x / 2.0 * sin_angle - size_y / 2.0 * cos_angle;
        let x3 = self.x - size_x / 2.0 * cos_angle + size_y / 2.0 * sin_angle;
        let y3 = self.y - size_x / 2.0 * sin_angle - size_y / 2.0 * cos_angle;
        let x4 = self.x - size_x / 2.0 * cos_angle - size_y / 2.0 * sin_angle;
        let y4 = self.y - size_x / 2.0 * sin_angle + size_y / 2.0 * cos_angle;
        boundaries.push(Position { x: x1, y: y1 });
        boundaries.push(Position { x: x2, y: y2 });
        boundaries.push(Position { x: x3, y: y3 });
        boundaries.push(Position { x: x4, y: y4 });
        boundaries
    }

    pub fn update(&mut self) {
        if self.speed != 0.0 {
            self.move();
            self.set_speed(0.0);
        }
        if self.angle_speed != 0.0 {
            self.rotate();
            self.set_angle_speed(0.0);
        }
        if self.gun_angle_speed != 0.0 {
            self.rotate_gun();
            self.set_gun_angle_speed(0.0);
        }
        self.normalize_x();
        self.normalize_y();
    }

    pub fn set_angle(&mut self, angle: f64) {
        self.angle = Angle::new(angle);
    }

    pub fn set_output_angle(&mut self, angle: f64) {
        self.output_angle = Angle::new(angle);
    }

    pub fn set_gun_angle(&mut self, gun_angle: f64) {
        self.gun_angle = gun_angle;
    }

    pub fn move(&mut self) {
        let angle_rad = self.angle.radian;
        let cos_angle = angle_rad.cos();
        let sin_angle = angle_rad.sin();
        self.x += self.speed * cos_angle;
        self.y += self.speed * sin_angle;
    }

    pub fn move_backward(&mut self) {
        let angle_rad = self.angle.radian;
        let cos_angle = angle_rad.cos();
        let sin_angle = angle_rad.sin();
        self.x -= self.speed * cos_angle;
        self.y -= self.speed * sin_angle;
    }

    pub fn rotate(&mut self) {
        self.angle = Angle::new(self.angle.degree + self.angle_speed);
    }

    pub fn rotate_clockwise(&mut self) {
        self.angle = Angle::new(self.angle.degree - self.angle_speed);
    }

    pub fn rotate_anti_clockwise(&mut self) {
        self.angle = Angle::new(self.angle.degree + self.angle_speed);
    }

    pub fn rotate_gun(&mut self) {
        self.gun_angle += self.gun_angle_speed;
    }

    pub fn rotate_gun_clockwise(&mut self) {
        self.gun_angle -= self.gun_angle_speed;
    }

    pub fn rotate_gun_anti_clockwise(&mut self) {
        self.gun_angle += self.gun_angle_speed;
    }

    pub fn fire(&mut self) {
        // Implement fire logic here
    }

    pub fn get_position(&self) -> Position {
        Position { x: self.x, y: self.y }
    }

    pub fn get_speed(&self) -> f64 {
        self.speed
    }

    pub fn get_angle(&self) -> f64 {
        self.angle.degree
    }

    pub fn get_angle_speed(&self) -> f64 {
        self.angle_speed
    }

    pub fn get_gun_angle(&self) -> f64 {
        self.gun_angle
    }

    pub fn get_gun_angle_speed(&self) -> f64 {
        self.gun_angle_speed
    }

    pub fn get_vehicle_id(&self) -> &String {
        &self.vehicle_id
    }
}
