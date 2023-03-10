class API::V1::UsersController < ApplicationController
  def index
    @users = search_params[:name].present? ? filtered_users : filtered_users.limit(20)

    render json: {
      users: @users.includes(talent: :talent_token).map { |u|
        {
          id: u.id,
          profilePictureUrl: u&.profile_picture_url,
          username: u.username,
          ticker: u.talent&.talent_token&.display_ticker
        }
      }
    }, status: :ok
  end

  # Public endpoint
  def show
    @user = User.find_by(wallet_id: params[:id])

    if @user
      render json: {
        id: @user.id,
        profilePictureUrl: @user&.profile_picture_url,
        username: @user.username,
        messagingDisabled: @user.messaging_disabled
      }, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  end

  def update
    if user.nil? || current_user.nil? || user.id != current_user.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    render json: {error: "Not found."}, status: :not_found unless user

    result = Users::Update.new(
      user: user,
      user_params: user_params.to_h,
      password_params: password_params.to_h,
      tal_domain_params: tal_domain_params.to_h,
      wallet_id: params[:wallet_id],
      first_quest_popup: params[:first_quest_popup]
    ).call

    unless result[:success]
      return render json: {errors: result[:errors]}, status: :conflict
    end

    render json: result[:user], status: :ok
  end

  def domain_owner
    return render json: {error: "You don't have access to perform that action"}, status: :unauthorized unless current_user

    domain_owner = Web3::EnsDomainOwner.new(domain: tal_domain).call

    if current_user&.wallet_id&.downcase == domain_owner&.downcase
      render json: {wallet: domain_owner&.downcase}, status: :ok
    else
      error_message = "The wallet you have connected (#{current_user.wallet_id}) is not the owner of #{tal_domain}."
      render json: {error: error_message}, status: :bad_request
    end
  rescue => error
    Rollbar.error(
      error,
      "Error getting the domain owner"
    )
    render json: {error: "Something went wrong."}, status: :bad_request
  end

  private

  def user
    @user ||= User.find_by("id::text = :id OR uuid::text = :id", id: params[:id])
  end

  def search_params
    params.permit(:name, :messaging_disabled)
  end

  def user_params
    params.require(:user).permit(
      :theme_preference, :username, :email, :messaging_disabled, :display_name,
      notification_preferences: {}
    )
  end

  def tal_domain_params
    params.require(:user).permit(:tal_domain, :tal_domain_theme)
  end

  def password_params
    params.require(:user).permit(:new_password, :current_password)
  end

  def filtered_users
    Users::Search.new(
      current_user: current_user,
      search_params: search_params.to_h
    ).call
  end

  def tal_domain
    @tal_domain ||= begin
      domain = params[:tal_domain]
      return domain if domain.include?(ENV["TAL_BASE_DOMAIN"])

      "#{domain}.#{ENV["TAL_BASE_DOMAIN"]}"
    end
  end
end
