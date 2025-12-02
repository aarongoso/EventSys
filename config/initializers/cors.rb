# config/initializers/cors.rb

# This configuration allows React frontend (on port 3001)
# to make requests to Rails backend API (on port 3000)
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # keeping localhost for dev (from labs)
    origins "http://localhost:3000",
            "http://localhost:3001",
            "https://startling-lokum-604bb4.netlify.app"  # added Netlify domain

    resource "*",
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: false
  end
end
