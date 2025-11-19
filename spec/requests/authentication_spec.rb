require 'rails_helper'

# Basic tests for Devise authentication (sign up, sign in, sign out)
RSpec.describe "User Authentication", type: :request do
  
  describe "GET /users/sign_in" do
    it "renders the login page successfully" do
      get new_user_session_path
      expect(response).to be_successful
    end
  end

  describe "POST /users/sign_in" do
    let!(:user) { User.create!(name: "Test", email: "user@mail.com", password: "password") }

    it "logs the user in with valid credentials" do
      post user_session_path, params: {
        user: { email: user.email, password: "password" }
      }
      expect(response).to redirect_to(events_path)
    end

    it "rejects login with wrong password" do
      post user_session_path, params: {
        user: { email: user.email, password: "wrongpass" }
      }
      expect(response.body).to include("Invalid Email or password")
    end
  end

  describe "POST /users" do
    it "successfully signs a user up" do
      expect {
        post user_registration_path, params: {
          user: {
            name: "New User",
            email: "new@mail.com",
            password: "password123",
            password_confirmation: "password123"
          }
        }
      }.to change(User, :count).by(1)
    end
  end

  describe "DELETE /users/sign_out" do
    let!(:user) { User.create!(name: "Test", email: "abc@mail.com", password: "password") }

    it "logs out a signed-in user" do
      # Sign user in
      sign_in user

      delete destroy_user_session_path

      expect(response).to redirect_to(new_user_session_path)
    end
  end
end
