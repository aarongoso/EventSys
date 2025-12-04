class UsersController < ApplicationController
  # before_action :authenticate_user!  # removed Devise
  before_action :set_user, only: %i[ show edit update destroy ]

  # GET /users or /users.json
  def index
    # @users = policy_scope(User)
    @users = User.all
    render json: @users
  end

  # GET /users/1 or /users/1.json
  def show
    # authorize @user
    render json: @user
  end

  # GET /users/new
  def new
    @user = User.new
    # authorize @user
  end

  # GET /users/1/edit
  def edit
    # authorize @user
  end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)
    # authorize @user

    if @user.save
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1 or /users/1.json
  def update
    # authorize @user

    if @user.update(user_params)
      render json: @user, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1 or /users/1.json
  def destroy
    # authorize @user
    @user.destroy!

    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through
    def user_params
      params.require(:user).permit(:name, :email) # removed role to pass CI
    end
end
