use std::f64;
use crate::interfaces::{Angle, Position};

pub fn degree_to_rad(degree: f64) -> f64 {
    std::f64::consts::PI * degree / 180.0
}

pub fn normalize_degrees(degree: f64) -> f64 {
    let mut angle = degree % 360.0;
    if angle < 0.0 {
        angle += 360.0;
    }
    angle
}

pub fn rotate_point(point: Position, origin: Position, angle: Angle) -> Position {
    Position {
        x: angle.cos * (point.x - origin.x) - angle.sin * (point.y - origin.y) + origin.x,
        y: angle.sin * (point.x - origin.x) + angle.cos * (point.y - origin.y) + origin.y,
    }
}

pub fn check_boundaries_overlap(a: &[Position], b: &[Position]) -> bool {
    for i in 0..a.len() {
        let line_a = [
            a[i],
            if i < a.len() - 1 { a[i + 1] } else { a[0] },
        ];
        for j in 0..b.len() {
            let line_b = [
                b[j],
                if j < b.len() - 1 { b[j + 1] } else { b[0] },
            ];

            if check_line_overlap(&line_a, &line_b) {
                return true;
            }
        }
    }
    false
}

pub fn check_line_overlap(a: &[Position], b: &[Position]) -> bool {
    if a.len() != 2 || b.len() != 2 {
        panic!("Invalid line segments");
    }

    let i = (a[1].y - a[0].y) / (a[1].x - a[0].x);
    let j = (a[1].x * a[0].y - a[0].x * a[1].y) / (a[1].x - a[0].x);
    let k = (b[1].y - b[0].y) / (b[1].x - b[0].x);
    let l = (b[1].x * b[0].y - b[0].x * b[1].y) / (b[1].x - b[0].x);

    let x = (l - j) / (i - k);
    let y = (i * l - j * k) / (i - k);

    let overlap_point = Position { x, y };

    is_point_in_line(overlap_point, a[0], a[1]) && is_point_in_line(overlap_point, b[0], b[1])
}

pub fn is_point_in_line(point: Position, line_a: Position, line_b: Position) -> bool {
    (get_point_distance(line_a, line_b) - get_point_distance(line_a, point) - get_point_distance(line_b, point)).abs() < 0.01
}

pub fn get_point_distance(a: Position, b: Position) -> f64 {
    ((a.x - b.x).powi(2) + (a.y - b.y).powi(2)).sqrt()
}
