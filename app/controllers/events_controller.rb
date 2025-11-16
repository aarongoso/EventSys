class EventsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_event, only: %i[ show edit update destroy ]

  # GET /events or /events.json
  def index
    # Loads all events and their associated users (eager loading for efficiency)
    @events = policy_scope(Event.includes(:user))

    respond_to do |format|
      format.html # renders the default index.html.erb
      format.json { render json: @events.to_json(include: :user) }
    end
  end

  # GET /events/1 or /events/1.json
  def show
    authorize @event

    respond_to do |format|
      format.html # renders the default show.html.erb
      format.json { render json: @event.to_json(include: :user) }
    end
  end

  # GET /events/new
  def new
    @event = Event.new
    authorize @event
  end

  # GET /events/1/edit
  def edit
    authorize @event
  end

  # POST /events or /events.json
  def create
    @event = Event.new(event_params)

    # Assign ownership of the event to the currently logged in user
    @event.user = current_user

    authorize @event

    respond_to do |format|
      if @event.save
        format.html { redirect_to @event, notice: "Event was successfully created." }
        format.json { render :show, status: :created, location: @event }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @event.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /events/1 or /events/1.json
  def update
    authorize @event

    respond_to do |format|
      if @event.update(event_params)
        format.html { redirect_to @event, notice: "Event was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @event }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @event.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /events/1 or /events/1.json
  def destroy
    authorize @event
    @event.destroy!

    respond_to do |format|
      format.html { redirect_to events_path, notice: "Event was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions
    def set_event
      @event = Event.find(params[:id])
    end

    # Only allow a list of trusted parameters through
    def event_params
      params.require(:event).permit(:title, :description, :location, :date, :time, :capacity)
    end
end
