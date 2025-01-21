use crate::helpers::math::{degree_to_rad, normalize_degrees};

pub struct Angle {
    pub degree: f64,
    pub radian: f64,
    pub cos: f64,
    pub sin: f64,
}

impl Angle {
    pub fn new(degree: f64) -> Self {
        let mut angle = Angle {
            degree,
            radian: 0.0,
            cos: 0.0,
            sin: 0.0,
        };
        angle.change_angle(degree);
        angle
    }

    pub fn change_angle(&mut self, degree: f64) {
        self.radian = degree_to_rad(degree);
        self.degree = normalize_degrees(degree);
        self.sin = self.radian.sin();
        self.cos = self.radian.cos();
    }
}
