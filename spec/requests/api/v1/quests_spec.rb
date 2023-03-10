require "rails_helper"

RSpec.describe "Quests", type: :request do
  let!(:current_user) { create :user, :with_talent }

  describe "#show" do
    subject(:get_quest) { get quest_path(id: quest_id, as: current_user) }

    let!(:quest) { create :quest, user: current_user, type: "Quests::User" }
    let(:quest_id) { quest.short_type }

    context "when the quest exists and belongs to the logged in user" do
      it "returns a successful response" do
        get_quest

        expect(response).to have_http_status(:ok)
      end
    end

    context "when the quest exists and belongs to another user" do
      let!(:quest) { create :quest, user: create(:user), type: "Quest::User" }

      it "returns a successful response" do
        get_quest

        expect(response).to have_http_status(:not_found)
      end
    end

    context "when the quest does not exist" do
      let(:quest_id) { "invalid" }

      it "returns a successful response" do
        get_quest

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
