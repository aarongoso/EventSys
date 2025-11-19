class BookingsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_booking, only: %i[ show edit update destroy ]

  # Pundit verification
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  # GET /bookings or /bookings.json
  # Displays all bookings (for admin or listing view)
  def index
    @bookings = policy_scope(Booking)  # Pundit: limits bookings by role
  end

  # GET /bookings/1 or /bookings/1.json
  def show
    authorize @booking  # Pundit authorization check
  end

  # GET /bookings/new
  # Displays the form to create a new booking
  def new
    @booking = Booking.new
    authorize @booking
  end

  # GET /bookings/1/edit
  # Displays the form to edit an existing booking
  def edit
    authorize @booking
  end

  # POST /bookings or /bookings.json
  # Handles creation of a new booking record
  def create
    @booking = Booking.new(booking_params)

    # Automatically assign the logged-in user
    @booking.user_id = current_user.id

    authorize @booking

    respond_to do |format|
      if @booking.save
        format.html { redirect_to @booking, notice: "Booking was successfully created." }
        format.json { render :show, status: :created, location: @booking }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @booking.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /bookings/1 or /bookings/1.json
  # Updates existing booking data
  def update
    authorize @booking

    respond_to do |format|
      if @booking.update(booking_params)
        format.html { redirect_to @booking, notice: "Booking was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @booking }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @booking.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /bookings/1 or /bookings/1.json
  # Deletes a booking record
  def destroy
    authorize @booking
    @booking.destroy!

    respond_to do |format|
      format.html { redirect_to bookings_path, notice: "Booking was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private

    def set_booking
      @booking = Booking.find(params[:id])
    end

    # Only allow a list of trusted parameters through
    # user_id is NOT permitted from the form (security)
    def booking_params
      params.require(:booking).permit(:event_id, :status)
    end
end
