use crate::interfaces::ActionParams;

pub struct Action {
    action_type: String,
    params: ActionParams,
}

impl Action {
    pub fn new(action_type: String, params: ActionParams) -> Self {
        Action { action_type, params }
    }

    pub fn get_type(&self) -> &String {
        &self.action_type
    }

    pub fn get_params(&self) -> &ActionParams {
        &self.params
    }

    pub fn get_param(&self, param_name: &str, default_value: Option<&str>) -> Option<&str> {
        self.params.get(param_name).or(default_value)
    }
}
