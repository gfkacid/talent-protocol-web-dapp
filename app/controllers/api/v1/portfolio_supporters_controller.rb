class API::V1::PortfolioSupportersController < ApplicationController
  # This is a public endpoint
  def index
    @users = User.includes(:talent).where(wallet_id: wallet_ids)
    user_data = @users.map do |u|
      {
        id: u.uuid,
        wallet_id: u.wallet_id,
        profile_picture_url: u&.profile_picture_url,
        username: u.username,
        messaging_disabled: u.messaging_disabled
      }
    end

    render json: {supporters: user_data}, status: :ok
  end

  private

  def wallet_ids
    params.require(:supporters)
  end
end
