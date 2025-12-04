class EmailController < ApplicationController
  # POST /send_confirmation
  def send_confirmation
    # static user id (no Devise)
    # making sure demo user always exists (same fix used in BookingsController)
    user = User.find_or_create_by(id: 1) do |u|
      u.name = "Demo User"      # fallback user for testing
      u.email = "demo@example.com"   # using lab style seed values
    end

    # fetch event normally
    event = Event.find(params[:event_id])

    # Real email via Letter Opener
    # following examples from ActionMailer lecture
    if Rails.env.development?
      UserMailer.booking_confirmation(user, event).deliver_now
      return render json: { message: "Email preview opened (development mode)." }, status: :ok
    end


    # Render Simulates email instead of sending
    # avoids SMTP errors because cloud deploys dont provide port 25 which is causing the error
    Rails.logger.info "Simulated email send to #{user.email} for event #{event.title}"

    render json: {
      message: "Confirmation email sent successfully (simulated in production)."
    }, status: :ok

  rescue StandardError => e
    # basic error handling pattern fromm labs
    render json: { error: e.message }, status: :unprocessable_entity
  end
end
