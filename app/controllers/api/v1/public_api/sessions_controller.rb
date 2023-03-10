class API::V1::PublicAPI::SessionsController < API::V1::PublicAPI::APIController
  before_action :internal_only

  def logged_in_user
    user = current_impersonated_user || current_user
    return not_found unless user

    response_body = {
      user: API::UserBlueprint.render_as_json(user, view: :normal, impersonated: current_impersonated_user.present?)
    }

    log_request(response_body, :ok)

    render json: response_body, status: :ok
  end

  private
end
