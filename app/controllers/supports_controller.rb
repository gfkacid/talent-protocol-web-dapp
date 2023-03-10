class SupportsController < ApplicationController
  def show
  end

  def user_page
    user = User.find(params[:id])
    @user = UserBlueprint.render_as_json(user, view: :support)
    @portfolio = TalentSupporter.where(supporter_wallet_id: user.wallet_id)
    @supporteds = user.portfolio
    @total_rewards = Reward
      .where(user_id: user.id)
      .sum(:amount)
  rescue ActiveRecord::RecordNotFound
    format.html { render "errors/404", status: :not_found }
  end

  def search
    users = User
      .includes(:talent)
      .where("username ILIKE :keyword OR email ILIKE :keyword OR display_name ILIKE :keyword", keyword: "%#{params[:username]}%")
    render json: UserBlueprint.render_as_json(users, view: :support), status: :ok
  end
end
