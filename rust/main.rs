use crate::controllers::VehicleController;
use crate::models::{World, Vehicle, Heart};

fn main() {
    // Create a base world
    let mut world = World::new(500.0, 500.0);

    // Create a vehicle
    let vehicle = Vehicle::new(100.0, 100.0, 90.0, None);
    let vehicle_id = world.add_vehicle(vehicle);

    // Create a heart and add it to a random position
    let heart = Heart::new(250.0, 250.0);
    world.add_heart(heart);

    // Create a vehicle controller
    let mut controller = VehicleController::new(vehicle_id);
    controller.set_world(world);

    // Execute 50 loops
    for loop_count in 0..50 {
        if loop_count % 5 == 0 && loop_count > 0 {
            controller.rotate_clockwise(90.0);
        } else {
            controller.move_forward(10.0);
        }
        controller.loop();
        world.update_objects();
    }
}
