require "rails_helper"

RSpec.describe Users::Create do
  include ActiveJob::TestHelper

  subject(:create_user) { described_class.new.call(user_creation_params) }

  let(:user_creation_params) {
    {
      email: email,
      password: password,
      username: username,
      invite_code: invite_code,
      wallet_id: wallet_id,
      gender: gender,
      nationality: nationality,
      location: location,
      headline: headline,
      career_needs: ["Mentoring others"],
      tags: ["Web3"]
    }
  }

  let(:email) { "test@talentprotocol.com" }
  let(:password) { "password" }
  let(:username) { "test" }
  let(:wallet_id) { SecureRandom.hex }
  let(:invite_code) { invite.code }
  let(:gender) { "Male" }
  let(:nationality) { "Portuguese" }
  let(:location) { "Baguim do Monte, Portugal" }
  let(:headline) { "Some random headline" }

  let(:user) { create :user, username: "jack" }
  let!(:invite) { create :invite, user: user }

  let(:notification_creator_class) { CreateNotification }
  let(:notification_creator) { instance_double(notification_creator_class, call: true) }

  before do
    allow(notification_creator_class).to receive(:new).and_return(notification_creator)
  end

  context "when a valid invite is provided" do
    it "creates a new user" do
      result = create_user
      user = result[:user]
      talent_profile_data = JSON.parse(user.talent.profile.to_json)

      expect(result[:success]).to be(true)
      expect(user).to be_persisted
      expect(user.email).to eq(email)
      expect(user.email_confirmation_token).not_to be_nil
      expect(user.invited).to eq(invite)
      expect(user.password).not_to be_nil
      expect(user.role).to eq("basic")
      expect(user.theme_preference).to eq("light")
      expect(user.username).to eq(username)
      expect(talent_profile_data["gender"]).to eq(gender)
      expect(talent_profile_data["location"]).to eq(location)
      expect(talent_profile_data["nationality"]).to eq(nationality)
      expect(talent_profile_data["headline"]).to eq(headline)
    end

    context "when a display name is provided" do
      let(:display_name) { "Jack Smith" }

      let(:user_creation_params) do
        super().tap { |params| params[:display_name] = display_name }
      end

      it "persists the display name" do
        result = create_user

        expect(result[:user].display_name).to eq(display_name)
      end
    end

    context "when a theme preference is provided" do
      let(:theme_preference) { "dark" }

      let(:user_creation_params) do
        super().tap { |params| params[:theme_preference] = theme_preference }
      end

      it "persists the theme preference" do
        result = create_user

        expect(result[:user].theme_preference).to eq(theme_preference)
      end
    end

    context "when a LinkedIn id is provided" do
      let(:linkedin_id) { SecureRandom.hex(8) }
      let(:password) { nil }

      let(:user_creation_params) do
        super().tap { |params| params[:linkedin_id] = linkedin_id }
      end

      it "persists the LinkedIn id" do
        result = create_user
        user = result[:user]

        expect(user.linkedin_id).to eq(linkedin_id)
        expect(user.password).to be_nil
      end
    end

    context "when a user with the same username already exists" do
      before do
        create :user, username: username
      end

      it "returns an error" do
        result = create_user

        expect(result[:success]).to eq(false)
        expect(result[:field]).to eq("username")
        expect(result[:error]).to eq("Username is already taken.")
      end
    end

    context "when a user with the same email already exists" do
      before do
        create :user, email: email
      end

      it "returns an error" do
        result = create_user

        expect(result[:success]).to eq(false)
        expect(result[:field]).to eq("email")
        expect(result[:error]).to eq("Email is already taken.")
      end
    end

    context "when a user with the same wallet already exists" do
      before do
        create :user, wallet_id: wallet_id
      end

      it "returns an error" do
        result = create_user

        expect(result[:success]).to eq(false)
        expect(result[:field]).to eq("wallet_id")
        expect(result[:error]).to eq("We already have that wallet in the system.")
      end
    end

    it "initializes and calls the notification creator with the correct arguments" do
      result = create_user

      aggregate_failures do
        expect(notification_creator_class).to have_received(:new)

        expect(notification_creator).to have_received(:call)
          .with(
            recipient: invite.user,
            source_id: result[:user].id,
            type: InviteUsedNotification
          )
      end
    end
  end

  context "when it is a talent invite" do
    let(:invite) { create(:invite, user: user, talent_invite: true) }

    it "creates a new user with talent as profile type" do
      create_user

      user = User.find_by(email: email)

      expect(user.profile_type).to eq("talent")
    end
  end

  context "when the username is taken" do
    before do
      create :user, username: username
    end

    it "returns an unsuccessful response" do
      expect(create_user).to eq(
        {
          success: false,
          field: "username",
          error: "Username is already taken."
        }
      )
    end
  end
end
