source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.0.3"
# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem "propshaft"
# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"
# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"
# Use JavaScript with ESM import maps [https://github.com/rails/importmap-rails]
gem "importmap-rails"
# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "turbo-rails"
# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem "stimulus-rails"
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Removed Solid* gems because they require extra DB connections
# caused deployment errors on Render
# Keeping this commented so I remember what happened
# gem "solid_cache"
# gem "solid_queue"
# gem "solid_cable"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Remove
# gem "kamal", require: false

# Remove
# gem "thruster", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"

  # Omakase Ruby styling [https://github.com/rails/rubocop-rails-omakase/]
  gem "rubocop-rails-omakase", require: false

  gem "dotenv-rails" # loading env vars from .env file
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"
  # Letter Opener to preview emails in the browser instead of sending real emails
  gem "letter_opener"
  gem "letter_opener_web"
end
# Development and Testing Tools
group :development, :test do
  gem "rspec-rails"
  gem "shoulda-matchers", "~> 7.0"
  gem "brakeman"
  gem "rubocop", require: false
  gem "factory_bot_rails"
end

# Frontend UI and Forms
gem "bootstrap", "~> 5.3.0"
gem "simple_form"
gem "jquery-rails"

gem "sassc-rails"

gem "rack-cors", "~> 3.0"
# gem "devise", "~> 4.9"   # commented out after removing Devise
# gem "pundit", "~> 2.5"   # commented out after removing Pundit
