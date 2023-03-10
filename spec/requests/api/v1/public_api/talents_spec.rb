require "swagger_helper"
require "rails_helper"

RSpec.describe "Talents API" do
  let!(:api_key_object) { create(:api_key, :activated, access_key: access_key) }
  let(:access_key) { SecureRandom.hex }
  let(:"X-API-KEY") { access_key }

  path "/talents" do
    get "Retrieves a list of talents" do
      tags "Talents"
      consumes "application/json"
      produces "application/json"
      parameter name: "ids[]", in: :query, schema: {type: :array, items: {type: "string"}}, description: "List of wallet addresses or usernames"
      parameter name: :cursor, in: :query, type: :string, description: "The cursor to fetch the next page"
      parameter name: "X-API-KEY", in: :header, type: :string, description: "Your Talent Protocol API key"

      let(:cursor) { nil }
      let(:"ids[]") { nil }

      let!(:user_1) { create :user, :with_talent_token }
      let!(:user_2) { create :user, :with_talent_token }
      let!(:user_3) { create :user, :with_talent_token }
      let!(:user_4) { create :user, :with_talent_token }

      response "200", "get all talents", save_example: true do
        schema type: :object,
          properties: {
            talents: {
              type: :array,
              items: {
                type: :object,
                properties: PublicAPI::ObjectProperties::TALENT_PROPERTIES
              }
            },
            pagination: {
              type: :object,
              properties: PublicAPI::ObjectProperties::PAGINATION_PROPERTIES
            }
          }

        run_test! do |response|
          data = JSON.parse(response.body)

          returned_talents = data["talents"]
          returned_usernames = returned_talents.map { |f| f["username"] }
          returned_pagination = data["pagination"]
          aggregate_failures do
            expect(data["talents"].count).to eq 4
            expect(returned_usernames).to match_array([user_1.username, user_2.username, user_3.username, user_4.username])

            expect(returned_pagination["total"]).to eq 4
          end
        end
      end

      response "200", "get all talents with filter", document: false do
        let(:"ids[]") { [user_1.username, user_2.username] }

        schema type: :object,
          properties: {
            talents: {
              type: :array,
              items: {
                type: :object,
                properties: PublicAPI::ObjectProperties::DETAILED_TALENT_PROPERTIES
              }
            },
            pagination: {
              type: :object,
              properties: PublicAPI::ObjectProperties::PAGINATION_PROPERTIES
            }
          }

        run_test! do |response|
          data = JSON.parse(response.body)

          returned_talents = data["talents"]
          returned_usernames = returned_talents.map { |f| f["username"] }
          returned_pagination = data["pagination"]
          aggregate_failures do
            expect(data["talents"].count).to eq 2
            expect(returned_usernames).to match_array([user_1.username, user_2.username])

            expect(returned_pagination["total"]).to eq 2
          end
        end
      end

      response "401", "unauthorized request" do
        let(:"X-API-KEY") { "invalid" }
        run_test!
      end
    end
  end

  path "/talents/{id}" do
    get "Retrieves a talent" do
      tags "Talents"
      consumes "application/json"
      produces "application/json"
      parameter name: :id, in: :path, type: :string, description: "Wallet address or username"
      parameter name: "X-API-KEY", in: :header, type: :string, description: "Your Talent Protocol API key"

      let!(:talent_user) { create(:user, :with_talent_token, wallet_id: wallet_id, display_name: "API user") }
      let(:wallet_id) { SecureRandom.hex }
      let(:id) { wallet_id }

      before do
        user_1 = create :user
        user_2 = create :user, :with_talent_token

        create :follow, user: user_1, follower: talent_user
        create :follow, user: user_2, follower: talent_user
        create :follow, user: talent_user, follower: user_1

        create :talent_supporter, supporter_wallet_id: talent_user.wallet_id, talent_contract_id: user_2.talent.talent_token.contract_id, amount: "2000000"
        create :talent_supporter, supporter_wallet_id: user_1.wallet_id, talent_contract_id: talent_user.talent.talent_token.contract_id, amount: "1000000"
      end

      response "200", "talent found", save_example: true do
        schema type: :object,
          properties: {
            talent: {
              type: :object,
              properties: PublicAPI::ObjectProperties::TALENT_PROPERTIES
            }
          }

        run_test! do |response|
          data = JSON.parse(response.body)

          returned_talent = data["talent"]
          aggregate_failures do
            expect(returned_talent["username"]).to eq(talent_user.username)
            expect(returned_talent["name"]).to eq(talent_user.name)
            expect(returned_talent["email"]).to eq(talent_user.email)
            expect(returned_talent["headline"]).to eq(talent_user.talent.headline)
            expect(returned_talent["wallet_address"]).to eq(talent_user.wallet_id)
            expect(returned_talent["profile_picture_url"]).to eq(talent_user.profile_picture_url)
            expect(returned_talent["followers_count"]).to eq(1)
            expect(returned_talent["following_count"]).to eq(2)
            expect(returned_talent["supporters_count"]).to eq(1)
            expect(returned_talent["supporting_count"]).to eq(1)
          end
        end
      end

      response "404", "talent not found" do
        let(:id) { "invalid" }
        run_test!
      end

      response "401", "unauthorized request" do
        let(:"X-API-KEY") { "invalid" }
        run_test!
      end
    end
  end
end
