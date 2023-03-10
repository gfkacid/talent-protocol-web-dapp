require "pagy_cursor/pagy/extras/cursor"
require "pagy_cursor/pagy/extras/uuid_cursor"

# Inherit from this controller for authenticated api requests
class API::V1::PublicAPI::APIController < ActionController::Base
  include Clearance::Controller
  include Pagy::Backend

  INTERNAL_DOMAINS = ENV["INTERNAL_DOMAINS"].split(",")

  before_action :validate_api_key

  rescue_from StandardError, with: :something_went_wrong

  private

  def validate_api_key
    return if internal_request? && api_key_from_headers.blank?

    return unauthorized_request("API KEY header was not provided.") unless api_key_from_headers.present?
    return unauthorized_request("API KEY provided is invalid.") unless api_key
    return unauthorized_request("API KEY provided was not activated or it was revoked.") unless api_key.active?
  end

  def internal_request?
    return false if request.domain.blank?

    return true if INTERNAL_DOMAINS.include?(request.domain)

    false
  end

  def api_key_from_headers
    @api_key_from_headers ||= request.headers["X-API-KEY"]
  end

  def api_key
    @api_key ||= API::Key.find_by(access_key: api_key_from_headers)
  end

  def cursor
    params[:cursor]
  end

  def per_page
    # Allow the client to override the items per page on internal requests
    return (params[:per_page] || 10) if internal_request?

    ENV.fetch("API_PAGINATION_PER_PAGE", 25).to_i
  end

  def unauthorized_request(error_message)
    render json: {error: error_message}, status: :unauthorized
  end

  def something_went_wrong(error)
    return not_found if error.is_a?(ActiveRecord::RecordNotFound)

    response_body = {error: "Something went wrong. Reach out to us."}
    response_status = :internal_server_error

    log_request(response_body, response_status)
    Rollbar.error(
      error,
      {
        header_api_key: api_key_from_headers,
        request_path: request.path,
        request_method: request.method,
        request_ip: request.remote_ip,
        request_body: request.body.read,
        params: params.to_json
      }
    )

    respond_to do |format|
      format.json { render json: response_body, status: response_status }
    end
  end

  def not_found
    response_body = {error: "Resource not found."}
    response_status = :not_found

    log_request(response_body, response_status)

    respond_to do |format|
      format.json { render json: response_body, status: response_status }
    end
  end

  def log_request(response_body, response_code)
    return if internal_request?

    API::LogRequestJob.perform_later(
      api_key_id: api_key.id,
      request_path: request.path,
      request_method: request.method,
      request_ip: request.remote_ip,
      request_body: params.to_json,
      response_body: response_body.to_json,
      response_code: response_code.is_a?(Symbol) ? Rack::Utils::SYMBOL_TO_STATUS_CODE[response_code] : response_code
    )
  end

  def internal_only
    return if internal_request?

    response_body = {error: "Endpoint unavailable."}
    response_status = :bad_request

    respond_to do |format|
      format.json { render json: response_body, status: response_status }
    end
  end

  def current_impersonated_user
    @current_impersonated_user ||= user_from_impersonated_cookie
    @current_impersonated_user
  end

  def user_from_impersonated_cookie
    User.find_by(username: cookies.signed[:impersonated])
  end

  # Override pagy methods to use the :uuid database field for pagination
  def pagy_uuid_cursor_get_vars(collection, vars)
    vars[:arel_table] = collection.arel_table
    vars[:primary_key] = :uuid
    vars[:backend] = "uuid"
    vars
  end

  def pagy_uuid_cursor_get_items(collection, pagy, position = nil)
    if position.present?
      arel_table = pagy.arel_table

      selected_column = pagy.order.keys.first || :created_at

      select_created_at = arel_table.project(arel_table[selected_column]).where(arel_table[pagy.primary_key].eq(position))
      select_the_sample_created_at = arel_table[selected_column].eq(select_created_at).and(arel_table[pagy.primary_key].send(pagy.comparation, position))
      sql_comparation = arel_table[selected_column].send(pagy.comparation, select_created_at).or(select_the_sample_created_at)

      collection = collection.where(sql_comparation)
    end

    collection.reorder(pagy.order).limit(pagy.items)
  end
end
