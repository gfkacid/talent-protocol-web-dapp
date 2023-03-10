require "rails_helper"

RSpec.describe "Sessions" do
  let!(:current_user) { create :user, :with_talent }

  describe "#valid" do
    subject(:api_request) { get(logged_in_user_api_v1_public_sessions_path(as: current_user), headers: headers) }

    let(:headers) { {} }

    before do
      stub_const("API::V1::PublicAPI::APIController::INTERNAL_DOMAINS", ["talentprotocol.com"])
    end

    context "when the request is internal" do
      before do
        host! "app.talentprotocol.com"
      end

      context "when the user is logged in" do
        it "returns a successful response" do
          api_request

          expect(response).to have_http_status(:ok)
        end

        it "returns the logged in user" do
          api_request

          returned_user = json[:user]
          aggregate_failures do
            expect(returned_user[:id]).to eq(current_user.uuid)
            expect(returned_user[:username]).to eq(current_user.username)
            expect(returned_user[:email]).to eq(current_user.email)
            expect(returned_user[:wallet_address]).to eq(current_user.wallet_id)
            expect(returned_user[:admin]).to eq(current_user.admin?)
            expect(returned_user[:moderator]).to eq(current_user.moderator?)
            expect(returned_user[:verified]).to eq(current_user.talent.verified)
          end
        end
      end

      context "when the user is not logged in" do
        let(:current_user) { nil }

        it "returns a not found response" do
          api_request
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "when the request is external" do
      before do
        host! "bounty.com"
      end

      let!(:api_key) { create :api_key, :activated, access_key: access_key }
      let(:access_key) { SecureRandom.hex }

      let(:headers) do
        {
          "X-API-KEY": access_key
        }
      end

      it "returns a bad request response" do
        api_request

        expect(response).to have_http_status(:bad_request)
        expect(json[:error]).to eq "Endpoint unavailable."
      end

      it "does not enqueue a job to log the request" do
        expect { api_request }.not_to have_enqueued_job(API::LogRequestJob)
      end
    end
  end
end
